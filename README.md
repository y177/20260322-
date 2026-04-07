# ⚡ 직장인 AI 업무 자동화

> Google Gemini AI를 활용해 이메일, 보고서, 회의록, 기획서 등 업무 문서를 자동 생성하는 웹 앱입니다.

---

## 1. 프로그램 소개

**직장인 AI 업무 자동화**는 업무 내용을 간략히 입력하면 AI가 전문적인 문서로 자동 작성해주는 도구입니다.

| 항목 | 내용 |
|------|------|
| 사용 대상 | 직장인, 팀장, 기획자, 관리자 |
| 배포 방식 | 웹 앱 (브라우저 접속) — 별도 설치 불필요 |
| 필요 조건 | Google Gemini API 키 (무료 발급 가능) |
| 데이터 보안 | API 키는 본인 기기 브라우저에만 저장, 서버 전송 없음 |

---

## 2. 지원 업무 유형

| 아이콘 | 유형 | 설명 |
|--------|------|------|
| 📧 | 이메일 작성 | 업무 이메일을 전문적으로 작성 |
| 📊 | 업무 보고서 | 업무 결과를 체계적인 보고서로 정리 |
| 📝 | 회의록 작성 | 회의 내용을 정리된 회의록으로 변환 |
| 💡 | 기획서 작성 | 아이디어를 설득력 있는 기획서로 작성 |
| 📅 | 업무 일지 | 오늘 한 일을 깔끔한 업무 일지로 정리 |
| ✂️ | 내용 요약 | 긴 문서나 내용을 핵심만 간결하게 요약 |

---

## 3. 실행 방법 (사용자용)

### ① API 키 발급
1. [Google AI Studio](https://aistudio.google.com) 접속
2. 우측 상단 **"Get API key"** → **"Create API key"** 클릭
3. 발급된 키(`AIza...`로 시작)를 복사

### ② 앱 사용
1. 앱에 접속 후 **"🔑 API 키 설정"** 클릭
2. API 키 입력 후 저장
3. 원하는 업무 유형 선택
4. 내용 입력 후 **"⚡ AI로 생성하기"** 클릭
5. 생성된 문서를 복사하거나 `.txt`로 저장

---

## 4. 개발자용 실행 방법

```bash
# 패키지 설치
npm install

# Netlify CLI 설치 (처음 한 번만)
npm install -g netlify-cli

# 개발 서버 시작
netlify dev
```

브라우저에서 `http://localhost:8888` 접속

```bash
# 프로덕션 빌드
npm run build
```

---

## 5. 프로젝트 구조

```
office-automation/
├── src/
│   ├── App.tsx                        # 메인 앱 컴포넌트
│   ├── config.ts                      # 앱 설정
│   ├── components/
│   │   ├── ApiKeySetup.tsx            # API 키 입력 모달
│   │   ├── TaskSelector.tsx           # 업무 유형 선택 화면
│   │   ├── TaskInput.tsx              # 업무 내용 입력 폼
│   │   ├── ResultViewer.tsx           # 생성 결과 표시/복사/저장
│   │   └── LoadingState.tsx           # 생성 중 로딩 화면
│   ├── hooks/
│   │   ├── useApiKey.ts               # API 키 관리
│   │   └── useTaskGeneration.ts       # 문서 생성 로직
│   ├── types/
│   │   └── task.ts                    # TypeScript 타입 정의
│   └── utils/
│       └── logger.ts                  # 실행 로그 유틸리티
├── netlify/
│   └── functions/
│       └── generate-document.ts       # AI 문서 생성 서버리스 함수
├── netlify.toml                       # Netlify 배포 설정
└── package.json
```

---

## 6. 기술 스택

| 구분 | 기술 |
|------|------|
| 프론트엔드 | React 18, TypeScript, Tailwind CSS, Framer Motion |
| 백엔드 | Netlify Functions (서버리스) |
| AI | Google Gemini 2.0 Flash |
| 배포 | Netlify |

---

## 7. 배포 방법

```bash
# Netlify CLI로 배포
netlify deploy --prod
```

또는 GitHub 저장소를 Netlify에 연결하면 push 시 자동 배포됩니다.

---

## 8. 자주 묻는 질문

**Q. API 키가 안전한가요?**  
A. 키는 사용자 브라우저(localStorage)에만 저장됩니다. 서버나 다른 곳으로 전송되지 않습니다.

**Q. 생성된 문서를 어떻게 저장하나요?**  
A. 결과 화면에서 "📋 복사" 또는 "💾 저장" 버튼을 사용하세요.

**Q. 무료로 사용할 수 있나요?**  
A. Google Gemini API 무료 플랜으로 충분히 사용 가능합니다.

---

*직장인 AI 업무 자동화 · Powered by Google Gemini*
