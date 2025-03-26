import React, { useState } from "react";
import HomePage from "./components/HomePage";
import Header from "./components/Header";
import FileDisplay from "./components/FileDisplay";
import ThreeDBackground from "./components/ThreeDBackground";

const App = () => {
  const [file, setFile] = useState(null);
  const [audioStream, setAudioStream] = useState(null);

  return (
    <div className="relative flex flex-col min-h-screen max-w-[1000px] mx-auto w-full">
      <ThreeDBackground />
      <Header />
      {file || audioStream ? (
        <FileDisplay file={file} audioStream={audioStream} />
      ) : (
        <HomePage setFile={setFile} setAudioStream={setAudioStream} />
      )}
      <footer></footer>
    </div>
  );
};

export default App;
