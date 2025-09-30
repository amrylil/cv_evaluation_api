import { callOpenRouter } from "../../../utils/deepseek";
import { extractTextFromPdf } from "../../../utils/textExtractor";
import { IEvaluationService } from "../contract";
import { EvaluationRepository } from "../repositories/evaluation.repository";
import { EvaluationStatus } from "@prisma/client";

export class EvaluationService implements IEvaluationService {
  private repo: EvaluationRepository;

  constructor() {
    this.repo = new EvaluationRepository();
  }

  async uploadCv(filePath: string, filename: string) {
    const extractedText = await extractTextFromPdf(filePath);
    const document = await this.repo.createDocument(filename, extractedText);
    const task = await this.repo.createTask(document.id);

    return { id: task.id, status: task.status };
  }

  async getResult(taskId: string) {
    const task = await this.repo.findTaskById(taskId);
    if (!task) throw new Error("Task not found");
    return task;
  }

  async runEvaluation(taskId: string) {
    const task = await this.repo.findTaskById(taskId);
    if (!task) throw new Error("Task not found");

    await this.repo.updateTask(taskId, EvaluationStatus.processing);

    const prompt = `
You are evaluating a candidate.

Candidate CV:
${task.cvDocument?.extractedText}

Please return JSON with:
{
  "cv_match_rate": number,
  "cv_feedback": string,
  "project_score": number,
  "project_feedback": string,
  "overall_summary": string
}
    `;

    try {
      const rawResponse = await callOpenRouter(prompt);
      let parsed: any;

      try {
        parsed = JSON.parse(rawResponse);
      } catch {
        parsed = { rawResponse };
      }

      await this.repo.updateTask(taskId, EvaluationStatus.completed, parsed);
      return parsed;
    } catch (err) {
      await this.repo.updateTask(
        taskId,
        EvaluationStatus.failed,
        null,
        (err as Error).message
      );
      throw err;
    }
  }
}
