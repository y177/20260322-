// === src/types/task.ts ===

export type TaskType =
  | 'email'
  | 'report'
  | 'minutes'
  | 'proposal'
  | 'diary'
  | 'summary';

export interface TaskMeta {
  id: TaskType;
  label: string;
  icon: string;
  description: string;
  placeholder: string;
  exampleInputs: string[];
}

export interface TaskInput {
  taskType: TaskType;
  content: string;
}

export interface GenerateDocumentRequest {
  taskType: TaskType;
  content: string;
}

export interface GenerateDocumentResponse {
  title: string;
  result: string;
}

export type GenerationStep = 'idle' | 'selected' | 'generating' | 'done' | 'error';

export interface GenerationState {
  step: GenerationStep;
  taskType: TaskType | null;
  title: string;
  result: string;
  error: string | null;
}
