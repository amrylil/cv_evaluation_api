import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../../../utils/apiResponse";
import { DocumentsService } from "../services/documents.service";

const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export class DocumentsController {
  private documentsService: DocumentsService;
  constructor(documentsService: DocumentsService) {
    this.documentsService = documentsService;
  }

  createDocuments = asyncHandler(async (req: Request, res: Response) => {
    const documents = await this.documentsService.createDocuments(req.body);
    return ApiResponse.success(res, documents, "Documents created successfully", 201);
  });

  getAllDocumentss = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const result = await this.documentsService.findAllDocumentss(page, limit);
    return ApiResponse.success(
      res,
      result.data,
      "Documentss fetched successfully",
      200,
      result.meta
    );
  });

  getDocumentsById = asyncHandler(async (req: Request, res: Response) => {
    const documents = await this.documentsService.findDocumentsById(req.params.id);
    return ApiResponse.success(res, documents, "Documents found");
  });

  updateDocuments = asyncHandler(async (req: Request, res: Response) => {
    const documents = await this.documentsService.updateDocuments(req.params.id, req.body);
    return ApiResponse.success(res, documents, "Documents updated successfully");
  });

  deleteDocuments = asyncHandler(async (req: Request, res: Response) => {
    await this.documentsService.deleteDocuments(req.params.id);
    return ApiResponse.success(res, null, "Documents deleted successfully");
  });

  restoreDocuments = asyncHandler(async (req: Request, res: Response) => {
    const restoredDocuments = await this.documentsService.restoreDocuments(req.params.id);
    return ApiResponse.success(res, restoredDocuments, "Documents restored successfully");
  });
}
