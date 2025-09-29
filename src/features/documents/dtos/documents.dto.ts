import { z } from "../../../config/zod-openapi";

/**
 * Schema for Document representation, matching the database model.
 */
export const documentCoreSchema = z.object({
  id: z.number().int().positive().openapi({
    example: 101,
    description: "Unique identifier for the document.",
  }),
  extractedText: z.string().openapi({
    example: "This is the full text extracted from the uploaded CV...",
    description: "The raw text content extracted from the file.",
  }),
  originalFilename: z.string().nullable().openapi({
    example: "candidate_cv.pdf",
    description: "The original filename of the uploaded document.",
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

/**
 * Schema for creating a new document record.
 * This is typically used internally by the service after a file upload.
 */
export const createDocumentSchema = documentCoreSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

// An update schema is not provided because documents are treated as immutable.
// A new version of a document should be a new upload, creating a new record.

/**
 * Validator for middleware (only for creation).
 */
export const createDocumentValidator = createDocumentSchema;

/**
 * Validator for getAllDocuments query parameters.
 * Useful for an admin or debugging endpoint.
 */
export const getAllDocumentsQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).optional().default("1"),
  limit: z.string().regex(/^\d+$/).optional().default("10"),
  filename: z.string().optional().openapi({
    description: "Search documents by original filename",
    example: "cv.pdf",
  }),
});

/**
 * TypeScript types inferred from schemas.
 */
export type DocumentCoreDto = z.infer<typeof documentCoreSchema>;
export type CreateDocumentsDto = z.infer<typeof createDocumentSchema>;
