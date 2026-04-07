// === src/components/TaskSelector.tsx ===

import React, { FC } from 'react';
import { motion } from 'framer-motion';
import type { TaskMeta, TaskType } from '../types/task';

const TASKS: TaskMeta[] = [
  {
    id: 'email',
    label: '이메일 작성',
    icon: '📧',
    description: '업무 이메일을 전문적으로 작성해드립니다',
    placeholder: '전달할 내용을 간략히 입력하세요\n예: 김대리에게 내일 오전 회의 일정 확인 요청',
    exampleInputs: [
      '거래처 미팅 일정 조율 요청',
      '프로젝트 완료 보고 및 감사 인사',
      '휴가 기간 업무 인수인계 안내',
    ],
  },
  {
    id: 'report',
    label: '업무 보고서',
    icon: '📊',
    description: '업무 결과를 체계적인 보고서로 정리합니다',
    placeholder: '보고할 업무 내용을 입력하세요\n예: 3월 신규 고객 유치 현황, 목표 대비 달성률',
    exampleInputs: [
      '월간 매출 실적 및 분석',
      '신규 서비스 런칭 결과 보고',
      '팀별 KPI 달성 현황 정리',
    ],
  },
  {
    id: 'minutes',
    label: '회의록 작성',
    icon: '📝',
    description: '회의 내용을 정리된 회의록으로 만들어드립니다',
    placeholder: '회의에서 다룬 내용을 입력하세요\n예: 신제품 출시 전략 논의, 마케팅 예산 배분',
    exampleInputs: [
      '주간 팀 미팅 논의 사항',
      '프로젝트 킥오프 회의',
      '고객사 요구사항 협의',
    ],
  },
  {
    id: 'proposal',
    label: '기획서 작성',
    icon: '💡',
    description: '아이디어를 설득력 있는 기획서로 작성합니다',
    placeholder: '기획 아이디어나 목표를 입력하세요\n예: 사내 복지 개선을 위한 유연근무제 도입 제안',
    exampleInputs: [
      '신규 사업 아이템 제안',
      '업무 프로세스 개선 방안',
      '고객 만족도 향상 캠페인',
    ],
  },
  {
    id: 'diary',
    label: '업무 일지',
    icon: '📅',
    description: '오늘 한 일을 깔끔한 업무 일지로 정리합니다',
    placeholder: '오늘 수행한 업무를 나열하세요\n예: 오전 고객 미팅, 오후 보고서 작성, 팀 회의 참석',
    exampleInputs: [
      '개발 작업 및 코드 리뷰',
      '영업 활동 및 고객 응대',
      '기획 업무 및 문서 작성',
    ],
  },
  {
    id: 'summary',
    label: '내용 요약',
    icon: '✂️',
    description: '긴 문서나 내용을 핵심만 간결하게 요약합니다',
    placeholder: '요약할 내용을 붙여넣으세요\n(보고서, 이메일, 기사 등 어떤 내용이든 가능)',
    exampleInputs: [
      '긴 이메일 스레드 요약',
      '계약서 핵심 조항 정리',
      '뉴스/공지 요약',
    ],
  },
];

interface TaskSelectorProps {
  onSelect: (taskType: TaskType) => void;
}

const TaskSelector: FC<TaskSelectorProps> = ({ onSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">⚡</div>
        <h2 className="text-2xl font-bold text-gray-800">어떤 업무를 자동화할까요?</h2>
        <p className="text-gray-500 text-sm mt-2">원하는 업무 유형을 선택하세요</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TASKS.map((task, idx) => (
          <motion.button
            key={task.id}
            onClick={() => onSelect(task.id)}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-5 text-left hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * idx }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-3xl mb-2">{task.icon}</div>
            <div className="font-bold text-gray-800 text-base mb-1">{task.label}</div>
            <div className="text-gray-500 text-sm">{task.description}</div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export { TASKS };
export default TaskSelector;
