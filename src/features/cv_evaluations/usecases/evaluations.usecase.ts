import { pipeline } from "@xenova/transformers";
import { callDeepSeek } from "../../../utils/deepseek";
import { KnowledgeBaseItem, Task } from "../entities/task";
import { cosineSimilarity } from "../../../utils/similarity";
import { IEvaluationService } from "../contract";

export class evaluationService implements IEvaluationService {
  private embedder: any;
  private knowledgeBase: KnowledgeBaseItem[] = [];

  async initEmbedder() {
    this.embedder = await pipeline(
      "feature-extraction",
      "sentence-transformers/all-MiniLM-L6-v2"
    );
  }

  async embedText(text: string): Promise<number[]> {
    const output = await this.embedder(text, {
      pooling: "mean",
      normalize: true,
    });
    return Array.from(output.data);
  }

  async initKnowledgeBase() {
    const jobdesc = `
  We are hiring a Backend Engineer.
  Requirements:
  - Node.js, Express
  - PostgreSQL
  - Docker, AWS
  - Experience 2+ years
  Bonus: LLM, RAG
  `;

    const rubric = `
  Scoring rubric:
  - CV Evaluation: Skills, Experience, Achievements, Cultural Fit
  - Project Evaluation: Correctness, Code Quality, Resilience, Documentation, Creativity
  `;

    this.knowledgeBase.push({
      text: jobdesc,
      vector: await this.embedText(jobdesc),
    });
    this.knowledgeBase.push({
      text: rubric,
      vector: await this.embedText(rubric),
    });
  }

  async retrieveContext(query: string, k = 2): Promise<string> {
    const queryVec = await this.embedText(query);
    return this.knowledgeBase
      .map((item) => ({
        text: item.text,
        score: cosineSimilarity(queryVec, item.vector),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, k)
      .map((r) => r.text)
      .join("\n");
  }

  async processEvaluation(task: Task) {
    task.status = "processing";

    try {
      const context = await this.retrieveContext("backend engineer evaluation");

      const prompt = `
    Job Description & Rubric:
    ${context}

    Candidate CV:
    ${task.cv}

    Candidate Project:
    ${task.project}

    Please evaluate based on rubric. Return JSON with:
    - cv_match_rate
    - cv_feedback
    - project_score
    - project_feedback
    - overall_summary
    `;

      const evaluation = await callDeepSeek(prompt);
      task.status = "completed";
      task.result = evaluation;
    } catch (err) {
      task.status = "failed";
      task.error = (err as Error).message;
    }
  }
}
