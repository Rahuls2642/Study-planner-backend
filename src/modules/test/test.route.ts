import { Router } from "express";
import { geminiService } from "@/services/ai/gemini.service";

const router = Router();

router.get("/gemini", async (req, res) => {
    const result = await geminiService.analyzeSyllabus(`
Database Management Systems

Unit 1: Introduction to DBMS

Unit 2: ER Model

Unit 3: Normalization

Mid Semester Exam: October 10

Final Exam: December 20
  `);

    res.json(result);
});

export default router;