import { PrismaClient, Evaluations } from "@prisma/client";
import { CreateEvaluationsDto, UpdateEvaluationsDto } from "../dtos/evaluations.dto";
import { v4 as uuidv4 } from "uuid";
import { IEvaluationsRepository } from "../evaluations.interface";

export class EvaluationsRepository implements IEvaluationsRepository {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async store(data: CreateEvaluationsDto): Promise<Evaluations> {
    return this.prisma.evaluations.create({
      data: {
        id: uuidv4(),
        ...data,
      },
    });
  }

  async findById(id: string): Promise<Evaluations | null> {
    return this.prisma.evaluations.findUnique({
      where: {
        id,
        deleted_at: null,
      },
    });
  }

  async findAll(
    page: number,
    limit: number
  ): Promise<{ data: Evaluations[]; total: number }> {
    const skip = (page - 1) * limit;
    const whereClause = { deleted_at: null };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.evaluations.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
      }),
      this.prisma.evaluations.count({ where: whereClause }),
    ]);
    return { data, total };
  }

  async update(id: string, data: UpdateEvaluationsDto): Promise<Evaluations> {
    return this.prisma.evaluations.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string): Promise<Evaluations> {
    return this.prisma.evaluations.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });
  }

  async restore(id: string): Promise<Evaluations> {
    return this.prisma.evaluations.update({
      where: { id },
      data: {
        deleted_at: null,
      },
    });
  }
}
