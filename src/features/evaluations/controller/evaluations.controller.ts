import { Request, Response, NextFunction } from "express";
import {
  createEvaluation,
  getEvaluationById,
} from "../services/evaluations.service";
import { ApiResponse } from "../../../utils/apiResponse";

export const submitEvaluation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newEvaluation = await createEvaluation(req.body);

    ApiResponse.success(
      res,
      { id: newEvaluation.id, status: newEvaluation.status }, // data
      "Evaluation has been queued",
      202
    );
  } catch (error) {
    next(error);
  }
};

export const getEvaluationResult = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const evaluation = getEvaluationById(id);

    ApiResponse.success(
      res,
      evaluation,
      "Evaluation data retrieved successfully",
      200
    );
  } catch (error) {
    next(error);
  }
};
