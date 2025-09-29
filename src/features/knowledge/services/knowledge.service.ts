import { CreateKnowledgeDto, UpdateKnowledgeDto } from "../dtos/knowledge.dto";
import { KnowledgeRepository } from "../repositories/knowledge.repository";
import { ApiError } from "../../../utils/apiError";
import { IKnowledgeService } from "../knowledge.interface";

export class KnowledgeService implements IKnowledgeService {
  private knowledgeRepository: KnowledgeRepository;
  constructor(knowledgeRepository: KnowledgeRepository) {
    this.knowledgeRepository = knowledgeRepository;
  }

  async createKnowledge(data: CreateKnowledgeDto) {
    // Optional: Add validation here, e.g., check for existing name
    // const existing = await this.knowledgeRepository.findByName(data.name);
    // if (existing) {
    //   throw new ApiError(409, "Knowledge with this name already exists");
    // }
    return this.knowledgeRepository.store(data);
  }

  async findAllKnowledges(page: number, limit: number) {
    const { data, total } = await this.knowledgeRepository.findAll(page, limit);

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

  async findKnowledgeById(id: number) {
    const knowledge = await this.knowledgeRepository.findById(id);
    if (!knowledge) {
      throw new ApiError(404, "Knowledge not found");
    }
    return knowledge;
  }

  async updateKnowledge(id: number, data: UpdateKnowledgeDto) {
    await this.findKnowledgeById(id);
    return this.knowledgeRepository.update(id, data);
  }

  async deleteKnowledge(id: number) {
    await this.findKnowledgeById(id);
    return this.knowledgeRepository.softDelete(id);
  }

  async restoreKnowledge(id: number) {
    // Note: This restore logic doesn't check if the item exists but is deleted.
    // You might want to add a `findByIdIncludingDeleted` method in the repository for a more robust check.
    return this.knowledgeRepository.restore(id);
  }
}
