import { spawnSync } from "child_process";
import { globSync } from "glob";
import { exit } from "process";

let someFileError = false;
const files = globSync("src/website/data/playground-samples/*/*/*.js");
for (const file of files) {
	const command = `yarn tsc --noEmit --allowJs --checkJs --skipLibCheck ../out/monaco-editor/monaco.d.ts ${file}`;
	console.log(file);
	const { status, stdout } = spawnSync(
		"yarn",
		[
			"tsc",
			"--noEmit",
			"--allowJs",
			"--checkJs",
			"--skipLibCheck",
			"../out/monaco-editor/monaco.d.ts",
			file,
		],
		{ shell: true }
	);
	if (status != 0) {
		console.log(stdout.toString());
		someFileError = true;
	}
}

if (someFileError) {
	console.error("Some files had type errors.");
	exit(1);
}
