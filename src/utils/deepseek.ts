const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const API_KEY =
  "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";

interface LLMChoice {
  message: { role: string; content: string };
}

interface LLMResponse {
  choices: LLMChoice[];
}

export async function callOpenRouter(prompt: string) {
  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.YOUR_APP_URL || "http://localhost:3000",
      "X-Title": process.env.YOUR_APP_NAME || "CV Check App",
    },
    body: JSON.stringify({
      model: "deepseek/deepseek-chat-v3.1:free",
      messages: [
        { role: "system", content: "You are an expert technical recruiter." },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} ${errText}`);
  }

  const data = (await response.json()) as LLMResponse;
  return data.choices[0].message.content;
}
