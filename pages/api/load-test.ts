import { getTest } from "@/lib/get-test";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
	const content = getTest(); 
	res.status(200).json({ 
		content: JSON.parse(content),
	});
}
