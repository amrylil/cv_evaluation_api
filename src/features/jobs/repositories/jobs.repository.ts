import { Job, PrismaClient } from "@prisma/client";
import { CreateJobsDto, UpdateJobsDto } from "../dtos/jobs.dto";
import { v4 as uuidv4 } from "uuid";
import { IJobsRepository } from "../jobs.interface";

export class JobsRepository implements IJobsRepository {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async store(data: CreateJobsDto): Promise<Job> {
    return this.prisma.job.create({
      data: {
        ...data,
      },
    });
  }

  async findById(id: number): Promise<Job | null> {
    return this.prisma.job.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async findAll(
    page: number,
    limit: number
  ): Promise<{ data: Job[]; total: number }> {
    const skip = (page - 1) * limit;
    const whereClause = { deletedAt: null };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.job.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.job.count({ where: whereClause }),
    ]);
    return { data, total };
  }

  async update(id: number, data: UpdateJobsDto): Promise<Job> {
    return this.prisma.job.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: number): Promise<Job> {
    return this.prisma.job.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async restore(id: number): Promise<Job> {
    return this.prisma.job.update({
      where: { id },
      data: {
        deletedAt: null,
      },
    });
  }
}
