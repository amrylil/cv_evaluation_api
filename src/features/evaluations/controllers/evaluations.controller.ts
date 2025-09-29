import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../../../utils/apiResponse";
import { EvaluationsService } from "../services/evaluations.service";

const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export class EvaluationsController {
  private evaluationsService: EvaluationsService;
  constructor(evaluationsService: EvaluationsService) {
    this.evaluationsService = evaluationsService;
  }

  createEvaluations = asyncHandler(async (req: Request, res: Response) => {
    const evaluations = await this.evaluationsService.createEvaluations(req.body);
    return ApiResponse.success(res, evaluations, "Evaluations created successfully", 201);
  });

  getAllEvaluationss = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const result = await this.evaluationsService.findAllEvaluationss(page, limit);
    return ApiResponse.success(
      res,
      result.data,
      "Evaluationss fetched successfully",
      200,
      result.meta
    );
  });

  getEvaluationsById = asyncHandler(async (req: Request, res: Response) => {
    const evaluations = await this.evaluationsService.findEvaluationsById(req.params.id);
    return ApiResponse.success(res, evaluations, "Evaluations found");
  });

  updateEvaluations = asyncHandler(async (req: Request, res: Response) => {
    const evaluations = await this.evaluationsService.updateEvaluations(req.params.id, req.body);
    return ApiResponse.success(res, evaluations, "Evaluations updated successfully");
  });

  deleteEvaluations = asyncHandler(async (req: Request, res: Response) => {
    await this.evaluationsService.deleteEvaluations(req.params.id);
    return ApiResponse.success(res, null, "Evaluations deleted successfully");
  });

  restoreEvaluations = asyncHandler(async (req: Request, res: Response) => {
    const restoredEvaluations = await this.evaluationsService.restoreEvaluations(req.params.id);
    return ApiResponse.success(res, restoredEvaluations, "Evaluations restored successfully");
  });
}
