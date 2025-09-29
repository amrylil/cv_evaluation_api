import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../../../utils/apiResponse";
import { JobsService } from "../services/jobs.service";

const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export class JobsController {
  private jobsService: JobsService;
  constructor(jobsService: JobsService) {
    this.jobsService = jobsService;
  }

  createJobs = asyncHandler(async (req: Request, res: Response) => {
    const jobs = await this.jobsService.createJobs(req.body);
    return ApiResponse.success(res, jobs, "Jobs created successfully", 201);
  });

  getAllJobss = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const result = await this.jobsService.findAllJobss(page, limit);
    return ApiResponse.success(
      res,
      result.data,
      "Jobss fetched successfully",
      200,
      result.meta
    );
  });

  getJobsById = asyncHandler(async (req: Request, res: Response) => {
    const jobs = await this.jobsService.findJobsById(Number(req.params.id));
    return ApiResponse.success(res, jobs, "Jobs found");
  });

  updateJobs = asyncHandler(async (req: Request, res: Response) => {
    const jobs = await this.jobsService.updateJobs(
      Number(req.params.id),
      req.body
    );
    return ApiResponse.success(res, jobs, "Jobs updated successfully");
  });

  deleteJobs = asyncHandler(async (req: Request, res: Response) => {
    await this.jobsService.deleteJobs(Number(req.params.id));
    return ApiResponse.success(res, null, "Jobs deleted successfully");
  });

  restoreJobs = asyncHandler(async (req: Request, res: Response) => {
    const restoredJobs = await this.jobsService.restoreJobs(
      Number(req.params.id)
    );
    return ApiResponse.success(res, restoredJobs, "Jobs restored successfully");
  });
}
