import { registry } from "./registry";
import {
  evaluationCoreSchema,
  createEvaluationSchema,
} from "../features/evaluations/dtos/evaluations.dto";

registry.register("EvaluationsCore", evaluationCoreSchema);
registry.register("CreateEvaluationsRequest", createEvaluationSchema);

// POST /evaluations
registry.registerPath({
  method: "post",
  path: "/evaluations",
  tags: ["Evaluations"],
  summary: "Register a new evaluations",
  request: {
    body: {
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/CreateEvaluationsRequest" },
        },
      },
    },
  },
  responses: {
    201: {
      description: "Evaluations created successfully",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/EvaluationsCore" },
        },
      },
    },
    400: { description: "Validation error" },
    409: { description: "Evaluations already exists" },
  },
});

// GET /evaluations
registry.registerPath({
  method: "get",
  path: "/evaluations",
  tags: ["Evaluations"],
  summary: "Get a list of all evaluations",
  parameters: [
    {
      name: "page",
      in: "query",
      required: false,
      description: "Page number (default: 1)",
      schema: { type: "integer", example: 1 },
    },
    {
      name: "limit",
      in: "query",
      required: false,
      description: "Number of items per page (default: 10)",
      schema: { type: "integer", example: 10 },
    },
  ],
  responses: {
    200: {
      description: "List of evaluations retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              message: {
                type: "string",
                example: "Evaluations fetched successfully",
              },
              data: {
                type: "array",
                items: { $ref: "#/components/schemas/EvaluationsCore" },
              },
              meta: {
                type: "object",
                properties: {
                  page: { type: "integer", example: 1 },
                  limit: { type: "integer", example: 10 },
                  total: { type: "integer", example: 50 },
                  totalPages: { type: "integer", example: 5 },
                },
              },
              error: { type: "null", example: null },
            },
          },
        },
      },
    },
  },
});

// GET /evaluations/{id}
registry.registerPath({
  method: "get",
  path: "/evaluations/{id}",
  tags: ["Evaluations"],
  summary: "Get evaluations by ID",
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "string" },
    },
  ],
  responses: {
    200: {
      description: "Evaluations found successfully",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/EvaluationsCore" },
        },
      },
    },
    404: { description: "Evaluations not found" },
  },
});

// DELETE /evaluations/{id}
registry.registerPath({
  method: "delete",
  path: "/evaluations/{id}",
  tags: ["Evaluations"],
  summary: "Delete a evaluations by ID",
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "string" },
    },
  ],
  responses: {
    200: { description: "Evaluations deleted successfully" },
    404: { description: "Evaluations not found" },
  },
});
