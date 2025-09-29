import { Router } from "express";
import { validate } from "../middlewares/validate";
import {
  createKnowledgeValidator,
  updateKnowledgeValidator,
} from "../features/knowledge/dtos/knowledge.dto";
import { KnowledgeController } from "../features/knowledge/controllers/knowledge.controller";
import { KnowledgeService } from "../features/knowledge/services/knowledge.service";
import { KnowledgeRepository } from "../features/knowledge/repositories/knowledge.repository";
import { PrismaClient } from "@prisma/client";

const router = Router();

const prisma = new PrismaClient();
const knowledgeRepository = new KnowledgeRepository(prisma);
const knowledgeService = new KnowledgeService(knowledgeRepository);
const knowledgeController = new KnowledgeController(knowledgeService);

// Create a new knowledge
router.post("/", validate(createKnowledgeValidator), knowledgeController.createKnowledge);

// Get all knowledge (with pagination)
router.get("/", knowledgeController.getAllKnowledges);

// Get a single knowledge by ID
router.get("/:id", knowledgeController.getKnowledgeById);

// Update a knowledge by ID
router.patch("/:id", validate(updateKnowledgeValidator), knowledgeController.updateKnowledge);

// Soft delete a knowledge by ID
router.delete("/:id", knowledgeController.deleteKnowledge);

// Restore a soft-deleted knowledge by ID
router.patch("/:id/restore", knowledgeController.restoreKnowledge);

export default router;
