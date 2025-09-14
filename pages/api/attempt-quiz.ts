import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import type { NextApiRequest, NextApiResponse } from "next";
import { getQuiz } from "@/lib/get-quiz";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "POST") {
		try {
			const authHeader = req.headers.authorization;
			if (!authHeader) return res.status(401).json({ error: "No token" });

			const token = authHeader.split(" ")[1];
			const decoded = verifyToken(token);
			if (!decoded) return res.status(401).json({ error: "Invalid token" });

			const { babId, quizId, answer } = req.body;
			if (babId == null || quizId == null || !answer) {
				return res.status(400).json({ error: "babId, quizIndex, and answer required" });
			}

			const quizzes = JSON.parse(getQuiz(babId));
			const quiz = quizzes.questions[quizId - 1];
			if (!quiz) return res.status(404).json({ error: "Quiz not found" });

			const isCorrect = quiz.answer === answer;

			const attempt = await prisma.quizAttempt.upsert({
				where: {
					userId_babId_quizId: {
						userId: decoded.id,
						babId: parseInt(babId.slice(3)),
						quizId,
					}
				},
				update: {
					answer,
					isCorrect,
					attemptedAt: new Date(),
				},
				create: {
					userId: decoded.id,
					babId: parseInt(babId.slice(3)),
					quizId,
					answer,
					isCorrect,
			  	},
			});

			return res.status(200).json({ attempt });
		} catch (err: any) {
			console.error(err);
			return res.status(500).json({ error: "Something went wrong", message: err.message });
		}
	} else if (req.method === "GET") {
		try {
			const authHeader = req.headers.authorization;
			if (!authHeader) return res.status(401).json({ error: "No token" });

			const token = authHeader.split(" ")[1];
			const decoded = verifyToken(token);
			if (!decoded) return res.status(401).json({ error: "Invalid token" });

			const { babId } = req.query;
			const attempts = await prisma.quizAttempt.findMany({
				where: {
					userId: decoded.id,
					...(babId ? { babId: Number(babId) } : {}),
				},
				orderBy: { attemptedAt: "desc" },
			});

			return res.status(200).json({ attempts });
		} catch (err: any) {
			console.error(err);
			return res.status(500).json({ error: "Something went wrong", message: err.message });
		}
	}
}

