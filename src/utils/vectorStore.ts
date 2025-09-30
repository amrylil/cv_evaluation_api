import axios from "axios";

export async function embedText(text: string): Promise<number[]> {
  const res = await axios.post(
    "https://openrouter.ai/api/v1/embeddings",
    {
      model: "text-embedding-3-small",
      input: text,
    },
    {
      headers: {
        Authorization: `Bearer ${"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"}`,
      },
    }
  );

  return res.data.data[0].embedding as number[];
}

function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (normA * normB);
}

export async function searchRelevantChunks(
  queryEmbedding: number[],
  topK: number = 5
): Promise<{ content: string; score: number }[]> {
  const knowledgeBase = [
    {
      id: 1,
      content: "Menguasai Node.js, Express, dan PostgreSQL",
      embedding: await embedText("Menguasai Node.js, Express, dan PostgreSQL"),
    },
    {
      id: 2,
      content: "Pengalaman dengan AWS dan Docker di production",
      embedding: await embedText(
        "Pengalaman dengan AWS dan Docker di production"
      ),
    },
    {
      id: 3,
      content: "CI/CD pipeline dengan GitHub Actions",
      embedding: await embedText("CI/CD pipeline dengan GitHub Actions"),
    },
  ];

  const scored = knowledgeBase.map((chunk) => ({
    content: chunk.content,
    score: cosineSimilarity(queryEmbedding, chunk.embedding),
  }));

  return scored.sort((a, b) => b.score - a.score).slice(0, topK);
}
