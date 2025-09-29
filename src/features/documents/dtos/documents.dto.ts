import { z } from "../../../config/zod-openapi";
import { v4 as uuidv4 } from "uuid";

/**
 * Schema for documents representation
 */
export const documentsCoreSchema = z.object({
  id: z.string().uuid().openapi({ example: uuidv4() }),
  name: z.string().min(1, "Name is required").openapi({ example: "Sample Documents" }),
  // TODO: Add other fields for your model here
});

/**
 * Schema for create documents request
 */
export const createDocumentsSchema = documentsCoreSchema.omit({ id: true });

/**
 * Schema for update documents request (all fields optional)
 */
export const updateDocumentsSchema = createDocumentsSchema.partial();

/**
 * Validator for middleware
 */
export const createDocumentsValidator = createDocumentsSchema;
export const updateDocumentsValidator = updateDocumentsSchema;

/**
 * Validator for getAllDocumentss query
 */
export const getAllDocumentssQuerySchema = z.object({
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
export type DocumentsCoreDto = z.infer<typeof documentsCoreSchema>;
export type CreateDocumentsDto = z.infer<typeof createDocumentsSchema>;
export type UpdateDocumentsDto = z.infer<typeof updateDocumentsSchema>;
