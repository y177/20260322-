// === src/components/ResultViewer.tsx ===

import React, { FC, useState } from 'react';
import { motion } from 'framer-motion';
import type { TaskType } from '../types/task';
import { TASKS } from './TaskSelector';

interface ResultViewerProps {
  taskType: TaskType;
  title: string;
  result: string;
  onReset: () => void;
  onRetry: () => void;
}

const ResultViewer: FC<ResultViewerProps> = ({ taskType, title, result, onReset, onRetry }) => {
  const [copied, setCopied] = useState(false);
  const task = TASKS.find((t) => t.id === taskType)!;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([result], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{task.icon}</span>
          <div>
            <div className="text-white/70 text-xs">{task.label}</div>
            <h2 className="text-white font-bold text-base truncate max-w-xs">{title}</h2>
          </div>
        </div>
        <div className="flex gap-2">
          <motion.button
            onClick={handleCopy}
            className="bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {copied ? '✅ 복사됨' : '📋 복사'}
          </motion.button>
          <motion.button
            onClick={handleDownload}
            className="bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            💾 저장
          </motion.button>
        </div>
      </div>

      <div className="px-6 py-5">
        <pre className="whitespace-pre-wrap font-sans text-gray-700 text-sm leading-relaxed max-h-[60vh] overflow-y-auto">
          {result}
        </pre>
      </div>

      <div className="px-6 pb-6 flex gap-3">
        <motion.button
          onClick={onRetry}
          className="flex-1 bg-blue-50 border-2 border-blue-300 text-blue-600 font-semibold py-3 rounded-2xl text-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          🔄 다시 생성
        </motion.button>
        <motion.button
          onClick={onReset}
          className="flex-1 bg-indigo-50 border-2 border-indigo-300 text-indigo-600 font-semibold py-3 rounded-2xl text-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          ⚡ 새 업무 시작
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ResultViewer;
