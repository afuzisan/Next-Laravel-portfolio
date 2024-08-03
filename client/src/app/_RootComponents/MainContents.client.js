'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const getRandomColor = () => {
  const colors = ['#FF6B6B', '#4CAF50', '#FFD700', '#2196F3'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const IntroContent = ({ showButton, currentContent }) => (
  <motion.div
    className={`flex flex-col items-center justify-center h-screen border-2 border-gray-500 h-[90vh] ${showButton && currentContent === 'intro' ? 'bg-black bg-opacity-50' : 'bg-white'}`}
  >
    <motion.h1
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-5xl font-bold mb-6 text-gray-800"
    >
      incoll
    </motion.h1>
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="text-2xl mb-8 text-gray-600"
    >
      効率的な銘柄管理で、賢明な投資判断をサポート
    </motion.p>
    <motion.ul
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.8 }}
      className="mb-8 space-y-4 w-full flex flex-col items-center pl-48"
    >
      {['迅速な銘柄登録・管理', 'スマートなカテゴリ分類', '柔軟なソート機能', '直感的な操作性'].map((item, index) => (
        <motion.li
          key={index}
          initial={{ opacity: 0, x: -20, color: getRandomColor() }}
          animate={{ opacity: 1, x: 0, color: '#1F2937' }}
          transition={{ delay: 1.2 + index * 0.2, duration: 0.5 }}
          className="text-lg flex w-96 pb-2"
          whileHover={{ color: '#1F2937' }}
        >
          <motion.span
            initial={{ color: '#1F2937', fontWeight: 'normal' }}
            animate={{ color: getRandomColor(), fontWeight: 'bold' }}
            transition={{ delay: 2.2 + index * 0.2, duration: 0.5 }}
            className="mr-2"
            whileHover={{ color: '#1F2937' }}
          >
            ✓
          </motion.span>
          <span>{item}</span>
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ delay: 3.2 + index * 0.2, duration: 0.5 }}
            className="absolute left-0 h-0.5"
          />
        </motion.li>
      ))}
    </motion.ul>
  </motion.div>
);

const VideoContent = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
    className="w-full h-full flex items-center justify-center"
  >
    <iframe width="1120" height="630" src="https://www.youtube.com/embed/MCbWqLZnssE?si=NKrIlUB_qREf1XxL" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
  </motion.div>
);

const MainContents = () => {
  const [currentContent, setCurrentContent] = useState('intro');
  const [showButton, setShowButton] = useState(false);
  const [timerFired, setTimerFired] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCurrentContent('video');
          setTimerFired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      className="flex flex-col items-center justify-center h-screen h-[90vh] relative"
      onMouseEnter={() => currentContent === 'intro' && timerFired && setShowButton(true)}
      onMouseLeave={() => currentContent === 'intro' && setShowButton(false)}
    >
      {countdown > 0 && (
        <div className="absolute top-4 right-4 text-2xl font-bold">
          {countdown}
        </div>
      )}
      {(showButton || currentContent === 'video') && timerFired && (
        <button
          onClick={() => setCurrentContent(currentContent === 'intro' ? 'video' : 'intro')}
          className={`absolute z-10 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors ${
            currentContent === 'intro' ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' : 'top-4 right-4'
          }`}
        >
          {currentContent === 'intro' ? '動画を見る' : '説明に戻る'}
        </button>
      )}
      {currentContent === 'intro' ? <IntroContent showButton={showButton && timerFired} currentContent={currentContent} /> : <VideoContent />}
    </div>
  );
}

export default MainContents