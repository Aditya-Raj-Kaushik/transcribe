import React, { useState } from 'react';
import HomePage from './components/HomePage';
import Header from './components/Header';
import FileDisplay from './components/FileDisplay';

const App = () => {

  const [File, SetFile] = useState(null)
  const [audioStream, SetAudioStream] = useState(null)

  const isAudioAvailable = file || audioStream
  return (
    <div className='flex flex-col min-h-screen max-w-[1000px] mx-auto w-full'>
      <Header /> 
       {isAudioAvailable ? (
        <FileDisplay/>
       ) : (
       <HomePage setFile={setFile} setAudioStream={setAudioStream}/>
       )}
      
      <footer ></footer>
    </div>
  );
}

export default App;

