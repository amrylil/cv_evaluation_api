import { z } from "../../../config/zod-openapi";

export const queuedEvaluationSchema = z.object({
  id: z.string().uuid(),
  status: z.literal("queued"),
});

/**
 * Schema untuk representasi data evaluasi yang lengkap
 */
export const evaluationSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["queued", "processing", "completed", "failed"]),
  result: z
    .object({
      extracted_info: z.any().describe("Data terstruktur hasil ekstraksi AI"),
      score: z.number().describe("Skor final evaluasi"),
      feedback: z.string().describe("Umpan balik kualitatif"),
    })
    .optional(),
  error: z.string().optional().describe("Pesan error jika proses gagal"),
  createdAt: z.string().datetime().describe("Waktu permintaan dibuat"),
});

// --- Skema Request ---

/**
 * Schema untuk request body saat membuat evaluasi baru
 */
export const createEvaluationBodySchema = z.object({
  cv_text: z
    .string()
    .min(50, "CV text must be at least 50 characters")
    .openapi({
      example:
        "Saya adalah seorang software engineer dengan 5 tahun pengalaman...",
    }),
  report_text: z
    .string()
    .min(50, "Report text must be at least 50 characters")
    .openapi({ example: "Proyek terakhir saya adalah membuat REST API..." }),
});

/**
 * Schema untuk request params saat mengambil hasil evaluasi
 */
export const getEvaluationParamsSchema = z.object({
  id: z.string().uuid("ID must be a valid UUID"),
});

// --- Validator untuk Middleware ---

export const createEvaluationValidator = z.object({
  body: createEvaluationBodySchema,
});

export const getEvaluationValidator = z.object({
  params: getEvaluationParamsSchema,
});

// --- TypeScript Types ---

export type QueuedEvaluationDto = z.infer<typeof queuedEvaluationSchema>;
export type EvaluationDto = z.infer<typeof evaluationSchema>;
export type CreateEvaluationDto = z.infer<typeof createEvaluationBodySchema>;
