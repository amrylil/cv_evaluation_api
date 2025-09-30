import { Request, Response } from "express";
import { EvaluationService } from "../usecases/evaluations.usecase";

const service = new EvaluationService();

export class EvaluationHandler {
  static async upload(req: Request, res: Response) {
    try {
      const file = (req as any).file; // pakai multer
      const result = await service.uploadCv(file.path, file.originalname);
      res.status(201).json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getResult(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await service.getResult(id);
      res.json(result);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  }

  static async runEvaluation(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await service.runEvaluation(id);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}
