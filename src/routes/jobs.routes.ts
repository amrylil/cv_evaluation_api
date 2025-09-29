import { Router } from "express";
import { validate } from "../middlewares/validate";
import {
  createJobsValidator,
  updateJobsValidator,
} from "../features/jobs/dtos/jobs.dto";
import { JobsController } from "../features/jobs/controllers/jobs.controller";
import { JobsService } from "../features/jobs/services/jobs.service";
import { JobsRepository } from "../features/jobs/repositories/jobs.repository";
import { PrismaClient } from "@prisma/client";

const router = Router();

const prisma = new PrismaClient();
const jobsRepository = new JobsRepository(prisma);
const jobsService = new JobsService(jobsRepository);
const jobsController = new JobsController(jobsService);

// Create a new jobs
router.post("/", validate(createJobsValidator), jobsController.createJobs);

// Get all jobs (with pagination)
router.get("/", jobsController.getAllJobss);

// Get a single jobs by ID
router.get("/:id", jobsController.getJobsById);

// Update a jobs by ID
router.patch("/:id", validate(updateJobsValidator), jobsController.updateJobs);

// Soft delete a jobs by ID
router.delete("/:id", jobsController.deleteJobs);

// Restore a soft-deleted jobs by ID
router.patch("/:id/restore", jobsController.restoreJobs);

export default router;
