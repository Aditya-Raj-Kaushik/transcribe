import { useState, useEffect, useRef } from "react";
import { FaMicrophone } from "react-icons/fa";
import { motion } from "framer-motion";

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
      {String(time.hours).padStart(2, "0")} :
      {String(time.minutes).padStart(2, "0")} :
      {String(time.seconds).padStart(2, "0")}
    </motion.div>
  );
};

const HomePage = ({ setFile, setAudioStream }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [dotAnimation, setDotAnimation] = useState("");
  const mediaRecorder = useRef(null);
  const mimeType = "audio/webm";

  useEffect(() => {
    if (isRecording) {
      startRecording();
      let dots = [".", "..", "..."];
      let i = 0;
      const interval = setInterval(() => {
        setDotAnimation(dots[i]);
        i = (i + 1) % dots.length;
      }, 500);
      return () => clearInterval(interval);
    } else {
      stopRecording();
      setDotAnimation("");
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
    setRecordingStatus("recording");

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
    setRecordingStatus("inactive");
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
          onClick={() => setIsRecording(!isRecording)}
        >
          <span> {isRecording ? `Recording${dotAnimation}` : "Record"} </span>
          <FaMicrophone
            className={`text-2xl ${isRecording ? "text-red-500" : "text-gray-700"}`}
          />
        </motion.button>
      </main>
    </div>
  );
};

export default HomePage;
