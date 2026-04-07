// === src/components/TaskInput.tsx ===

import React, { FC, useState } from 'react';
import { motion } from 'framer-motion';
import type { TaskType } from '../types/task';
import { TASKS } from './TaskSelector';

interface TaskInputProps {
  taskType: TaskType;
  onGenerate: (content: string) => void;
  onBack: () => void;
  isDisabled?: boolean;
}

const TaskInput: FC<TaskInputProps> = ({ taskType, onGenerate, onBack, isDisabled = false }) => {
  const [content, setContent] = useState('');
  const task = TASKS.find((t) => t.id === taskType)!;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && !isDisabled) {
      onGenerate(content.trim());
    }
  };

  return (
    <motion.div
      className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <motion.button
          onClick={onBack}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ← 뒤로
        </motion.button>
        <div className="flex items-center gap-2">
          <span className="text-3xl">{task.icon}</span>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{task.label}</h2>
            <p className="text-gray-500 text-xs">{task.description}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={task.placeholder}
          disabled={isDisabled}
          rows={6}
          className="w-full border-2 border-blue-200 rounded-2xl px-4 py-3 text-gray-700 focus:outline-none focus:border-blue-400 transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed text-sm leading-relaxed"
        />

        <div className="mt-3 mb-5">
          <p className="text-xs text-gray-400 mb-2">예시:</p>
          <div className="flex flex-wrap gap-2">
            {task.exampleInputs.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => setContent(example)}
                disabled={isDisabled}
                className="text-xs bg-blue-50 text-blue-600 border border-blue-200 rounded-full px-3 py-1 hover:bg-blue-100 transition-colors disabled:opacity-50"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={!content.trim() || isDisabled}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold py-4 rounded-2xl text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          whileHover={{ scale: isDisabled ? 1 : 1.02 }}
          whileTap={{ scale: isDisabled ? 1 : 0.98 }}
        >
          ⚡ AI로 {task.label} 생성하기
        </motion.button>
      </form>
    </motion.div>
  );
};

export default TaskInput;
