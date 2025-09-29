import { CreateDocumentsDto } from "../dtos/documents.dto";
import { DocumentsRepository } from "../repositories/documents.repository";
import { ApiError } from "../../../utils/apiError";
import { IDocumentsService } from "../documents.interface";
import { extractTextFromPdf } from "../../../utils/textExtractor";

export class DocumentsService implements IDocumentsService {
  private documentsRepository: DocumentsRepository;
  constructor(documentsRepository: DocumentsRepository) {
    this.documentsRepository = documentsRepository;
  }

  async createDocuments(
    filePath: string,
    originalFilename: string
  ): Promise<CreateDocumentsDto> {
    const extractedText = await extractTextFromPdf(filePath);

    if (!extractedText || extractedText.trim() === "") {
      throw new Error("Could not extract any text from the document.");
    }

    console.log(`Text extracted successfully. Length: ${extractedText.length}`);

    const newDocument = await this.documentsRepository.store({
      extractedText,
      originalFilename,
    });

    console.log(`Document created with ID: ${newDocument.id}`);

    return newDocument;
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

  async findDocumentsById(id: number) {
    const documents = await this.documentsRepository.findById(id);
    if (!documents) {
      throw new ApiError(404, "Documents not found");
    }
    return documents;
  }

  async deleteDocuments(id: number) {
    await this.findDocumentsById(id);
    return this.documentsRepository.softDelete(id);
  }

  async restoreDocuments(id: number) {
    // Note: This restore logic doesn't check if the item exists but is deleted.
    // You might want to add a `findByIdIncludingDeleted` method in the repository for a more robust check.
    return this.documentsRepository.restore(id);
  }
}
