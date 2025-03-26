import React from "react";

const FileDisplay = ({
  file,
  audioStream,
  handleAudioReset,
  handleFormSubmission,
}) => {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 sm:gap-8 md:gap-10 text-center pb-20">
      <h1 className="font-semibold text-4xl sm:text-5xl md:text-6xl">
        Your <span className="text-blue-400 font-bold">File</span>
      </h1>

      {file && <p className="text-lg text-gray-700">Uploaded: {file.name}</p>}

      {audioStream && (
        <audio controls className="mx-auto">
          <source src={URL.createObjectURL(audioStream)} type="audio/webm" />
          Your browser does not support the audio element.
        </audio>
      )}

      <div className="flex items-center justify-between gap-4 mt-4">
        <button
          onClick={handleAudioReset}
          className="text-gray-500 border border-gray-400 px-4 py-2 rounded-lg transition-all duration-300 ease-in-out hover:text-white hover:border-white hover:bg-transparent"
        >
          Reset
        </button>
        <button
          onClick={handleFormSubmission}
          className="text-white border border-white px-5 py-3 rounded-lg font-medium transition-all transform hover:scale-110"
        >
          <span className="inline-block">Transcribe</span>
        </button>
      </div>
    </main>
  );
};

export default FileDisplay;
