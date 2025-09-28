import { Router } from "express";
import {
  createEvaluationBodySchema,
  getEvaluationParamsSchema,
} from "../features/evaluations/dtos/evaluation.dto";
import { validate } from "../middlewares/validate";
import {
  getEvaluationResult,
  submitEvaluation,
} from "../features/evaluations/controller/evaluations.controller";

// Membuat instance router baru khusus untuk fitur evaluations
const router = Router();

/**
 * @route   POST /evaluations
 * @desc    Membuat (submit) sebuah permintaan evaluasi baru.
 * @access  Public
 */
router.post(
  "/",
  validate(createEvaluationBodySchema), // 1. Validasi body request menggunakan skema Zod
  submitEvaluation // 2. Jika valid, teruskan ke controller
);

/**
 * @route   GET /evaluations/:id
 * @desc    Mendapatkan status dan hasil dari sebuah evaluasi berdasarkan ID.
 * @access  Public
 */
router.get(
  "/:id",
  validate(getEvaluationParamsSchema), // 1. Validasi parameter URL (memastikan ID adalah UUID)
  getEvaluationResult // 2. Jika valid, teruskan ke controller
);

export default router;
