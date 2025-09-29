import { PrismaClient, EvaluationTask } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { IEvaluationsRepository } from "../evaluations.interface";
import { CreateEvaluationDto } from "../dtos/evaluations.dto";

export class EvaluationsRepository implements IEvaluationsRepository {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async store(data: CreateEvaluationDto): Promise<EvaluationTask> {
    return this.prisma.evaluationTask.create({
      data: {
        id: uuidv4(),
        ...data,
      },
    });
  }

  async findById(id: string): Promise<EvaluationTask | null> {
    return this.prisma.evaluationTask.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async findAll(
    page: number,
    limit: number
  ): Promise<{ data: EvaluationTask[]; total: number }> {
    const skip = (page - 1) * limit;
    const whereClause = { deletedAt: null };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.evaluationTask.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.evaluationTask.count({ where: whereClause }),
    ]);
    return { data, total };
  }

  async softDelete(id: string): Promise<EvaluationTask> {
    return this.prisma.evaluationTask.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async restore(id: string): Promise<EvaluationTask> {
    return this.prisma.evaluationTask.update({
      where: { id },
      data: {
        deletedAt: null,
      },
    });
  }
}
