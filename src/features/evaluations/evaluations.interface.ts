import { EvaluationTask } from "@prisma/client";
import { CreateEvaluationDto } from "./dtos/evaluations.dto";

export interface IEvaluationsRepository {
  findById(id: string): Promise<EvaluationTask | null>;
  findAll(
    page: number,
    limit: number
  ): Promise<{ data: EvaluationTask[]; total: number }>;
  store(data: CreateEvaluationDto): Promise<EvaluationTask>;
  softDelete(id: string): Promise<EvaluationTask>;
  restore(id: string): Promise<EvaluationTask>;
}

export interface IEvaluationsService {
  createEvaluations(data: CreateEvaluationDto): Promise<EvaluationTask>;
  findEvaluationsById(id: string): Promise<EvaluationTask | null>;
  findAllEvaluationss(
    page: number,
    limit: number
  ): Promise<{
    data: EvaluationTask[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }>;

  deleteEvaluations(id: string): Promise<EvaluationTask>;
  restoreEvaluations(id: string): Promise<EvaluationTask>;
}
