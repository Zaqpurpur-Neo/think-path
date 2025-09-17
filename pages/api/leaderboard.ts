import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		const limit = Number(req.query.limit ?? 10);

		const stats = await prisma.testAttempt.groupBy({
			by: ["userId"],
			where: { isCorrect: true },
			_count: { id: true }, // count of correct entries 
			orderBy: { _count: { id: "desc" } },
			take: limit,
		});

		const userIds = stats.map(s => s.userId);

		const users = await prisma.user.findMany({
			where: { id: { in: userIds } },
			select: { id: true, name: true, email: true },
		});

		const rows = stats.map(s => {
			const usr = users.find(u => u.id === s.userId);
			return {
        		userId: s.userId,
        		name: usr?.name ?? usr?.email ?? "Unknown",
				email: usr?.email,
        		correctCount: s._count.id,
			};
		});

		const ranked = rows.map((r, idx) => ({ rank: idx + 1, ...r }));

		return res.status(200).json({ leaderboard: ranked });

	} catch (err: any) {
		console.error(err);
		return res.status(500).json({ error: "Something went wrong", message: err.message })
	}
}

