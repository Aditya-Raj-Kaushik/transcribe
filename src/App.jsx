import React, { useEffect, useState, useRef } from "react";
import HomePage from "./components/HomePage";
import Header from "./components/Header";
import Transcribing from "./components/Transcribing";
import Information from "./components/Information";
import FileDisplay from "./components/FileDisplay";
import VisualizerBackground from "./components/VisualizerBackground";
import { AnimatePresence, motion } from "framer-motion";
import { MessageTypes } from "./utils/presets";

const App = () => {
  const [file, setFile] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const isAudioAvailable = file || audioStream;

  const worker = useRef(null);

useEffect(() => {
  if (!worker.current) {
    worker.current = new Worker(new URL('./whisper.worker.js', import.meta.url), { type: 'module' });
  }

  worker.current.addEventListener('message', onMessageReceived);
  return () => {
    worker.current.removeEventListener('message', onMessageReceived);
  };
}, []);

  

  useEffect(() => {
    if (!worker.current) {
      worker.current = new Worker(
        new URL("./utils/whisper.worker.js", import.meta.url),
        { type: "module" }
      );
    }

    const onMessageReceived = (e) => {
      switch (e.data.type) {
        case MessageTypes.DOWNLOADING:
          setDownloading(true);
          console.log("DOWNLOADING");
          break;
        case MessageTypes.LOADING:
          setLoading(true);
          console.log("LOADING");
          break;
        case MessageTypes.RESULT:
          setDownloading(false);
          const finalText = e.data.results.map((r) => r.text).join(" ");
          setOutput(finalText);
          break;
        case MessageTypes.INFERENCE_DONE:
          setFinished(true);
          console.log("DONE");
          break;
        case MessageTypes.ERROR:
          console.error("Error:", e.data.message);
          break;
        default:
          break;
      }
    };

    const currentWorker = worker.current;
    currentWorker.addEventListener("message", onMessageReceived);

    return () => {
      currentWorker.removeEventListener("message", onMessageReceived);
    };
  }, []);

  async function readAudioFrom(fileOrBlob) {
    const samplingRate = 16000;
    const audioCtx = new AudioContext({ sampleRate: samplingRate });
    const arrayBuffer = await fileOrBlob.arrayBuffer();
    const decoded = await audioCtx.decodeAudioData(arrayBuffer);
    const audio = decoded.getChannelData(0);
    await audioCtx.close();
    return audio;
  }

  async function handleFormSubmission() {
    if (!file && !audioStream) return;

    const source = file || audioStream;
    const audio = await readAudioFrom(source);

    const model_name = "openai/whisper-tiny.en";

    worker.current.postMessage({
      type: MessageTypes.INFERENCE_REQUEST,
      audio,
      model_name,
    });
  }

  function handleAudioReset() {
    setFile(null);
    setAudioStream(null);
    setOutput(null);
    setLoading(false);
    setFinished(false);
    setDownloading(false);
  }

  return (
    <div className="relative flex flex-col min-h-screen max-w-[1000px] mx-auto w-full">
      <VisualizerBackground />
      <Header />

      {loading ? (
        <Transcribing />
      ) : output ? (
        <Information output={output} />
      ) : (
        <AnimatePresence mode="wait">
          {isAudioAvailable ? (
            <motion.div
              key="fileDisplay"
              initial={{ opacity: 0, rotateY: -90, scale: 0.8 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              exit={{ opacity: 0, rotateY: 90, scale: 0.8 }}
              transition={{ duration: 0.6 }}
            >
              <FileDisplay
                file={file}
                audioStream={audioStream}
                handleAudioReset={handleAudioReset}
                handleFormSubmission={handleFormSubmission}
              />
            </motion.div>
          ) : (
            <motion.div
              key="homePage"
              initial={{ opacity: 0, rotateY: 90, scale: 0.8 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              exit={{ opacity: 0, rotateY: -90, scale: 0.8 }}
              transition={{ duration: 0.6 }}
            >
              <HomePage setFile={setFile} setAudioStream={setAudioStream} />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <footer></footer>
    </div>
  );
};

export default App;
