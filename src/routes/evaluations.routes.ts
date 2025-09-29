import { Router } from "express";
import { validate } from "../middlewares/validate";
import {
  createEvaluationsValidator,
  updateEvaluationsValidator,
} from "../features/evaluations/dtos/evaluations.dto";
import { EvaluationsController } from "../features/evaluations/controllers/evaluations.controller";
import { EvaluationsService } from "../features/evaluations/services/evaluations.service";
import { EvaluationsRepository } from "../features/evaluations/repositories/evaluations.repository";
import { PrismaClient } from "@prisma/client";

const router = Router();

const prisma = new PrismaClient();
const evaluationsRepository = new EvaluationsRepository(prisma);
const evaluationsService = new EvaluationsService(evaluationsRepository);
const evaluationsController = new EvaluationsController(evaluationsService);

// Create a new evaluations
router.post("/", validate(createEvaluationsValidator), evaluationsController.createEvaluations);

// Get all evaluations (with pagination)
router.get("/", evaluationsController.getAllEvaluationss);

// Get a single evaluations by ID
router.get("/:id", evaluationsController.getEvaluationsById);

// Update a evaluations by ID
router.patch("/:id", validate(updateEvaluationsValidator), evaluationsController.updateEvaluations);

// Soft delete a evaluations by ID
router.delete("/:id", evaluationsController.deleteEvaluations);

// Restore a soft-deleted evaluations by ID
router.patch("/:id/restore", evaluationsController.restoreEvaluations);

export default router;
