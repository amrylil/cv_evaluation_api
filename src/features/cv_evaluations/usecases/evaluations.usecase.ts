import { callOpenRouter } from "../../../utils/deepseek";
import { extractTextFromPdf } from "../../../utils/textExtractor";
import { IEvaluationService } from "../contract";
import { EvaluationRepository } from "../repositories/evaluation.repository";
import { EvaluationStatus } from "@prisma/client";
import {
  UploadCvResponseDto,
  uploadCvResponseSchema,
  EvaluationResponseDto,
  evaluationResponseSchema,
  EvaluationResultDto,
  evaluationResultSchema,
} from "../dtos/evaluation.dto";

// === Import vector & rag utils ===
import { embedText, searchRelevantChunks } from "../../../utils/vectorStore";
// embedText -> buat embedding (contoh pakai OpenAI / OpenRouter embedder)
// searchRelevantChunks -> cari chunk paling relevan dari JD / knowledge base

export class EvaluationService implements IEvaluationService {
  private repo: EvaluationRepository;

  constructor() {
    this.repo = new EvaluationRepository();
  }

  async uploadCv(
    filePath: string,
    filename: string
  ): Promise<UploadCvResponseDto> {
    const extractedText = await extractTextFromPdf(filePath);
    const document = await this.repo.createDocument(filename, extractedText);
    const task = await this.repo.createTask(document.id);

    return uploadCvResponseSchema.parse({
      id: task.id,
      status: task.status,
    });
  }

  async getResult(taskId: string): Promise<EvaluationResponseDto> {
    const task = await this.repo.findTaskById(taskId);
    if (!task) throw new Error("Task not found");

    return evaluationResponseSchema.parse({
      id: task.id,
      status: task.status,
      result: task.result
        ? evaluationResultSchema.parse(task.result)
        : undefined,
      errorMessage: task.errorMessage ?? null,
    });
  }

  /**
   * Jalankan evaluasi pakai LLM + RAG + JD
   */
  async runEvaluation(
    taskId: string,
    jobDescription?: string // opsional
  ): Promise<EvaluationResponseDto> {
    const task = await this.repo.findTaskById(taskId);
    if (!task) throw new Error("Task not found");

    if (task.status === EvaluationStatus.completed) {
      return evaluationResponseSchema.parse({
        id: task.id,
        status: task.status,
        result: task.result
          ? evaluationResultSchema.parse(task.result)
          : undefined,
        errorMessage: task.errorMessage ?? null,
      });
    }

    await this.repo.updateTask(taskId, EvaluationStatus.processing);

    // === Vector Retrieval (RAG) ===
    const cvText = task.cvDocument?.extractedText ?? "";
    const jdText = jobDescription ?? ""; // kosong kalau undefined
    const jdEmbedding = await embedText(jdText);
    const relevantChunks = await searchRelevantChunks(jdEmbedding, 5);

    const context = relevantChunks.map((c) => c.content).join("\n---\n");

    const prompt = `
You are evaluating a candidate for a specific job.

Job Description:
${jdText}

Retrieved Context (RAG):
${context}

Candidate CV:
${cvText}

Return ONLY a valid JSON object with the following fields:
{
  "cv_match_rate": number,
  "cv_feedback": string,
  "project_score": number,
  "project_feedback": string,
  "overall_summary": string
}
No explanations, no extra text, no markdown.
`;

    try {
      const rawResponse = await callOpenRouter(prompt);
      let parsed: EvaluationResultDto;

      try {
        parsed = evaluationResultSchema.parse(JSON.parse(rawResponse));
      } catch {
        throw new Error("Invalid AI response format");
      }

      const updated = await this.repo.updateTask(
        taskId,
        EvaluationStatus.completed,
        parsed
      );

      return evaluationResponseSchema.parse({
        id: updated.id,
        status: updated.status,
        result: parsed,
        errorMessage: null,
      });
    } catch (err) {
      const updated = await this.repo.updateTask(
        taskId,
        EvaluationStatus.failed,
        null,
        (err as Error).message
      );

      return evaluationResponseSchema.parse({
        id: updated.id,
        status: updated.status,
        result: undefined,
        errorMessage: (err as Error).message,
      });
    }
  }
}
