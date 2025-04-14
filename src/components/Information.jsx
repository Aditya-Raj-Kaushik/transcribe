import React, { useState } from "react";
import { motion } from "framer-motion";
import Translation from "./Translation";
import Transcription from "./Transcription";


const Information = () => {
  const [tab, setTab] = useState("transcription");

  const tabs = ["transcription", "translation"];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-10 text-center pb-20 max-w-prose w-full mx-auto px-4">
      <h1 className="font-semibold text-4xl sm:text-5xl md:text-6xl whitespace-nowrap">
        Your <span className="text-blue-500 font-bold">Transcription</span>
      </h1>

      <div className="grid grid-cols-2 bg-white shadow border border-blue-300 rounded-full overflow-hidden">
        {tabs.map((t) => (
          <motion.button
            key={t}
            onClick={() => setTab(t)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95, rotate: -1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
            className={`px-6 py-2 font-medium transition-all duration-300 ease-in-out ${
              tab === t
                ? "bg-blue-500 text-white"
                : "bg-transparent text-blue-500"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </motion.button>
        ))}
      </div>
      {tab === "transcription" ? <Transcription /> : <Translation />}
    </div>
  );
};

export default Information;
