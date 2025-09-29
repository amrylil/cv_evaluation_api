import { documentCoreSchema } from "../features/documents/dtos/documents.dto";
import { registry } from "./registry";

registry.register("DocumentCore", documentCoreSchema);
registry.registerPath({
  method: "post",
  path: "/upload",
  tags: ["Documents"],
  summary: "Upload a CV or Project file",
  description:
    "Uploads a single file (.pdf, .docx) and extracts its text content.",

  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            properties: {
              file: {
                type: "string",
                format: "binary",
                description: "The CV or project file to upload.",
              },
            },
            required: ["file"],
          },
        },
      },
    },
  },
  responses: {
    201: {
      description: "File uploaded and text extracted successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              message: {
                type: "string",
                example: "File uploaded successfully.",
              },
              data: {
                type: "object",
                properties: {
                  document_id: { type: "integer", example: 101 },
                },
              },
            },
          },
        },
      },
    },
    400: { description: "Bad request or no file uploaded" },
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
