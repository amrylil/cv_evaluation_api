import { Job } from "@prisma/client";
import { CreateJobsDto, UpdateJobsDto } from "./dtos/jobs.dto";

export interface IJobsRepository {
  findById(id: number): Promise<Job | null>;
  findAll(page: number, limit: number): Promise<{ data: Job[]; total: number }>;
  store(data: CreateJobsDto): Promise<Job>;
  update(id: number, data: UpdateJobsDto): Promise<Job>;
  softDelete(id: number): Promise<Job>;
  restore(id: number): Promise<Job>;
}

export interface IJobsService {
  createJobs(data: CreateJobsDto): Promise<Job>;
  findJobsById(id: number): Promise<Job | null>;
  findAllJobss(
    page: number,
    limit: number
  ): Promise<{
    data: Job[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }>;
  updateJobs(id: number, data: UpdateJobsDto): Promise<Job>;
  deleteJobs(id: number): Promise<Job>;
  restoreJobs(id: number): Promise<Job>;
}
