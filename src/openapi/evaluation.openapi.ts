import {
  createEvaluationBodySchema,
  evaluationSchema,
  getEvaluationParamsSchema,
  queuedEvaluationSchema,
} from "../features/evaluations/dtos/evaluation.dto";
import { registry } from "../openapi/registry";

// --- 1. Daftarkan Semua Schema ---
registry.register("CreateEvaluationRequest", createEvaluationBodySchema);
registry.register("QueuedEvaluationResponse", queuedEvaluationSchema);
registry.register("EvaluationResponse", evaluationSchema);

// --- 2. Daftarkan Semua Path Endpoint ---

// POST /evaluations
registry.registerPath({
  method: "post",
  path: "/evaluations",
  tags: ["Evaluations"],
  summary: "Submit a new CV evaluation request",
  request: {
    body: {
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/CreateEvaluationRequest" },
        },
      },
    },
  },
  responses: {
    202: {
      description: "Evaluation has been queued successfully",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/QueuedEvaluationResponse" },
        },
      },
    },
    400: { description: "Validation error" },
    502: { description: "AI service communication error" },
  },
});

// GET /evaluations/{id}
registry.registerPath({
  method: "get",
  path: "/evaluations/{id}",
  tags: ["Evaluations"],
  summary: "Get the status and result of an evaluation",
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      // schema: getEvaluationParamsSchema.shape.id,
    },
  ],
  responses: {
    200: {
      description: "Evaluation data retrieved successfully",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/EvaluationResponse" },
        },
      },
    },
    404: { description: "Evaluation not found" },
  },
});
