import React, { useEffect, useState } from "react";
import HomePage from "./components/HomePage";
import Header from "./components/Header";
import Transcribing from "./components/Transcribing";
import Information from "./components/Information";
import FileDisplay from "./components/FileDisplay";
import ThreeDBackground from "./components/ThreeDBackground";
import { AnimatePresence, motion } from "framer-motion";

const App = () => {
  const [file, setFile] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAudioAvailable = file || audioStream;

  function handleAudioReset() {
    setFile(null);
    setAudioStream(null);
    setOutput(null);
    setLoading(false);
  }

  function handleFormSubmission() {
    console.log("Transcribe clicked");
    setLoading(true);

    // Simulate async transcription
    setTimeout(() => {
      setOutput("This is a transcribed output.");
      setLoading(false);
    }, 3000);
  }

  useEffect(() => {
    console.log(audioStream);
  }, [audioStream]);

  return (
    <div className="relative flex flex-col min-h-screen max-w-[1000px] mx-auto w-full">
      <ThreeDBackground />
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
