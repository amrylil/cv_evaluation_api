import { Document, EvaluationTask, EvaluationStatus } from "@prisma/client";

export interface IEvaluationRepository {
  createDocument(filename: string, extractedText: string): Promise<Document>;
  createTask(documentId: number): Promise<EvaluationTask>;
  updateTask(
    taskId: string,
    status: EvaluationStatus,
    result?: any,
    errorMessage?: string
  ): Promise<EvaluationTask>;
  findTaskById(
    taskId: string
  ): Promise<(EvaluationTask & { cvDocument: Document | null }) | null>;
}

export interface IEvaluationService {
  uploadCv(
    filePath: string,
    filename: string
  ): Promise<{ id: string; status: string }>;
  getResult(taskId: string): Promise<EvaluationTask>;
  runEvaluation(taskId: string): Promise<any>;
}
