import fs from "fs";
import path from "path";

export function getMarkdown(slug: string) {
	const filePath = path.join(process.cwd(), "content", slug, "index.md");
	return fs.readFileSync(filePath, "utf-8");
}

