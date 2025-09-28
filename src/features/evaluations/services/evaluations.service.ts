import { v4 as uuidv4 } from "uuid";
import { extractCvInfoFromText } from "./deepseek.service";
import { Evaluation } from "../types/evaluation.types";
import { CreateEvaluationDto } from "../dtos/evaluation.dto";
import { AppError } from "../../../utils/appError";

const evaluations = new Map<string, Evaluation>();

export const createEvaluation = async (
  input: CreateEvaluationDto
): Promise<Evaluation> => {
  const id = uuidv4();
  const newEvaluation: Evaluation = {
    id,
    status: "queued",
    createdAt: new Date(),
  };
  evaluations.set(id, newEvaluation);

  processEvaluationQueue(id, input);

  return newEvaluation;
};

export const getEvaluationById = (id: string): Evaluation => {
  const evaluation = evaluations.get(id);
  if (!evaluation) {
    throw new AppError("Evaluation with that ID not found", 404);
  }
  return evaluation;
};

const processEvaluationQueue = async (
  id: string,
  input: CreateEvaluationDto
) => {
  const current = evaluations.get(id)!;

  try {
    current.status = "processing";
    const extractedData = await extractCvInfoFromText(
      input.cv_text,
      input.report_text
    );
    if (!extractedData) throw new AppError("AI model returned empty data", 500);

    let score = 50;
    if (extractedData.cv?.skills?.length > 3) score += 15;
    if (extractedData.cv?.experience_years > 3) score += 20;
    if (extractedData.project?.tech_stack?.length > 2) score += 15;
    score = Math.min(score, 100);

    const feedback = `Candidate evaluated with a score of ${score}.`;

    current.status = "completed";
    current.result = { extracted_info: extractedData, score, feedback };
  } catch (error: any) {
    current.status = "failed";
    current.error = error.message;
  }
};
