import { Evaluations } from "@prisma/client";
import { CreateEvaluationsDto, UpdateEvaluationsDto } from "./dtos/evaluations.dto";

export interface IEvaluationsRepository {
  findById(id: string): Promise<Evaluations | null>;
  findAll(
    page: number,
    limit: number
  ): Promise<{ data: Evaluations[]; total: number }>;
  store(data: CreateEvaluationsDto): Promise<Evaluations>;
  update(id: string, data: UpdateEvaluationsDto): Promise<Evaluations>;
  softDelete(id: string): Promise<Evaluations>;
  restore(id: string): Promise<Evaluations>;
}

export interface IEvaluationsService {
  createEvaluations(data: CreateEvaluationsDto): Promise<Evaluations>;
  findEvaluationsById(id: string): Promise<Evaluations | null>;
  findAllEvaluationss(
    page: number,
    limit: number
  ): Promise<{
    data: Evaluations[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }>;
  updateEvaluations(
    id: string,
    data: UpdateEvaluationsDto
  ): Promise<Evaluations>;
  deleteEvaluations(id: string): Promise<Evaluations>;
  restoreEvaluations(id: string): Promise<Evaluations>;
}
