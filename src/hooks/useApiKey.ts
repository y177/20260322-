import { useState, useCallback } from 'react';
import { APP_CONFIG } from '../config';
import { logger } from '../utils/logger';

const STORAGE_KEY = APP_CONFIG.apiKeyStorageKey;

export function useApiKey() {
  const [apiKey, setApiKeyState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY) || '';
  });

  const saveApiKey = useCallback((key: string) => {
    localStorage.setItem(STORAGE_KEY, key);
    setApiKeyState(key);
    logger.success('API 키 저장 완료');
  }, []);

  const clearApiKey = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setApiKeyState('');
    logger.info('API 키 삭제됨');
  }, []);

  const validateApiKey = useCallback(async (key: string): Promise<boolean> => {
    logger.info('API 키 유효성 검사 중...');
    try {
      const response = await fetch('/.netlify/functions/generate-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': key },
        body: JSON.stringify({ taskType: 'summary', content: '테스트' }),
      });
      if (response.status === 401) { logger.warn('API 키 유효성 검사 실패'); return false; }
      logger.success('API 키 유효성 검사 통과');
      return true;
    } catch {
      logger.error('API 키 유효성 검사 중 네트워크 오류');
      return false;
    }
  }, []);

  return { apiKey, hasApiKey: apiKey.length > 0, saveApiKey, clearApiKey, validateApiKey };
}
