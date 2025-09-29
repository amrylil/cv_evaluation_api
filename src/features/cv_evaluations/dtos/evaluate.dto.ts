export interface EvaluateRequest {
  id: string;
}

export interface EvaluateResponse {
  id: string;
  status: "queued" | "processing" | "completed" | "failed";
}
