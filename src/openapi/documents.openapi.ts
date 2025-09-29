import { registry } from "./registry";
import {
  documentsCoreSchema,
  createDocumentsSchema,
  updateDocumentsSchema,
} from "../features/documents/dtos/documents.dto";

registry.register("DocumentsCore", documentsCoreSchema);
registry.register("CreateDocumentsRequest", createDocumentsSchema);
registry.register("UpdateDocumentsRequest", updateDocumentsSchema);

// POST /documents
registry.registerPath({
  method: "post",
  path: "/documents",
  tags: ["Documents"],
  summary: "Register a new documents",
  request: {
    body: {
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/CreateDocumentsRequest" },
        },
      },
    },
  },
  responses: {
    201: {
      description: "Documents created successfully",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/DocumentsCore" },
        },
      },
    },
    400: { description: "Validation error" },
    409: { description: "Documents already exists" },
  },
});

// GET /documents
registry.registerPath({
  method: "get",
  path: "/documents",
  tags: ["Documents"],
  summary: "Get a list of all documents",
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
      description: "List of documents retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              message: {
                type: "string",
                example: "Documents fetched successfully",
              },
              data: {
                type: "array",
                items: { $ref: "#/components/schemas/DocumentsCore" },
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

// GET /documents/{id}
registry.registerPath({
  method: "get",
  path: "/documents/{id}",
  tags: ["Documents"],
  summary: "Get documents by ID",
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
      description: "Documents found successfully",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/DocumentsCore" },
        },
      },
    },
    404: { description: "Documents not found" },
  },
});

// PATCH /documents/{id}
registry.registerPath({
  method: "patch",
  path: "/documents/{id}",
  tags: ["Documents"],
  summary: "Update a documents by ID",
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
          schema: { $ref: "#/components/schemas/UpdateDocumentsRequest" },
        },
      },
    },
  },
  responses: {
    200: {
      description: "Documents updated successfully",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/DocumentsCore" },
        },
      },
    },
    400: { description: "Validation error" },
    404: { description: "Documents not found" },
  },
});

// DELETE /documents/{id}
registry.registerPath({
  method: "delete",
  path: "/documents/{id}",
  tags: ["Documents"],
  summary: "Delete a documents by ID",
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "string" },
    },
  ],
  responses: {
    200: { description: "Documents deleted successfully" },
    404: { description: "Documents not found" },
  },
});
