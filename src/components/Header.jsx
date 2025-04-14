import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Header = () => {
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
  }, []);

  return (
    <div>
      <header className='flex items-center justify-between gap-4 p-4'>
        <a href="/" className="no-underline">
          <motion.h1 
            className='font-semibold text-base flex cursor-pointer'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.span 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              Voice
            </motion.span>
            <motion.span 
              className='text-blue-500'
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              Transcribe
            </motion.span>
          </motion.h1>
        </a>

        <a href="/" className="no-underline">
          <button 
            className='specialBtn flex items-center gap-2 px-4 py-2 rounded-lg text-blue-500'
            onClick={() => setIsClicked(prev => !prev)}
          >
            <p className='font-semibold'>New</p>
            <motion.div
              key={isClicked}
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            >
              <FaPlus />
            </motion.div>
          </button>
        </a>
      </header>
    </div>
  );
}

export default Header;
