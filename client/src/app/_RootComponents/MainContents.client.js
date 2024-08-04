'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const getRandomColor = () => {
  const colors = ['#FF6B6B', '#4CAF50', '#FFD700', '#2196F3'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const IntroContent = ({ }) => (
  <motion.div
    className={`p-4 sm:p-8 border-2 border-gray-500 flex flex-col items-center justify-center h-screen h-[90vh] bg-white`}
  >
    <motion.h1
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-4xl font-bold sm:mt-8 2xl:text-[clamp(1.375rem, 0.457rem + 0.96vw, 2.25rem)]"
    >
      incoll
    </motion.h1>
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="text-lg mt-4"
    >
      効率的な銘柄管理で、賢明な投資判断をサポート
    </motion.p>
    <motion.ul
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.8 }}
      className=""
    >
      {['迅速な銘柄登録・管理', 'スマートなカテゴリ分類', '柔軟なソート機能', '直感的な操作性'].map((item, index) => (
        <motion.li
          key={index}
          initial={{ opacity: 0, x: -20, color: getRandomColor() }}
          animate={{ opacity: 1, x: 0, color: '#1F2937' }}
          transition={{ delay: 1.2 + index * 0.2, duration: 0.5 }}
          className={`mt-8 sm:text-lg sm:mt-8`}
          whileHover={{ color: '#1F2937' }}
        >
          <motion.span
            initial={{ color: '#1F2937', fontWeight: 'normal' }}
            animate={{ color: getRandomColor(), fontWeight: 'bold' }}
            transition={{ delay: 2.2 + index * 0.2, duration: 0.5 }}
            className=""
            whileHover={{ color: '#1F2937' }}
          >
            ✓
          </motion.span>
          <span>{item}</span>
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ delay: 3.2 + index * 0.2, duration: 0.5 }}
            className=""
          />
        </motion.li>
      ))}
    </motion.ul>
  </motion.div>
);

const MainContents = () => {
  const [gridLayout, setGridLayout] = useState({
    colSpan: 10,
    colStart: 2,
    rowSpan: 6,
    rowStart: 4
  });

  return (
    <div className="grid grid-cols-12 grid-rows-12 h-screen bg-[url('/TopPageBackground.jpg')] bg-cover bg-center text-base sm:text-lg md:text-xl">
      <div className={`col-span-${gridLayout.colSpan} col-start-${gridLayout.colStart} row-span-${gridLayout.rowSpan} row-start-${gridLayout.rowStart} flex flex-col items-center h-full`}>
        <IntroContent />
      </div>
    </div>
  );
}

export default MainContents