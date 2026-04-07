// === netlify/functions/generate-document.ts ===

import { Handler, HandlerEvent } from '@netlify/functions';

type TaskType = 'email' | 'report' | 'minutes' | 'proposal' | 'diary' | 'summary';

interface GenerateDocumentRequest {
  taskType: TaskType;
  content: string;
}

const SYSTEM_PROMPTS: Record<TaskType, string> = {
  email: `당신은 전문 비즈니스 이메일 작성 보조 AI입니다. 한국 직장 문화에 맞는 격식체 이메일을 작성해주세요.
반드시 아래 JSON 형식만 반환하세요 (마크다운 코드블록 없이):
{"title":"이메일 제목","result":"완성된 이메일 전문"}`,

  report: `당신은 전문 업무 보고서 작성 보조 AI입니다. 체계적이고 가독성 높은 업무 보고서를 작성해주세요.
반드시 아래 JSON 형식만 반환하세요 (마크다운 코드블록 없이):
{"title":"보고서 제목","result":"완성된 보고서"}`,

  minutes: `당신은 전문 회의록 작성 보조 AI입니다. 공식 회의록 형식으로 정리해주세요.
반드시 아래 JSON 형식만 반환하세요 (마크다운 코드블록 없이):
{"title":"회의록 제목","result":"완성된 회의록"}`,

  proposal: `당신은 전문 기획서 작성 보조 AI입니다. 설득력 있는 기획서를 작성해주세요.
반드시 아래 JSON 형식만 반환하세요 (마크다운 코드블록 없이):
{"title":"기획서 제목","result":"완성된 기획서"}`,

  diary: `당신은 전문 업무 일지 작성 보조 AI입니다. 깔끔한 업무 일지로 정리해주세요.
반드시 아래 JSON 형식만 반환하세요 (마크다운 코드블록 없이):
{"title":"업무 일지","result":"완성된 업무 일지"}`,

  summary: `당신은 전문 문서 요약 보조 AI입니다. 핵심만 간결하게 요약해주세요.
반드시 아래 JSON 형식만 반환하세요 (마크다운 코드블록 없이):
{"title":"요약 제목","result":"완성된 요약"}`,
};

const TASK_LABELS: Record<TaskType, string> = {
  email: '이메일', report: '업무 보고서', minutes: '회의록',
  proposal: '기획서', diary: '업무 일지', summary: '요약',
};

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: '허용되지 않는 메서드입니다.' }) };
  }

  const apiKey = event.headers['x-api-key'] || event.headers['X-Api-Key'];
  if (!apiKey) {
    return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'API 키가 필요합니다.' }) };
  }

  let body: GenerateDocumentRequest;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: '잘못된 요청 형식입니다.' }) };
  }

  if (!body.taskType || !body.content?.trim()) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: '업무 유형과 내용을 입력해주세요.' }) };
  }

  const systemPrompt = SYSTEM_PROMPTS[body.taskType];
  if (!systemPrompt) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: '지원하지 않는 업무 유형입니다.' }) };
  }

  // 시스템 프롬프트 + 유저 메시지를 하나로 합쳐 전송 (v1 호환)
  const userMessage = `${systemPrompt}\n\n다음 내용을 바탕으로 ${TASK_LABELS[body.taskType]}을(를) 작성해주세요:\n\n${body.content}`;

  const MODEL = 'gemini-2.0-flash';
  const url = `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${apiKey}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
      }),
    });

    const resText = await res.text();

    if (res.status === 401 || res.status === 403) {
      return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: '유효하지 않은 API 키입니다.' }) };
    }
    if (res.status === 429) {
      return { statusCode: 429, headers: CORS, body: JSON.stringify({ error: 'API 사용량 한도를 초과했습니다. 잠시 후 다시 시도해주세요.' }) };
    }
    if (!res.ok) {
      return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: `Gemini API 오류 (${res.status}): ${resText}` }) };
    }

    const data = JSON.parse(resText);
    const text: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    const clean = text.trim()
      .replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();

    const parsed = JSON.parse(clean);
    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed),
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류';
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: `오류: ${message}` }) };
  }
};
