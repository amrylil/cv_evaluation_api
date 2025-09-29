import { Router } from "express";
import { evaluationService } from "../features/cv_evaluations/usecases/evaluations.usecase";
import { evaluationController } from "../features/cv_evaluations/handlers/evaluation.handler";

const router = Router();

const service = new evaluationService();
const handler = new evaluationController(service);

// Create a new user
router.post("/upload", handler.uploadCV);
router.post("/", handler.evaluate);
router.get("/result/:id", handler.getResult);

export default router;
