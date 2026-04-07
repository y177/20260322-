// === src/components/LoadingState.tsx ===

import React, { FC, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const MESSAGES = [
  '업무 내용을 분석하고 있어요...',
  '최적의 문서 구조를 설계 중이에요...',
  '전문적인 문체로 작성하고 있어요...',
  '마무리 검토 중이에요...',
];

const LoadingState: FC = () => {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx((prev) => (prev + 1) % MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-12 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex justify-center mb-6">
        <motion.div
          className="text-6xl"
          animate={{ rotate: [0, 10, -10, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          ⚡
        </motion.div>
      </div>

      <h3 className="text-xl font-bold text-gray-700 mb-2">AI가 문서를 작성하고 있어요</h3>

      <motion.p
        key={msgIdx}
        className="text-gray-500 text-sm"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
      >
        {MESSAGES[msgIdx]}
      </motion.p>

      <div className="flex justify-center gap-2 mt-6">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-blue-400"
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default LoadingState;
