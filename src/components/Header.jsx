import React from 'react';
import { FaPlus } from 'react-icons/fa';

const Header = () => {
  return (
    <div>
      <header className='flex items-center justify-between gap-4 p-4'>
        <h1 className='font-semibold'>Voice<span className='text-blue-400'>Transcribe</span></h1>
        <button className='flex items-center gap-2'>
          <p className='font-semibold'>New</p>
          <FaPlus />
        </button>
      </header>
    </div>
  );
}

export default Header;

