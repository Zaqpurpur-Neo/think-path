import path from "path"
import fs from "fs"

const getElement = process.argv.slice(2, process.argv.length)[0]
const folder = "./components/" + getElement;
const indexTsx = folder + "/index.tsx";
const moduleCss = folder + "/" + getElement + ".module.css";

if(fs.existsSync(getElement)) {
	console.log("[INFO]:", getElement, "is already exists")
	process.exit(0);
}

const boilerplateTsx = `import styles from "./${getElement}.module.css";

export default function ${getElement}() {
	return (
		<>
		</>
	)
}
`

fs.mkdirSync(folder)
fs.writeFileSync(indexTsx, boilerplateTsx)
fs.writeFileSync(moduleCss, "")
console.log("[INFO]: succesfully create", getElement, "components")

