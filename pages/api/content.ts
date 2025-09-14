import { NextApiRequest, NextApiResponse } from "next";
import { getMarkdown } from "@/lib/get-markdown";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
	const { module } = req.query;
	if(module === undefined) {
		res.status(400).json({ content: "" })
	} else {
		const { userId, postId } = req.body;
		const getProgress = await prisma.progress.findFirst({
			where: {
				userId: userId, babId: postId
			}
		})

		const content = getMarkdown(module as string);
		res.status(200).json({ 
			content: content,
			status: getProgress?.status
		});
	}
}
