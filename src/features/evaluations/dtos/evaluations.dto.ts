import { z } from "../../../config/zod-openapi";

const evaluationStatusEnum = z.enum([
  "queued",
  "processing",
  "completed",
  "failed",
]);

export const evaluationResultSchema = z.object({
  cv_match_rate: z.number().min(0).max(1),
  cv_feedback: z.string(),
  project_score: z.number().min(0).max(10),
  project_feedback: z.string(),
  overall_summary: z.string(),
});

/**
 * Schema for Evaluation representation, matching the database model.
 */
export const evaluationCoreSchema = z.object({
  id: z.string().uuid(),
  jobId: z.number().int().positive(),
  cvDocumentId: z.number().int().positive(),
  projectDocumentId: z.number().int().positive(),
  status: evaluationStatusEnum,
  result: evaluationResultSchema.nullable(),
  errorMessage: z.string().nullable(),
  retryCount: z.number().int().min(0),
  completedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

/**
 * Schema for the 'POST /evaluate' request body.
 */
export const createEvaluationSchema = z.object({
  jobId: z.number().int().positive(),
  cvDocumentId: z.number().int().positive(),
  projectDocumentId: z.number().int().positive(),
});

/**
 * Validator for middleware
 */
export const createEvaluationValidator = createEvaluationSchema;

/**
 * Validator for getAllEvaluations query parameters.
 */
export const getAllEvaluationsQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).optional().default("1"),
  limit: z.string().regex(/^\d+$/).optional().default("10"),
  status: evaluationStatusEnum.optional(),
  jobId: z.string().regex(/^\d+$/).optional(),
});

/**
 * TypeScript types inferred from schemas
 */
export type EvaluationDto = z.infer<typeof evaluationCoreSchema>;
export type CreateEvaluationDto = z.infer<typeof createEvaluationSchema>;
export type EvaluationResultDto = z.infer<typeof evaluationResultSchema>;
