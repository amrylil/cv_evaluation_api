import { Task } from "./entities/task";

export interface IEvaluationService {
  initKnowledgeBase(): Promise<void>;
  processEvaluation(task: Task): Promise<void>;
}
