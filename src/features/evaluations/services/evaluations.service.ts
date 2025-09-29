import { CreateEvaluationsDto, UpdateEvaluationsDto } from "../dtos/evaluations.dto";
import { EvaluationsRepository } from "../repositories/evaluations.repository";
import { ApiError } from "../../../utils/apiError";
import { IEvaluationsService } from "../evaluations.interface";

export class EvaluationsService implements IEvaluationsService {
  private evaluationsRepository: EvaluationsRepository;
  constructor(evaluationsRepository: EvaluationsRepository) {
    this.evaluationsRepository = evaluationsRepository;
  }

  async createEvaluations(data: CreateEvaluationsDto) {
    // Optional: Add validation here, e.g., check for existing name
    // const existing = await this.evaluationsRepository.findByName(data.name);
    // if (existing) {
    //   throw new ApiError(409, "Evaluations with this name already exists");
    // }
    return this.evaluationsRepository.store(data);
  }

  async findAllEvaluationss(page: number, limit: number) {
    const { data, total } = await this.evaluationsRepository.findAll(page, limit);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findEvaluationsById(id: string) {
    const evaluations = await this.evaluationsRepository.findById(id);
    if (!evaluations) {
      throw new ApiError(404, "Evaluations not found");
    }
    return evaluations;
  }

  async updateEvaluations(id: string, data: UpdateEvaluationsDto) {
    await this.findEvaluationsById(id);
    return this.evaluationsRepository.update(id, data);
  }

  async deleteEvaluations(id: string) {
    await this.findEvaluationsById(id);
    return this.evaluationsRepository.softDelete(id);
  }

  async restoreEvaluations(id: string) {
    // Note: This restore logic doesn't check if the item exists but is deleted.
    // You might want to add a `findByIdIncludingDeleted` method in the repository for a more robust check.
    return this.evaluationsRepository.restore(id);
  }
}
