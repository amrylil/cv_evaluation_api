import { Documents } from "@prisma/client";
import { CreateDocumentsDto, UpdateDocumentsDto } from "./dtos/documents.dto";

export interface IDocumentsRepository {
  findById(id: string): Promise<Documents | null>;
  findAll(
    page: number,
    limit: number
  ): Promise<{ data: Documents[]; total: number }>;
  store(data: CreateDocumentsDto): Promise<Documents>;
  update(id: string, data: UpdateDocumentsDto): Promise<Documents>;
  softDelete(id: string): Promise<Documents>;
  restore(id: string): Promise<Documents>;
}

export interface IDocumentsService {
  createDocuments(data: CreateDocumentsDto): Promise<Documents>;
  findDocumentsById(id: string): Promise<Documents | null>;
  findAllDocumentss(
    page: number,
    limit: number
  ): Promise<{
    data: Documents[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }>;
  updateDocuments(
    id: string,
    data: UpdateDocumentsDto
  ): Promise<Documents>;
  deleteDocuments(id: string): Promise<Documents>;
  restoreDocuments(id: string): Promise<Documents>;
}
