import axios from "axios";
import "dotenv/config";
import { AppError } from "../../../utils/appError";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const API_URL = "https://api.deepseek.com/chat/completions";

if (!DEEPSEEK_API_KEY) {
  throw new Error("DEEPSEEK_API_KEY is not defined in your .env file");
}

/**
 * Sends CV and report text to the DeepSeek API for information extraction.
 * @param cvText The raw text from the CV.
 * @param reportText The raw text from the project report.
 * @returns The structured JSON data extracted by the LLM.
 */
export async function extractCvInfoFromText(
  cvText: string,
  reportText: string
): Promise<any> {
  const prompt = `
    You are an expert HR recruitment assistant. Your task is to extract key information 
    from the provided CV and project report. Respond ONLY with a valid JSON object. 
    Do not include any other text, explanations, or markdown formatting.

    The JSON structure must be:
    {
      "cv": {
        "skills": ["string"],
        "experience_years": "number",
        "achievements": ["string"]
      },
      "project": {
        "tech_stack": ["string"],
        "summary": "string"
      }
    }
    
    CV: """${cvText}"""
    
    Project Report: """${reportText}"""
  `;

  try {
    const response = await axios.post(
      API_URL,
      {
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1, // Lower temperature for more deterministic results
        response_format: { type: "json_object" }, // Meminta respons dalam format JSON
      },
      {
        headers: {
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.choices[0].message.content
      ? JSON.parse(response.data.choices[0].message.content)
      : null;
  } catch (error: any) {
    console.error(
      "DeepSeek API Error:",
      error.response ? error.response.data : error.message
    );
    throw new AppError("Failed to communicate with the AI model", 502); // 502 Bad Gateway
  }
}
