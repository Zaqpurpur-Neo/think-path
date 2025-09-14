import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
	if(req.method !== 'POST') res.status(401).end();

	const { postId, userId, status } = req.body;

	const getProgress = await prisma.progress.findFirst({
		where: {
			userId: userId, babId: postId
		}
	})

	const progress = await prisma.progress.update({
		where: { id: getProgress?.id },
		data: {
			status: status
		}
	})

	res.status(200).send({ result: progress })
}
