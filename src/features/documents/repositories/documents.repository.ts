import { PrismaClient, Documents } from "@prisma/client";
import { CreateDocumentsDto, UpdateDocumentsDto } from "../dtos/documents.dto";
import { v4 as uuidv4 } from "uuid";
import { IDocumentsRepository } from "../documents.interface";

export class DocumentsRepository implements IDocumentsRepository {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async store(data: CreateDocumentsDto): Promise<Documents> {
    return this.prisma.documents.create({
      data: {
        id: uuidv4(),
        ...data,
      },
    });
  }

  async findById(id: string): Promise<Documents | null> {
    return this.prisma.documents.findUnique({
      where: {
        id,
        deleted_at: null,
      },
    });
  }

  async findAll(
    page: number,
    limit: number
  ): Promise<{ data: Documents[]; total: number }> {
    const skip = (page - 1) * limit;
    const whereClause = { deleted_at: null };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.documents.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
      }),
      this.prisma.documents.count({ where: whereClause }),
    ]);
    return { data, total };
  }

  async update(id: string, data: UpdateDocumentsDto): Promise<Documents> {
    return this.prisma.documents.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string): Promise<Documents> {
    return this.prisma.documents.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });
  }

  async restore(id: string): Promise<Documents> {
    return this.prisma.documents.update({
      where: { id },
      data: {
        deleted_at: null,
      },
    });
  }
}
