import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
	try {
		if(req.method !== 'POST') res.status(401).end();

		const { userId } = req.body;

		const modules = await prisma.bab.findMany()
		const progress = await prisma.progress.findMany({
			where: { userId: userId }
		})
		const result = [];

		for (let item of modules) {
			result.push({
				...item,
				status: progress[item.number - 1].status
			})
		}

		res.status(200).send({ result })
	} catch(err) {
		res.status(500).send({ message: "something wrong" })
	}
}
