import { CreateJobsDto, UpdateJobsDto } from "../dtos/jobs.dto";
import { JobsRepository } from "../repositories/jobs.repository";
import { ApiError } from "../../../utils/apiError";
import { IJobsService } from "../jobs.interface";

export class JobsService implements IJobsService {
  private jobsRepository: JobsRepository;
  constructor(jobsRepository: JobsRepository) {
    this.jobsRepository = jobsRepository;
  }

  async createJobs(data: CreateJobsDto) {
    // Optional: Add validation here, e.g., check for existing name
    // const existing = await this.jobsRepository.findByName(data.name);
    // if (existing) {
    //   throw new ApiError(409, "Jobs with this name already exists");
    // }
    return this.jobsRepository.store(data);
  }

  async findAllJobss(page: number, limit: number) {
    const { data, total } = await this.jobsRepository.findAll(page, limit);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findJobsById(id: number) {
    const jobs = await this.jobsRepository.findById(id);
    if (!jobs) {
      throw new ApiError(404, "Jobs not found");
    }
    return jobs;
  }

  async updateJobs(id: number, data: UpdateJobsDto) {
    await this.findJobsById(id);
    return this.jobsRepository.update(id, data);
  }

  async deleteJobs(id: number) {
    await this.findJobsById(id);
    return this.jobsRepository.softDelete(id);
  }

  async restoreJobs(id: number) {
    // Note: This restore logic doesn't check if the item exists but is deleted.
    // You might want to add a `findByIdIncludingDeleted` method in the repository for a more robust check.
    return this.jobsRepository.restore(id);
  }
}
