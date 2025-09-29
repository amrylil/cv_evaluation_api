import { fetch } from "bun";

const DEEPSEEK_API_URL = process.env.API_URL!;
const API_KEY = process.env.DEEPSEEK_API_KEY!;

interface DeepSeekChoice {
  message: { role: string; content: string };
}

interface DeepSeekResponse {
  choices: DeepSeekChoice[];
}

export async function callDeepSeek(prompt: string) {
  const response = await fetch(DEEPSEEK_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are an expert technical recruiter." },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`DeepSeek API error: ${response.status} ${errText}`);
  }

  const data = (await response.json()) as DeepSeekResponse;
  return data.choices[0].message.content;
}
