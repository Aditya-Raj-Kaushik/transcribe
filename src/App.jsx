import React from 'react';
import HomePage from './components/HomePage';
import Header from './components/Header';

const App = () => {
  return (
    <div className='flex flex-col min-h-screen max-w-[1000px] mx-auto w-full'>
      <Header />
      <main className='flex-1'> 
        <HomePage />
      </main>
      <footer ></footer>
    </div>
  );
}

export default App;

