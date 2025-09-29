import { KnowledgeBase as Knowledge } from "@prisma/client";
import { CreateKnowledgeDto, UpdateKnowledgeDto } from "./dtos/knowledge.dto";

export interface IKnowledgeRepository {
  findById(id: number): Promise<Knowledge | null>;
  findAll(
    page: number,
    limit: number
  ): Promise<{ data: Knowledge[]; total: number }>;
  store(data: CreateKnowledgeDto): Promise<Knowledge>;
  update(id: number, data: UpdateKnowledgeDto): Promise<Knowledge>;
  softDelete(id: number): Promise<Knowledge>;
  restore(id: number): Promise<Knowledge>;
}

export interface IKnowledgeService {
  createKnowledge(data: CreateKnowledgeDto): Promise<Knowledge>;
  findKnowledgeById(id: number): Promise<Knowledge | null>;
  findAllKnowledges(
    page: number,
    limit: number
  ): Promise<{
    data: Knowledge[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }>;
  updateKnowledge(id: number, data: UpdateKnowledgeDto): Promise<Knowledge>;
  deleteKnowledge(id: number): Promise<Knowledge>;
  restoreKnowledge(id: number): Promise<Knowledge>;
}
