import { PrismaClient, KnowledgeBase as Knowledge } from "@prisma/client";
import { CreateKnowledgeDto, UpdateKnowledgeDto } from "../dtos/knowledge.dto";
import { v4 as uuidv4 } from "uuid";
import { IKnowledgeRepository } from "../knowledge.interface";

export class KnowledgeRepository implements IKnowledgeRepository {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async store(data: CreateKnowledgeDto): Promise<Knowledge> {
    return this.prisma.knowledgeBase.create({
      data: {
        ...data,
      },
    });
  }

  async findById(id: number): Promise<Knowledge | null> {
    return this.prisma.knowledgeBase.findFirst({
      where: {
        id: id,
        deletedAt: null,
      },
    });
  }

  async findAll(
    page: number,
    limit: number
  ): Promise<{ data: Knowledge[]; total: number }> {
    const skip = (page - 1) * limit;
    const whereClause = { deletedAt: null };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.knowledgeBase.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.knowledgeBase.count({ where: whereClause }),
    ]);
    return { data, total };
  }

  async update(id: number, data: UpdateKnowledgeDto): Promise<Knowledge> {
    return this.prisma.knowledgeBase.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: number): Promise<Knowledge> {
    return this.prisma.knowledgeBase.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async restore(id: number): Promise<Knowledge> {
    return this.prisma.knowledgeBase.update({
      where: { id },
      data: {
        deletedAt: null,
      },
    });
  }
}
