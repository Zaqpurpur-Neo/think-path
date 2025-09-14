import fs from "fs";
import path from "path";

export function getQuiz(slug: string) {
	const filePath = path.join(process.cwd(), "content", slug, "quiz.json");
	return fs.readFileSync(filePath, "utf-8");
}

