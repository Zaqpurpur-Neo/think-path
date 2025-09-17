import { NextApiRequest, NextApiResponse } from "next";
import { getQuiz } from "@/lib/get-quiz";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
	const { quiz } = req.query;
	if(quiz === undefined) {
		res.status(400).json({ content: "" })
	} else {
		const content = getQuiz(quiz as string); 
		res.status(200).json({ 
			content: JSON.parse(content),
		});
	}
}
