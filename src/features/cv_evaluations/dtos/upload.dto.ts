export interface UploadRequest {
  cv: string;
  project: string;
}

export interface UploadResponse {
  id: string;
  status: "uploaded";
}
