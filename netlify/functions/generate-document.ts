// === netlify/functions/generate-document.ts ===

import { Handler, HandlerEvent } from '@netlify/functions';

type TaskType = 'email' | 'report' | 'minutes' | 'proposal' | 'diary' | 'summary';

interface GenerateDocumentRequest {
  taskType: TaskType;
  content: string;
}

const SYSTEM_PROMPTS: Record<TaskType, string> = {
  email: `당신은 전문 비즈니스 이메일 작성 보조 AI입니다.
사용자가 전달하고자 하는 내용을 입력하면, 한국 직장 문화에 맞는 격식체의 이메일을 작성해주세요.
반드시 아래 JSON 형식으로만 응답하세요:
{"title":"이메일 제목","result":"완성된 이메일 전문 (수신자, 발신자, 제목, 본문, 마무리 인사 포함)"}`,

  report: `당신은 전문 업무 보고서 작성 보조 AI입니다.
사용자가 보고할 업무 내용을 입력하면, 체계적이고 가독성 높은 업무 보고서를 작성해주세요.
반드시 아래 JSON 형식으로만 응답하세요:
{"title":"보고서 제목","result":"완성된 보고서 (개요, 주요 내용, 현황, 결론 및 향후 계획 포함)"}`,

  minutes: `당신은 전문 회의록 작성 보조 AI입니다.
사용자가 회의에서 다룬 내용을 입력하면, 공식 회의록 형식으로 정리해주세요.
반드시 아래 JSON 형식으로만 응답하세요:
{"title":"회의록 제목","result":"완성된 회의록 (일시, 참석자(미기재), 안건, 논의 내용, 결정 사항, 향후 액션 아이템 포함)"}`,

  proposal: `당신은 전문 기획서 작성 보조 AI입니다.
사용자가 기획 아이디어나 목표를 입력하면, 설득력 있는 기획서를 작성해주세요.
반드시 아래 JSON 형식으로만 응답하세요:
{"title":"기획서 제목","result":"완성된 기획서 (배경 및 목적, 현황 분석, 제안 내용, 기대 효과, 실행 계획 포함)"}`,

  diary: `당신은 전문 업무 일지 작성 보조 AI입니다.
사용자가 오늘 수행한 업무를 입력하면, 깔끔하고 보기 좋은 업무 일지로 정리해주세요.
반드시 아래 JSON 형식으로만 응답하세요:
{"title":"업무 일지","result":"완성된 업무 일지 (날짜(오늘), 주요 업무, 완료 사항, 미완료 사항 및 사유, 특이 사항, 내일 계획 포함)"}`,

  summary: `당신은 전문 문서 요약 보조 AI입니다.
사용자가 입력한 내용을 핵심만 간결하게 요약해주세요.
반드시 아래 JSON 형식으로만 응답하세요:
{"title":"요약 제목","result":"완성된 요약 (핵심 요약(3-5줄), 주요 포인트(불릿 포인트), 결론 또는 액션 아이템 포함)"}`,
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

  // Gemini REST API v1 직접 호출 (SDK 미사용)
  const MODEL = 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${apiKey}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{
          role: 'user',
          parts: [{ text: `다음 내용을 바탕으로 ${TASK_LABELS[body.taskType]}을(를) 작성해주세요:\n\n${body.content}` }],
        }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
      }),
    });

    if (res.status === 400) {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: '잘못된 요청입니다. 내용을 확인해주세요.' }) };
    }
    if (res.status === 401 || res.status === 403) {
      return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: '유효하지 않은 API 키입니다. API 키를 다시 확인해주세요.' }) };
    }
    if (res.status === 429) {
      return { statusCode: 429, headers: CORS, body: JSON.stringify({ error: 'API 사용량 한도를 초과했습니다. 잠시 후 다시 시도해주세요.' }) };
    }
    if (!res.ok) {
      const errText = await res.text();
      return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: `API 오류: ${errText}` }) };
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

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
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: `문서 생성 중 오류가 발생했습니다: ${message}` }) };
  }
};
