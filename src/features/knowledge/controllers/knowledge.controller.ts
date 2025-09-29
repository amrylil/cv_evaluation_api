import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../../../utils/apiResponse";
import { KnowledgeService } from "../services/knowledge.service";

const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export class KnowledgeController {
  private knowledgeService: KnowledgeService;
  constructor(knowledgeService: KnowledgeService) {
    this.knowledgeService = knowledgeService;
  }

  createKnowledge = asyncHandler(async (req: Request, res: Response) => {
    const knowledge = await this.knowledgeService.createKnowledge(req.body);
    return ApiResponse.success(
      res,
      knowledge,
      "Knowledge created successfully",
      201
    );
  });

  getAllKnowledges = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const result = await this.knowledgeService.findAllKnowledges(page, limit);
    return ApiResponse.success(
      res,
      result.data,
      "Knowledges fetched successfully",
      200,
      result.meta
    );
  });

  getKnowledgeById = asyncHandler(async (req: Request, res: Response) => {
    const knowledge = await this.knowledgeService.findKnowledgeById(
      Number(req.params.id)
    );
    return ApiResponse.success(res, knowledge, "Knowledge found");
  });

  updateKnowledge = asyncHandler(async (req: Request, res: Response) => {
    const knowledge = await this.knowledgeService.updateKnowledge(
      Number(req.params.id),
      req.body
    );
    return ApiResponse.success(
      res,
      knowledge,
      "Knowledge updated successfully"
    );
  });

  deleteKnowledge = asyncHandler(async (req: Request, res: Response) => {
    await this.knowledgeService.deleteKnowledge(Number(req.params.id));
    return ApiResponse.success(res, null, "Knowledge deleted successfully");
  });

  restoreKnowledge = asyncHandler(async (req: Request, res: Response) => {
    const restoredKnowledge = await this.knowledgeService.restoreKnowledge(
      Number(req.params.id)
    );
    return ApiResponse.success(
      res,
      restoredKnowledge,
      "Knowledge restored successfully"
    );
  });
}
