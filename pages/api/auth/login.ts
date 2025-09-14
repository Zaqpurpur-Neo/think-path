import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
	try {
		if (req.method !== "POST") return res.status(405).end();
		const { email, password } = req.body;

		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) return res.status(400).json({ error: "Invalid email or password" });

		const isValid = await bcrypt.compare(password, user.password);
		if (!isValid) return res.status(400).json({ error: "Invalid email or password" });

		const token = signToken(user);
		res.status(200).json({ token });
	} catch(err) {
		res.status(400).json({
			error: "Something Went Wrong",
			message: err.message
		})
	}
}

