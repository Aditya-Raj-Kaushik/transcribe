import { useState, useEffect, useRef } from "react";
import { FaMicrophone } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const HomePage = ({ setAudioStream }) => {
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [duration, setDuration] = useState(0);
  const [showTimer, setShowTimer] = useState(false);
  const mediaRecorder = useRef(null);
  const mimeType = "audio/webm";

  async function startRecording() {
    try {
      const tempStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      setRecordingStatus("recording");
      setDuration(0);
      setShowTimer(true);

      const media = new MediaRecorder(tempStream, { mimeType });
      mediaRecorder.current = media;
      let localAudioChunks = [];

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          localAudioChunks.push(event.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(localAudioChunks, { type: mimeType });
        setAudioStream(audioBlob);
      };

      mediaRecorder.current.start();
    } catch (err) {
      console.log(err.message);
    }
  }

  function stopRecording() {
    setRecordingStatus("inactive");
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
    }
  }

  useEffect(() => {
    if (recordingStatus === "inactive") return;
    const interval = setInterval(() => {
      setDuration((curr) => curr + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [recordingStatus]);

  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  }, [isRecording]);

  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <main className="p-4 flex flex-col gap-6 sm:gap-8 md:gap-10 text-center pb-20 relative">
        <motion.h1
          className="font-semibold text-5xl sm:text-6xl md:text-7xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Voice<span className="text-blue-400 font-bold">Transcribe</span>
        </motion.h1>

        <motion.h3
          className="font-medium md:text-lg sm:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          Record <span className="text-blue-400">→</span> Transcribe
          <span className="text-blue-400"> →</span> Translate
        </motion.h3>

        {showTimer && (
          <motion.div
            className="absolute top-[-4rem] left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl text-white font-bold text-3xl flex gap-2"
            style={{
              background: "linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,0,0,0.8))",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 20px rgba(0, 150, 255, 0.2)",
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <motion.span
              key={duration} // Fix: Unique key
              className="block w-10 text-right"
              initial={{ rotateX: 90, opacity: 0 }}
              animate={{ rotateX: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {String(minutes).padStart(2, "0")}
            </motion.span>

            <span>:</span>

            <motion.span
              key={duration + 1} 
              className="block w-10 text-left"
              initial={{ rotateX: 90, opacity: 0 }}
              animate={{ rotateX: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {String(seconds).padStart(2, "0")}
            </motion.span>
          </motion.div>
        )}

        <motion.button
          className={`relative flex items-center justify-center text-lg gap-4 mx-auto w-72 max-w-full border-2 px-6 py-3 rounded-full overflow-hidden transition-all ${
            isRecording
              ? "border-red-500 text-red-500"
              : "border-blue-400 text-blue-400"
          }`}
          style={{
            boxShadow: isRecording
              ? "0px 14px 55px rgba(255, 96, 96, 0.35)"
              : "0px 14px 55px rgba(96, 165, 255, 0.35)",
          }}
          initial={{ opacity: 0, y: 40, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setIsRecording((prev) => !prev);
            setShowTimer(true);
          }}
        >
          <span> {isRecording ? "Recording..." : "Record"} </span>

          <motion.div
            animate={isRecording ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          >
            <FaMicrophone
              className={`text-2xl ${
                isRecording ? "text-red-500" : "text-gray-700"
              }`}
            />
          </motion.div>
        </motion.button>

        <motion.p
          className="text-black cursor-pointer hover:text-blue-400 transition duration-200"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          whileHover={{
            textShadow: "0px 0px 5px rgba(0, 150, 255, 0.6)",
            color: "rgba(0, 150, 255, 1)",
          }}
        >
          Or{" "}
          <label className="cursor-pointer text-blue-500">
            upload <input className="hidden" type="file" accept=".mp3,.wav" />
          </label>
          an MP3 file
        </motion.p>
      </main>
    </div>
  );
};

export default HomePage;
