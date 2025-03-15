import { useState, useEffect } from "react";
import { FaMicrophone } from "react-icons/fa";
import { motion } from "framer-motion";

const HomePage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [dots, setDots] = useState("");

  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setDots((prev) => (prev === "..." ? "" : prev + "."));
      }, 500); // Updates dots every 500ms
      return () => clearInterval(interval);
    } else {
      setDots(""); // Reset dots when recording stops
    }
  }, [isRecording]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <main className="p-4 flex flex-col gap-6 sm:gap-8 md:gap-10 text-center pb-20">
        
        {/* Animated Header */}
        <motion.h1 
          className="font-semibold text-5xl sm:text-6xl md:text-7xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Voice<span className="text-blue-400 font-bold">Transcribe</span>
        </motion.h1>

        {/* Animated Subheading */}
        <motion.h3 
          className="font-medium md:text-lg sm:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          Record <span className="text-blue-400">→</span> Transcribe
          <span className="text-blue-400"> →</span> Translate
        </motion.h3>

        {/* Recording Button */}
        <motion.button
          className={`relative flex items-center justify-center text-lg gap-4 mx-auto w-72 max-w-full border-2 px-6 py-3 rounded-full overflow-hidden transition-all ${
            isRecording ? "border-red-500 text-red-500" : "border-blue-400 text-blue-400"
          }`}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsRecording(!isRecording)}
        >
          {/* Static "Recording" Text */}
          <span> {isRecording ? "Recording" : "Record"} </span>

          {/* Dots Animate Separately */}
          <span className="w-6 text-left">{dots}</span>

          {/* Throbbing Microphone Animation */}
          <motion.div
            animate={isRecording ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          >
            <FaMicrophone className={`text-2xl ${isRecording ? "text-red-500" : ""}`} />
          </motion.div>
        </motion.button>

        {/* Animated File Upload Text */}
        <motion.p 
          className="text-blue-500 cursor-pointer hover:text-blue-600 transition duration-200"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          whileHover={{ textShadow: "0px 0px 5px rgba(0, 128, 255, 0.6)" }} // Subtle glow on hover
        >
          Or{" "}
          <label className="cursor-pointer">
            upload{" "}
            <input className="hidden" type="file" accept=".mp3,.wav" />
          </label>
          an MP3 file
        </motion.p>
        
      </main>
    </div>
  );
};

export default HomePage;

