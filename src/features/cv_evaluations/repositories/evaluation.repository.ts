import { UploadRequest } from "../dtos/upload.dto";
import { Task } from "../entities/task";

export interface ITaskRepository {
  save(task: Task): Promise<Task>;
  findById(id: string): Promise<Task | null>;
  update(task: Task): Promise<Task>;
  findAll(): Promise<Task[]>;
}

export interface IEvaluationService {
  upload(data: UploadRequest): Promise<Task>;
  evaluate(id: string): Promise<Task>;
  getResult(id: string): Promise<Task>;
}
