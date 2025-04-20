import { pipeline } from '@xenova/transformers';
import { MessageTypes } from './presets';

// Optional utility for JSON fetch (not used right now)
async function getModelJSON(modelPath) {
    try {
        const response = await fetch(modelPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error(`Expected JSON but received: ${contentType}`);
        }

        const jsonData = await response.json();
        return jsonData;
    } catch (error) {
        console.error("Error fetching or parsing model:", error);
        throw error;
    }
}

class MyTranscriptionPipeline {
    static task = 'automatic-speech-recognition';
    static model = 'Xenova/whisper-tiny.en';
    static instance = null;

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            this.instance = await pipeline(this.task, this.model, { progress_callback });
        }
        return this.instance;
    }
}

self.addEventListener('message', async (event) => {
    const { type, audio } = event.data;
    if (type === MessageTypes.INFERENCE_REQUEST) {
        await transcribe(audio);
    }
});

async function transcribe(audio) {
    sendLoadingMessage('loading');

    let transcriptionPipeline;
    try {
        transcriptionPipeline = await MyTranscriptionPipeline.getInstance(loadModelCallback);
    } catch (err) {
        console.error('Pipeline load failed:', err);
        sendLoadingMessage('error');
        return;
    }

    sendLoadingMessage('success');

    const strideLengthSec = 5;
    const tracker = new GenerationTracker(transcriptionPipeline, strideLengthSec);

    await transcriptionPipeline(audio, {
        top_k: 0,
        do_sample: false,
        chunk_length: 30,
        stride_length_s: strideLengthSec,
        return_timestamps: true,
        callback_function: tracker.callbackFunction.bind(tracker),
        chunk_callback: tracker.chunkCallback.bind(tracker)
    });

    tracker.sendFinalResult();
}

function sendLoadingMessage(status) {
    self.postMessage({
        type: MessageTypes.LOADING,
        status
    });
}

function loadModelCallback(data) {
    if (data.status === 'progress') {
        const { file, progress, loaded, total } = data;
        self.postMessage({
            type: MessageTypes.DOWNLOADING,
            file,
            progress,
            loaded,
            total
        });
    }
}

function sendResultMessage(results, isDone, completedUntilTimestamp) {
    self.postMessage({
        type: MessageTypes.RESULT,
        results,
        isDone,
        completedUntilTimestamp
    });
}

function sendPartialResult(result) {
    self.postMessage({
        type: MessageTypes.RESULT_PARTIAL,
        result
    });
}

class GenerationTracker {
    constructor(pipeline, strideLengthSec) {
        this.pipeline = pipeline;
        this.strideLengthSec = strideLengthSec;
        this.chunks = [];
        this.processedChunks = [];
        this.callbackCounter = 0;

        const chunkLength = pipeline?.processor?.feature_extractor?.config?.chunk_length ?? 30;
        const maxSource = pipeline?.model?.config?.max_source_positions ?? 3000;
        this.timePrecision = chunkLength / maxSource;
    }

    sendFinalResult() {
        self.postMessage({ type: MessageTypes.INFERENCE_DONE });
    }

    callbackFunction(beams) {
        this.callbackCounter++;
        if (this.callbackCounter % 10 !== 0) return;

        const bestBeam = beams?.[0];
        if (!bestBeam) return;

        let text = '';
        try {
            text = this.pipeline.tokenizer.decode(bestBeam.output_token_ids, {
                skip_special_tokens: true
            });
        } catch (err) {
            console.error('Decoding error:', err);
        }

        sendPartialResult({
            text,
            start: this.getLastTimestamp(),
            end: undefined
        });
    }

    chunkCallback(data) {
        this.chunks.push(data);

        try {
            const [text, { chunks }] = this.pipeline.tokenizer._decode_asr(this.chunks, {
                time_precision: this.timePrecision,
                return_timestamps: true,
                force_full_sequence: false
            });

            this.processedChunks = chunks.map((chunk, index) => this.formatChunk(chunk, index));
            sendResultMessage(this.processedChunks, false, this.getLastTimestamp());
        } catch (err) {
            console.error('Chunk decoding error:', err);
        }
    }

    getLastTimestamp() {
        if (this.processedChunks.length === 0) return 0;
        return this.processedChunks[this.processedChunks.length - 1].end;
    }

    formatChunk(chunk, index) {
        const { text, timestamp } = chunk;
        const [start, end] = timestamp;
        return {
            index,
            text: text?.trim() ?? '',
            start: Math.round(start),
            end: Math.round(end ?? start + 0.9 * this.strideLengthSec)
        };
    }
}
