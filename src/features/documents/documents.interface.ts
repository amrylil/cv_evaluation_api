import { Document } from "@prisma/client";
import { CreateDocumentsDto } from "./dtos/documents.dto";

export interface IDocumentsRepository {
  findById(id: number): Promise<Document | null>;
  findAll(
    page: number,
    limit: number
  ): Promise<{ data: Document[]; total: number }>;
  store(data: CreateDocumentsDto): Promise<Document>;
  softDelete(id: number): Promise<Document>;
  restore(id: number): Promise<Document>;
}

export interface IDocumentsService {
  createDocuments(
    filePath: string,
    originalFilename: string
  ): Promise<CreateDocumentsDto>;
  findDocumentsById(id: number): Promise<Document | null>;
  findAllDocumentss(
    page: number,
    limit: number
  ): Promise<{
    data: Document[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }>;
  deleteDocuments(id: number): Promise<Document>;
  restoreDocuments(id: number): Promise<Document>;
}
