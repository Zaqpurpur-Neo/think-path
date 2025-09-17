import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import type { NextApiRequest, NextApiResponse } from "next";
import { getTest } from "@/lib/get-test";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "POST") {
		try {
			const authHeader = req.headers.authorization;
			if (!authHeader) return res.status(401).json({ error: "No token" });

			const token = authHeader.split(" ")[1];
			const decoded = verifyToken(token);
			if (!decoded) return res.status(401).json({ error: "Invalid token" });

			const { testId, answer } = req.body;
			if (testId == null || !answer) {
				return res.status(400).json({ error: "testIndex and answer required" });
			}

			const tests = JSON.parse(getTest());
			const test = tests.questions.filter(item => item.id === testId)[0];
			console.log("LOG", testId, test, answer)

			if (!test) return res.status(404).json({ error: "Test not found" });

			const isCorrect = test.answer === answer;

			const attempt = await prisma.testAttempt.upsert({
				where: {
					userId_testId: {
						userId: decoded.id,
						testId,
					}
				},
				update: {
					answer,
					isCorrect,
					attemptedAt: new Date(),
				},
				create: {
					userId: decoded.id,
					testId,
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

			const attempts = await prisma.testAttempt.findMany({
				where: {
					userId: decoded.id,
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


