export type TaskStatus =
  | "uploaded"
  | "queued"
  | "processing"
  | "completed"
  | "failed";

export interface Task {
  id: string;
  status: TaskStatus;
  cv?: string;
  project?: string;
  result?: any;
  error?: string;
}

export interface KnowledgeBaseItem {
  text: string;
  vector: number[];
}
