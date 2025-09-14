const fs = require("fs")
const path = require("path")
const { PrismaClient } = require("../generated/prisma")

const prisma = new PrismaClient();

async function main() {
	const contentDir = path.join(process.cwd(), "content");
	const folders = fs.readdirSync(contentDir).filter(f => f.startsWith("bab"));

	for (const folder of folders) {
		const number = parseInt(folder.replace("bab", ""), 10);

    	const viewFile = path.join(contentDir, folder, "view.json");
		let meta = {};

		if (fs.existsSync(viewFile)) {
			const data = JSON.parse(fs.readFileSync(viewFile, "utf8"));
			meta = {
				title: data.title ?? meta?.title,
				synopsis: data.synopsis ?? "",
			};
		}

		if(meta !== null) {
			const bab = await prisma.bab.upsert({
				where: { number },
				update: meta,
				create: { number, ...meta },
			});
		
			const users = await prisma.user.findMany({ select: { id: true } });

			for (const user of users) {
				await prisma.progress.upsert({
					where: { userId_babId: { userId: user.id, babId: bab.id } },
					update: {},
					create: { userId: user.id, babId: bab.id, status: "NOT_OPENED" },
				});
			}
		}
	}
}

main()
	.then(() => console.log("✅ Seed completed"))
	.catch(e => {
		console.error(e);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());

