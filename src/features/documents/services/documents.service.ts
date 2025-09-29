import { CreateDocumentsDto, UpdateDocumentsDto } from "../dtos/documents.dto";
import { DocumentsRepository } from "../repositories/documents.repository";
import { ApiError } from "../../../utils/apiError";
import { IDocumentsService } from "../documents.interface";

export class DocumentsService implements IDocumentsService {
  private documentsRepository: DocumentsRepository;
  constructor(documentsRepository: DocumentsRepository) {
    this.documentsRepository = documentsRepository;
  }

  async createDocuments(data: CreateDocumentsDto) {
    // Optional: Add validation here, e.g., check for existing name
    // const existing = await this.documentsRepository.findByName(data.name);
    // if (existing) {
    //   throw new ApiError(409, "Documents with this name already exists");
    // }
    return this.documentsRepository.store(data);
  }

  async findAllDocumentss(page: number, limit: number) {
    const { data, total } = await this.documentsRepository.findAll(page, limit);

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

  async findDocumentsById(id: string) {
    const documents = await this.documentsRepository.findById(id);
    if (!documents) {
      throw new ApiError(404, "Documents not found");
    }
    return documents;
  }

  async updateDocuments(id: string, data: UpdateDocumentsDto) {
    await this.findDocumentsById(id);
    return this.documentsRepository.update(id, data);
  }

  async deleteDocuments(id: string) {
    await this.findDocumentsById(id);
    return this.documentsRepository.softDelete(id);
  }

  async restoreDocuments(id: string) {
    // Note: This restore logic doesn't check if the item exists but is deleted.
    // You might want to add a `findByIdIncludingDeleted` method in the repository for a more robust check.
    return this.documentsRepository.restore(id);
  }
}
