import { z } from "../../../config/zod-openapi";
import { v4 as uuidv4 } from "uuid";

/**
 * Schema for jobs representation
 */
export const jobsCoreSchema = z.object({
  id: z.number().int().positive().openapi({
    example: 1,
    description: "Unique identifier for the job.",
  }),
  title: z.string().min(1, "Title is required").openapi({
    example: "Backend Engineer (AI Team)",
  }),

  job_description_text: z.string().min(1, "Description is required").openapi({
    example: "Building AI-powered systems and integrating LLMs...",
  }),
  createdAt: z.date().openapi({ description: "Timestamp of creation." }),
  updatedAt: z.date().openapi({ description: "Timestamp of last update." }),
  deletedAt: z.date().nullable().openapi({
    description: "Timestamp of soft deletion, null if active.",
  }),
});

/**
 * Schema for create jobs request
 */
export const createJobsSchema = jobsCoreSchema.omit({ id: true });

/**
 * Schema for update jobs request (all fields optional)
 */
export const updateJobsSchema = createJobsSchema.partial();

/**
 * Validator for middleware
 */
export const createJobsValidator = createJobsSchema;
export const updateJobsValidator = updateJobsSchema;

/**
 * Validator for getAllJobss query
 */
export const getAllJobssQuerySchema = z.object({
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
export type JobsCoreDto = z.infer<typeof jobsCoreSchema>;
export type CreateJobsDto = z.infer<typeof createJobsSchema>;
export type UpdateJobsDto = z.infer<typeof updateJobsSchema>;
