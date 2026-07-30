import { GoogleGenAI } from "@google/genai";

import { env } from "@/config/env";
import { ApiError } from "../../config/utils/ApiError";
import { syllabusAiSchema } from "@/modules/syllabus/validators/ai-response.schema";

const ai = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
});

class GeminiService {
  async analyzeSyllabus(text: string) {
    const prompt = `
You are an academic planner.

Analyze the syllabus below and return ONLY valid JSON.

Schema:

{
  "courseName": string,
  "topics": [
    {
      "title": string,
      "order": number
    }
  ],
  "assessments": [
    {
      "title": string,
      "date": string | null
    }
  ]
}

Syllabus:

${text}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    try {
      const parsed = syllabusAiSchema.parse(
        JSON.parse(response.text ?? "{}")
      );
      
      return parsed;
    } catch (error) {
      throw new ApiError(
        500,
        "Failed to parse Gemini response."
      );
    }
  }
}

export const geminiService = new GeminiService();
