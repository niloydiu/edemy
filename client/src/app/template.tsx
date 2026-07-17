'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Template({ children }: { children: React.ReactNode }) {
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    function handleResize() {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const pathVariants = {
    initial: {
      d: `M0 0 L${dimensions.width} 0 L${dimensions.width} ${dimensions.height} Q${dimensions.width / 2} ${dimensions.height + 150} 0 ${dimensions.height} Z`
    },
    enter: {
      d: `M0 0 L${dimensions.width} 0 L${dimensions.width} 0 Q${dimensions.width / 2} 0 0 0 Z`,
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
    }
  };

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-50 w-screen h-screen">
        <svg className="w-full h-full" style={{ width: '100vw', height: '100vh' }}>
          <motion.path 
            className="fill-indigo-600 dark:fill-indigo-950/95"
            initial="initial"
            animate="enter"
            variants={pathVariants}
          />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 35, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
      >
        {children}
      </motion.div>
    </>
  );
}
