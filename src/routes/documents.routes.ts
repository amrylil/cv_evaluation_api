import { Router } from "express";
import { validate } from "../middlewares/validate";
import { createDocumentValidator } from "../features/documents/dtos/documents.dto";
import { DocumentsController } from "../features/documents/controllers/documents.controller";
import { DocumentsService } from "../features/documents/services/documents.service";
import { DocumentsRepository } from "../features/documents/repositories/documents.repository";
import { PrismaClient } from "@prisma/client";
import multer from "multer";

const router = Router();

const prisma = new PrismaClient();
const documentsRepository = new DocumentsRepository(prisma);
const documentsService = new DocumentsService(documentsRepository);
const documentsController = new DocumentsController(documentsService);

const upload = multer({ dest: "uploads/" });

// Create a new documents
router.post("/", upload.single("file"), (req, res) =>
  documentsController.uploadFile(req, res)
);

// Get all documents (with pagination)
router.get("/", documentsController.getAllDocumentss);

// Get a single documents by ID
router.get("/:id", documentsController.getDocumentsById);

// Update a documents by ID

// Soft delete a documents by ID
router.delete("/:id", documentsController.deleteDocuments);

// Restore a soft-deleted documents by ID
router.patch("/:id/restore", documentsController.restoreDocuments);

export default router;
