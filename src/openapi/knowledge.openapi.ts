import { registry } from "./registry";
import {
  knowledgeCoreSchema,
  createKnowledgeSchema,
  updateKnowledgeSchema,
} from "../features/knowledge/dtos/knowledge.dto";

registry.register("KnowledgeCore", knowledgeCoreSchema);
registry.register("CreateKnowledgeRequest", createKnowledgeSchema);
registry.register("UpdateKnowledgeRequest", updateKnowledgeSchema);

// POST /knowledge
registry.registerPath({
  method: "post",
  path: "/knowledge",
  tags: ["Knowledge"],
  summary: "Register a new knowledge",
  request: {
    body: {
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/CreateKnowledgeRequest" },
        },
      },
    },
  },
  responses: {
    201: {
      description: "Knowledge created successfully",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/KnowledgeCore" },
        },
      },
    },
    400: { description: "Validation error" },
    409: { description: "Knowledge already exists" },
  },
});

// GET /knowledge
registry.registerPath({
  method: "get",
  path: "/knowledge",
  tags: ["Knowledge"],
  summary: "Get a list of all knowledge",
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
      description: "List of knowledge retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              message: {
                type: "string",
                example: "Knowledge fetched successfully",
              },
              data: {
                type: "array",
                items: { $ref: "#/components/schemas/KnowledgeCore" },
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

// GET /knowledge/{id}
registry.registerPath({
  method: "get",
  path: "/knowledge/{id}",
  tags: ["Knowledge"],
  summary: "Get knowledge by ID",
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
      description: "Knowledge found successfully",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/KnowledgeCore" },
        },
      },
    },
    404: { description: "Knowledge not found" },
  },
});

// PATCH /knowledge/{id}
registry.registerPath({
  method: "patch",
  path: "/knowledge/{id}",
  tags: ["Knowledge"],
  summary: "Update a knowledge by ID",
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "string" },
    },
  ],
  request: {
    body: {
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/UpdateKnowledgeRequest" },
        },
      },
    },
  },
  responses: {
    200: {
      description: "Knowledge updated successfully",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/KnowledgeCore" },
        },
      },
    },
    400: { description: "Validation error" },
    404: { description: "Knowledge not found" },
  },
});

// DELETE /knowledge/{id}
registry.registerPath({
  method: "delete",
  path: "/knowledge/{id}",
  tags: ["Knowledge"],
  summary: "Delete a knowledge by ID",
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "string" },
    },
  ],
  responses: {
    200: { description: "Knowledge deleted successfully" },
    404: { description: "Knowledge not found" },
  },
});
