import { useState, useEffect, useRef } from "react";
import { FaMicrophone } from "react-icons/fa";
import { motion } from "framer-motion";

// PulsingDots Component
const PulsingDots = () => (
  <div className="flex items-center gap-1 w-6 justify-center">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="w-1.5 h-1.5 bg-red-500 rounded-full"
        animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
      />
    ))}
  </div>
);

// Timer Component
const Clock = ({ isVisible }) => {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setTime((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds++;
        if (seconds === 60) {
          seconds = 0;
          minutes++;
        }
        if (minutes === 60) {
          minutes = 0;
          hours++;
        }
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <motion.div
      className="absolute top-10 text-5xl font-bold text-white bg-gray-800 px-6 py-2 rounded-xl shadow-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {String(time.hours).padStart(2, "0")} {" : "}
      {String(time.minutes).padStart(2, "0")} {" : "}
      {String(time.seconds).padStart(2, "0")}
    </motion.div>
  );
};

const HomePage = ({ setFile, setAudioStream }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef(null);
  const mimeType = "audio/webm";

  useEffect(() => {
    if (isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  }, [isRecording]);

  async function startRecording() {
    let tempStream;
    try {
      tempStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
    } catch (err) {
      console.log(err.message);
      return;
    }

    const media = new MediaRecorder(tempStream, { type: mimeType });
    mediaRecorder.current = media;

    let localAudioChunks = [];

    mediaRecorder.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        localAudioChunks.push(event.data);
      }
    };

    mediaRecorder.current.start();

    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(localAudioChunks, { type: mimeType });
      setAudioStream(audioBlob);
    };
  }

  async function stopRecording() {
    if (!mediaRecorder.current) return;
    mediaRecorder.current.stop();
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <Clock isVisible={isRecording} />
      <main className="p-4 flex flex-col gap-6 sm:gap-8 md:gap-10 text-center pb-20">
        <motion.h1
          className="font-semibold text-5xl sm:text-6xl md:text-7xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Voice<span className="text-blue-500 font-bold">Transcribe</span>
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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          whileTap={{ scale: 0.95 }}
          whileHover={isRecording ? {} : { scale: 1.05 }}
          whileInView={isRecording ? { scale: [1, 1.1, 1] } : {}}
          onClick={() => setIsRecording(!isRecording)}
        >
          <span>{isRecording ? "Recording" : "Record"}</span>
          {isRecording && <PulsingDots />}
          <FaMicrophone
            className={`text-2xl transition-colors duration-300 ${
              isRecording ? "text-red-500 animate-pulse-mic" : "text-blue-400"
            }`}
          />
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
            upload
            <input
              className="hidden"
              type="file"
              accept=".mp3,.wav"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>{" "}
          an MP3 file
        </motion.p>
      </main>
    </div>
  );
};

export default HomePage;



