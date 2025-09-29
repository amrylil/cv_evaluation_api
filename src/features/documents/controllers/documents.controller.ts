import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../../../utils/apiResponse";
import { DocumentsService } from "../services/documents.service";
import multer from "multer";

const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export class DocumentsController {
  private documentsService: DocumentsService;
  upload = multer({ dest: "uploads/" });
  constructor(documentsService: DocumentsService) {
    this.documentsService = documentsService;
  }

  async uploadFile(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded." });
      }

      const document = await this.documentsService.createDocuments(
        req.file.path,
        req.file.originalname
      );

      res.status(201).json({
        success: true,
        message: "File uploaded and text extracted successfully.",
        data: document,
      });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: (error as Error).message });
    }
  }

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
    const documents = await this.documentsService.findDocumentsById(
      Number(req.params.id)
    );
    return ApiResponse.success(res, documents, "Documents found");
  });

  deleteDocuments = asyncHandler(async (req: Request, res: Response) => {
    await this.documentsService.deleteDocuments(Number(req.params.id));
    return ApiResponse.success(res, null, "Documents deleted successfully");
  });

  restoreDocuments = asyncHandler(async (req: Request, res: Response) => {
    const restoredDocuments = await this.documentsService.restoreDocuments(
      Number(req.params.id)
    );
    return ApiResponse.success(
      res,
      restoredDocuments,
      "Documents restored successfully"
    );
  });
}
