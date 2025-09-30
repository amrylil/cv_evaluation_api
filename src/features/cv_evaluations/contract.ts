import { Document, EvaluationTask, EvaluationStatus } from "@prisma/client";
import {
  EvaluationResponseDto,
  UploadCvResponseDto,
} from "./dtos/evaluation.dto";

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
  uploadCv(filePath: string, filename: string): Promise<UploadCvResponseDto>;
  getResult(taskId: string): Promise<EvaluationResponseDto>;
  runEvaluation(
    taskId: string,
    jobDescription: string
  ): Promise<EvaluationResponseDto>;
}
