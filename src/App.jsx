import React, { useEffect, useState } from "react";
import HomePage from "./components/HomePage";
import Header from "./components/Header";
import FileDisplay from "./components/FileDisplay";
import ThreeDBackground from "./components/ThreeDBackground";

const App = () => {
  const [file, setFile] = useState(null);
  const [audioStream, setAudioStream] = useState(null);

  const isAudioAvailable = file || audioStream;

  function handleAudioReset() {
    setFile(null);
    setAudioStream(null);
  }

  function handleFormSubmission() {
    console.log("Transcription submitted.");
    // Implement actual transcription logic here
  }

  useEffect(() => {
    console.log(audioStream);
  }, [audioStream]);

  return (
    <div className="relative flex flex-col min-h-screen max-w-[1000px] mx-auto w-full">
      <ThreeDBackground />
      <Header />
      {isAudioAvailable ? (
        <FileDisplay
          file={file}
          audioStream={audioStream}
          handleAudioReset={handleAudioReset}
          handleFormSubmission={handleFormSubmission}
        />
      ) : (
        <HomePage setFile={setFile} setAudioStream={setAudioStream} />
      )}
      <footer></footer>
    </div>
  );
};

export default App;

