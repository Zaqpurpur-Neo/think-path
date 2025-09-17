import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/prisma"
import type { NextApiRequest, NextApiResponse } from "next";
import type { User } from "@/types";

async function initProgress(id: string) {
	const babs = await prisma.bab.findMany();

	await prisma.progress.createMany({
		data: babs.map(bab => ({
			userId: id,
			babId: bab.id,
			status: "NOT_OPENED"
		})),
	});

}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	try {
		if(req.method != "POST") res.status(400).end();

		const {email, password, name, birthday, educationLevel}: User & { password: string } = req.body;

		const existingUser = await prisma.user.findUnique({ where: { email } });
		if(existingUser) res.status(400).json({error: "User already exitst"});

		const id = uuidv4();

		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await prisma.user.create({
			data: { id: id, email, password: hashedPassword, name, birthday, educationLevel }
		})

		initProgress(id);

		res.status(201).json({ message: "User registered", user: { id: user.id, email: user.email } });
	} catch(err) {
		res.status(400).json({
			error: "Something Went Wrong",
			message: err.message
		})
	}
}
