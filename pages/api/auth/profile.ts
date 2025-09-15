import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { NextApiResponse, NextApiRequest } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	try {
		const authHeader = req.headers.authorization;
		if(authHeader === undefined || authHeader === null) res.status(401).json({ error: "No Token" })

		const token = authHeader.split(" ")[1];
		const decoded = verifyToken(token);
		if(!decoded) return res.status(401).json({ error: "Invalid Token" })

		const user = await prisma.user.findUnique({ 
			where: { id: decoded.id },
			select: { id: true, email: true, name: true, birthday: true, educationLevel: true }
		})

		res.status(200).json({ user });
	} catch(err) {
		res.status(400).json({
			error: "Something Went Wrong",
			message: err.message
		})
	}
}
