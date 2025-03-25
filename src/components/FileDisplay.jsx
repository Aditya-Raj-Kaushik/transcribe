import React from 'react';

const FileDisplay = ({ file, audioStream }) => {
  return (
    <main className="p-4 flex flex-col gap-6 sm:gap-8 md:gap-10 text-center pb-20">
      <h1 className="font-semibold text-4xl sm:text-5xl md:text-6xl">
        Your <span className="text-blue-400 font-bold">File</span>
      </h1>

      {file && (
        <p className="text-lg text-gray-700">Uploaded: {file.name}</p>
      )}

      {audioStream && (
        <audio controls className="mx-auto">
          <source src={URL.createObjectURL(audioStream)} type="audio/webm" />
          Your browser does not support the audio element.
        </audio>
      )}
    </main>
  );
};

export default FileDisplay;
