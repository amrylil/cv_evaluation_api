import { PrismaClient, Document } from "@prisma/client";
import { CreateDocumentsDto } from "../dtos/documents.dto";
import { v4 as uuidv4 } from "uuid";
import { IDocumentsRepository } from "../documents.interface";

export class DocumentsRepository implements IDocumentsRepository {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async store(data: CreateDocumentsDto): Promise<Document> {
    return this.prisma.document.create({
      data: {
        ...data,
      },
    });
  }

  async findById(id: number): Promise<Document | null> {
    return this.prisma.document.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async findAll(
    page: number,
    limit: number
  ): Promise<{ data: Document[]; total: number }> {
    const skip = (page - 1) * limit;
    const whereClause = { deletedAt: null };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.document.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.document.count({ where: whereClause }),
    ]);
    return { data, total };
  }

  async softDelete(id: number): Promise<Document> {
    return this.prisma.document.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async restore(id: number): Promise<Document> {
    return this.prisma.document.update({
      where: { id },
      data: {
        deletedAt: null,
      },
    });
  }
}
