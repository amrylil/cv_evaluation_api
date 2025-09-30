import { CreateKnowledgeDto, UpdateKnowledgeDto } from "../dtos/knowledge.dto";
import { KnowledgeRepository } from "../repositories/knowledge.repository";
import { ApiError } from "../../../utils/apiError";
import { IKnowledgeService } from "../knowledge.interface";
import { pipeline } from "@huggingface/transformers";

export class KnowledgeService implements IKnowledgeService {
  private knowledgeRepository: KnowledgeRepository;
  private embedder: any;

  constructor(knowledgeRepository: KnowledgeRepository) {
    this.knowledgeRepository = knowledgeRepository;
  }

  async embedText(text: string): Promise<number[]> {
    if (!this.embedder) {
      this.embedder = await pipeline(
        "feature-extraction",
        "sentence-transformers/all-MiniLM-L6-v2"
      );
    }

    const output = await this.embedder(text, {
      pooling: "mean",
      normalize: true,
    });

    let vector: number[] = [];

    if (Array.isArray(output.data)) {
      if (Array.isArray(output.data[0])) {
        // kasus nested array
        vector = (output.data[0] as number[]).slice();
      } else {
        vector = Array.from(output.data as number[]);
      }
    }

    return vector;
  }

  async createKnowledge(data: CreateKnowledgeDto) {
    const { text, tags } = data;

    const vector = await this.embedText(text);

    return this.knowledgeRepository.store({
      text,
      vector,
      tags,
    });
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
