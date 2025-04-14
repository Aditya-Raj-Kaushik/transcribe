import React from "react";

const FileDisplay = ({
  file,
  audioStream,
  handleAudioReset,
  handleFormSubmission,
}) => {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 sm:gap-8 md:gap-10 text-center pb-20">
      <h1 className="font-semibold text-4xl sm:text-5xl md:text-6xl ">
        Your <span className="text-blue-400 font-bold">File</span>
      </h1>

      {file && <p className="text-lg text-gray-200">Uploaded: {file.name}</p>}

      {audioStream && (
        <audio controls className="mx-auto w-full max-w-md">
          <source src={URL.createObjectURL(audioStream)} type="audio/webm" />
          Your browser does not support the audio element.
        </audio>
      )}

      <div className="flex items-center justify-center gap-6 mt-6 flex-wrap">
        <button
          onClick={handleAudioReset}
          className="text-gray-400 border border-gray-400 px-5 py-2 rounded-lg bg-transparent transition-all duration-300 hover:text-sky-400 hover:border-sky-400"
        >
          Reset
        </button>

        <button
          onClick={handleFormSubmission}
          className="text-gray-400 border border-gray-400 px-6 py-3 rounded-lg font-medium bg-transparent transition-all duration-300 hover:text-sky-400 hover:border-sky-400"
        >
          Transcribe
        </button>
      </div>
    </main>
  );
};

export default FileDisplay;

