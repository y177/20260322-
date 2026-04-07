import React, { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApiKeySetup from './components/ApiKeySetup';
import TaskSelector from './components/TaskSelector';
import TaskInput from './components/TaskInput';
import ResultViewer from './components/ResultViewer';
import LoadingState from './components/LoadingState';
import { useApiKey } from './hooks/useApiKey';
import { useTaskGeneration } from './hooks/useTaskGeneration';
import type { TaskType } from './types/task';

const App: FC = () => {
  const { apiKey, hasApiKey, saveApiKey, clearApiKey, validateApiKey } = useApiKey();
  const { state, selectTask, generate, reset, backToSelect } = useTaskGeneration();
  const [showApiModal, setShowApiModal] = useState(!hasApiKey);

  const handleTaskSelect = (taskType: TaskType) => {
    if (!hasApiKey) { setShowApiModal(true); return; }
    selectTask(taskType);
  };

  const handleGenerate = (content: string) => {
    if (!state.taskType) return;
    generate(state.taskType, content, apiKey);
  };

  const handleApiKeySave = (key: string) => {
    saveApiKey(key);
    setShowApiModal(false);
  };

  const handleRetry = () => {
    if (state.taskType) backToSelect(state.taskType);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 font-sans">
      <header className="w-full px-6 py-4 flex items-center justify-between max-w-3xl mx-auto">
        <motion.div className="flex items-center gap-2 cursor-pointer" onClick={reset}
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} whileHover={{ scale: 1.03 }}>
          <span className="text-2xl">⚡</span>
          <h1 className="text-xl font-bold text-blue-700">직장인 AI 업무 자동화</h1>
        </motion.div>
        <motion.button onClick={() => setShowApiModal(true)}
          className="text-sm text-blue-500 border border-blue-200 rounded-full px-3 py-1.5 hover:bg-blue-50 transition-colors"
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
          🔑 API 키 {hasApiKey ? '변경' : '설정'}
        </motion.button>
      </header>

      <ApiKeySetup isOpen={showApiModal} onSave={handleApiKeySave} onValidate={validateApiKey} />

      <main className="px-4 pb-16 max-w-3xl mx-auto">
        {!hasApiKey && (
          <motion.div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6 text-center"
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-yellow-700 text-sm">
              ⚠️ Google Gemini API 키를 먼저 설정해주세요.{' '}
              <button onClick={() => setShowApiModal(true)} className="font-semibold underline">설정하기</button>
            </p>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {state.step === 'idle' && (
            <motion.div key="selector" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <TaskSelector onSelect={handleTaskSelect} />
            </motion.div>
          )}
          {state.step === 'selected' && state.taskType && (
            <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <TaskInput taskType={state.taskType} onGenerate={handleGenerate} onBack={reset} isDisabled={!hasApiKey} />
            </motion.div>
          )}
          {state.step === 'generating' && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LoadingState />
            </motion.div>
          )}
          {state.step === 'done' && state.taskType && (
            <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ResultViewer taskType={state.taskType} title={state.title} result={state.result} onReset={reset} onRetry={handleRetry} />
            </motion.div>
          )}
          {state.step === 'error' && (
            <motion.div key="error" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 text-center">
              <div className="text-5xl mb-4">😢</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">오류가 발생했어요</h3>
              <p className="text-red-500 text-sm mb-6 bg-red-50 rounded-xl p-3">{state.error}</p>
              <div className="flex gap-3 max-w-xs mx-auto">
                <motion.button onClick={handleRetry}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold py-3 rounded-2xl"
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>다시 시도</motion.button>
                <motion.button onClick={reset}
                  className="flex-1 bg-gray-100 text-gray-600 font-bold py-3 rounded-2xl"
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>처음으로</motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="text-center text-xs text-gray-400 pb-6">
        <p>직장인 AI 업무 자동화 · Powered by Google Gemini</p>
      </footer>
    </div>
  );
};

export default App;
