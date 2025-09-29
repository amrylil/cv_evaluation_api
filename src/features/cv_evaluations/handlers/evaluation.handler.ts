import { Request, Response } from "express";
import { EvaluateRequest } from "../dtos/evaluate.dto";
import { IEvaluationService } from "../contract";
import { evaluationService } from "../usecases/evaluations.usecase";
import { UploadRequest, UploadResponse } from "../dtos/upload.dto";
import { Task } from "../entities/task";

export class evaluationController {
  private evaluationService: IEvaluationService;
  private tasks: Record<string, Task> = {};

  constructor(service?: IEvaluationService) {
    this.evaluationService = service || new evaluationService();
    this.uploadCV = this.uploadCV.bind(this);
    this.evaluate = this.evaluate.bind(this);
    this.getResult = this.getResult.bind(this);
  }

  async uploadCV(req: Request, res: Response) {
    const { cv, project } = req.body as UploadRequest;
    const id = Date.now().toString();
    this.tasks[id] = { id, status: "uploaded", cv, project };

    const response: UploadResponse = { id, status: "uploaded" };
    res.json(response);
  }

  async evaluate(req: Request, res: Response) {
    const { id } = req.body as EvaluateRequest;
    if (!this.tasks[id])
      return res.status(404).json({ error: "Task not found" });

    this.tasks[id].status = "queued";
    res.json({ id, status: "queued" });

    setTimeout(
      () => this.evaluationService.processEvaluation(this.tasks[id]),
      2000
    );
  }

  async getResult(req: Request, res: Response) {
    const { id } = req.params;
    if (!this.tasks[id])
      return res.status(404).json({ error: "Task not found" });

    res.json(this.tasks[id]);
  }
}
