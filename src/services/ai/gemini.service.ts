import { GoogleGenAI } from "@google/genai";

import { env } from "@/config/env";
import { ApiError } from "../../config/utils/ApiError";
import { syllabusAiSchema } from "@/modules/syllabus/validators/ai-response.schema";
import { studyPlanAiSchema } from "@/modules/study-plans/validators/study-plan-ai.schema";

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
      "description": string,
      "estimatedDurationMinutes": number,
      "assessmentTitle": string
    }
  ],
  "assessments": [
    {
      "title": string,
      "date": string | null
    }
  ]
}

Extract all study topics.
Return JSON only.
Each topic must contain:
- title
- description
- estimatedDurationMinutes
- assessmentTitle

assessmentTitle should match the assessment that primarily covers this topic.

Estimate how many minutes an average student needs to study that topic thoroughly.
Return only an integer number of minutes.

Example:
{
  "topics":[
    {
      "title":"Arrays",
      "description":"...",
      "estimatedDurationMinutes":90,
      "assessmentTitle":"Midterm"
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
      console.error("Gemini Parsing Error:", error);
      console.error("Raw Response:", response.text);
      throw new ApiError(
        500,
        "Failed to parse Gemini response."
      );
    }
  }

  async generateStudyPlan(
    topics: {
      id: string;
      title: string;
      order: number;
    }[],
    assessments: {
      title: string;
      examDate: string | null;
    }[],
    dailyStudyMinutes: number
  ) {
    const topicList = JSON.stringify(
      topics.map((topic, index) => ({
        index: index + 1,
        title: topic.title,
      })),
      null,
      2
    );

    const assessmentList =
      assessments.length === 0
        ? "No upcoming assessments."
        : assessments
            .map(
              (assessment) =>
                `- ${assessment.title} (${assessment.examDate ?? "No Date"})`
            )
            .join("\n");

    const prompt = `
You are an expert academic planner.

Return ONLY valid JSON.

Distribute the topics into a realistic daily study schedule starting from today (${new Date().toISOString().split('T')[0]}).

Daily study time:
${dailyStudyMinutes} minutes

Topics (Match using "index" mapped to "topicIndex"):
${topicList}

Upcoming assessments:
${assessmentList}

Rules:

- Study every day.
- Keep daily workload balanced.
- Include revision if appropriate.
- Do NOT invent new topics.
- Return only JSON.

JSON Schema:

{
  "days":[
    {
      "date":"2026-08-01",
      "tasks":[
        {
          "topicIndex": 1,
          "estimatedMinutes": 60
        }
      ]
    }
  ]
}
`;

    const response =
      await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
          responseMimeType:
            "application/json",
        },
      });

    try {
      return studyPlanAiSchema.parse(
        JSON.parse(response.text ?? "{}")
      );
    } catch {
      throw new ApiError(
        500,
        "Failed to parse study plan response."
      );
    }
  }
}

export const geminiService = new GeminiService();
