/**
 * 업무 자동화 문서 생성 훅
 */

import { useState, useCallback } from 'react';
import type { GenerationState, TaskType } from '../types/task';
import { logger } from '../utils/logger';

const INITIAL_STATE: GenerationState = {
  step: 'idle',
  taskType: null,
  title: '',
  result: '',
  error: null,
};

export function useTaskGeneration() {
  const [state, setState] = useState<GenerationState>(INITIAL_STATE);

  const selectTask = useCallback((taskType: TaskType) => {
    setState({ ...INITIAL_STATE, step: 'selected', taskType });
  }, []);

  const reset = useCallback(() => {
    logger.info('상태 초기화');
    setState(INITIAL_STATE);
  }, []);

  const backToSelect = useCallback((taskType: TaskType) => {
    setState({ ...INITIAL_STATE, step: 'selected', taskType });
  }, []);

  const generate = useCallback(async (taskType: TaskType, content: string, apiKey: string) => {
    logger.info('문서 생성 시작', { taskType, contentLength: content.length });
    setState((prev) => ({ ...prev, step: 'generating', error: null }));

    try {
      const res = await fetch('/.netlify/functions/generate-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({ taskType, content }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || '문서 생성에 실패했습니다.');
      }

      const data = await res.json();
      logger.success('문서 생성 완료', { title: data.title });

      setState((prev) => ({
        ...prev,
        step: 'done',
        title: data.title,
        result: data.result,
      }));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : '오류가 발생했습니다.';
      logger.error('문서 생성 실패', { message });
      setState((prev) => ({ ...prev, step: 'error', error: message }));
    }
  }, []);

  return { state, selectTask, generate, reset, backToSelect };
}
