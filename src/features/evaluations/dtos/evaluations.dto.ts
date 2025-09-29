import { z } from "../../../config/zod-openapi";
import { v4 as uuidv4 } from "uuid";

/**
 * Schema for evaluations representation
 */
export const evaluationsCoreSchema = z.object({
  id: z.string().uuid().openapi({ example: uuidv4() }),
  name: z.string().min(1, "Name is required").openapi({ example: "Sample Evaluations" }),
  // TODO: Add other fields for your model here
});

/**
 * Schema for create evaluations request
 */
export const createEvaluationsSchema = evaluationsCoreSchema.omit({ id: true });

/**
 * Schema for update evaluations request (all fields optional)
 */
export const updateEvaluationsSchema = createEvaluationsSchema.partial();

/**
 * Validator for middleware
 */
export const createEvaluationsValidator = createEvaluationsSchema;
export const updateEvaluationsValidator = updateEvaluationsSchema;

/**
 * Validator for getAllEvaluationss query
 */
export const getAllEvaluationssQuerySchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/, "Page must be a number")
    .optional()
    .default("1"),
  limit: z
    .string()
    .regex(/^\d+$/, "Limit must be a number")
    .optional()
    .default("10"),
});

/**
 * TypeScript types
 */
export type EvaluationsCoreDto = z.infer<typeof evaluationsCoreSchema>;
export type CreateEvaluationsDto = z.infer<typeof createEvaluationsSchema>;
export type UpdateEvaluationsDto = z.infer<typeof updateEvaluationsSchema>;
