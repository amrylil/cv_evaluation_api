export type EvaluationStatus = "queued" | "processing" | "completed" | "failed";

export interface Evaluation {
  id: string;
  status: EvaluationStatus;
  result?: {
    extracted_info: any;
    score: number;
    feedback: string;
  };
  error?: string;
  createdAt: Date;
}
