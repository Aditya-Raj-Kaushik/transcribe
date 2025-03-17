import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Header = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [triggerAnimation, setTriggerAnimation] = useState(false);

  useEffect(() => {
    setTriggerAnimation(true);
  }, []);

  return (
    <div>
      <header className='flex items-center justify-between gap-4 p-4'>
        <motion.h1 
          className='font-semibold text-base flex'
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
            className='text-blue-400'
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            Transcribe
          </motion.span>
        </motion.h1>
        <button 
          className='specialBtn flex items-center gap-2 px-4 py-2 rounded-lg text-blue-400'
          onClick={() => setIsClicked(prev => !prev)}
        >
          <p className='font-semibold'>New</p>
          <motion.div
            key={isClicked}
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            <FaPlus />
          </motion.div>
        </button>
      </header>
    </div>
  );
}

export default Header;
