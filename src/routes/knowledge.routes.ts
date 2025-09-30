import { Router } from "express";
import { KnowledgeHandler } from "../features/cv_evaluations/handlers/knowledge.handler";
import { validate } from "../middlewares/validate";

const handler = new KnowledgeHandler();

const router = Router();

router.post("/", handler.create);
router.get("/", handler.getAll);

router.get("/:id", handler.getById);

router.put("/:id", handler.update);
router.delete("/:id", handler.delete);

export default router;
