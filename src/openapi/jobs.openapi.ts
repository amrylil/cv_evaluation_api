import { registry } from "./registry";
import {
  jobsCoreSchema,
  createJobsSchema,
  updateJobsSchema,
} from "../features/jobs/dtos/jobs.dto";

registry.register("JobsCore", jobsCoreSchema);
registry.register("CreateJobsRequest", createJobsSchema);
registry.register("UpdateJobsRequest", updateJobsSchema);

// POST /jobs
registry.registerPath({
  method: "post",
  path: "/jobs",
  tags: ["Jobs"],
  summary: "Register a new jobs",
  request: {
    body: {
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/CreateJobsRequest" },
        },
      },
    },
  },
  responses: {
    201: {
      description: "Jobs created successfully",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/JobsCore" },
        },
      },
    },
    400: { description: "Validation error" },
    409: { description: "Jobs already exists" },
  },
});

// GET /jobs
registry.registerPath({
  method: "get",
  path: "/jobs",
  tags: ["Jobs"],
  summary: "Get a list of all jobs",
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
      description: "List of jobs retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              message: {
                type: "string",
                example: "Jobs fetched successfully",
              },
              data: {
                type: "array",
                items: { $ref: "#/components/schemas/JobsCore" },
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

// GET /jobs/{id}
registry.registerPath({
  method: "get",
  path: "/jobs/{id}",
  tags: ["Jobs"],
  summary: "Get jobs by ID",
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
      description: "Jobs found successfully",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/JobsCore" },
        },
      },
    },
    404: { description: "Jobs not found" },
  },
});

// PATCH /jobs/{id}
registry.registerPath({
  method: "patch",
  path: "/jobs/{id}",
  tags: ["Jobs"],
  summary: "Update a jobs by ID",
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
          schema: { $ref: "#/components/schemas/UpdateJobsRequest" },
        },
      },
    },
  },
  responses: {
    200: {
      description: "Jobs updated successfully",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/JobsCore" },
        },
      },
    },
    400: { description: "Validation error" },
    404: { description: "Jobs not found" },
  },
});

// DELETE /jobs/{id}
registry.registerPath({
  method: "delete",
  path: "/jobs/{id}",
  tags: ["Jobs"],
  summary: "Delete a jobs by ID",
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "string" },
    },
  ],
  responses: {
    200: { description: "Jobs deleted successfully" },
    404: { description: "Jobs not found" },
  },
});
