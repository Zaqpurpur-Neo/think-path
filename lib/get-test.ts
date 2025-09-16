import fs from "fs";
import path from "path";

export function getTest() {
	const filePath = path.join(process.cwd(), "content", "test-uas", "test.json");
	return fs.readFileSync(filePath, "utf-8");
}


