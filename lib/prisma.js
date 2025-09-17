import { PrismaClient } from "../node_modules/generated/prisma";

export const prisma = new PrismaClient({
	log: ["query", "info", "warn"]
})
