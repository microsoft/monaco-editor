import { spawn } from "child_process";
import { globSync } from "glob";
import { exit } from "process";

(async () => {
	let someFileError = false;
	const files = globSync("src/website/data/playground-samples/*/*/*.js");
	type Result = { file: string; status: number; stdout: string };
	const promises: Promise<Result>[] = [];
	for (const file of files) {
		promises.push(
			new Promise<Result>((resolve) => {
				const process = spawn(
					"yarn",
					[
						"tsc",
						"--target",
						"es6",
						"--noEmit",
						"--allowJs",
						"--checkJs",
						"--skipLibCheck",
						"../out/monaco-editor/monaco.d.ts",
						file,
					],
					{ shell: true }
				);
				let buffer = "";
				process.on("exit", () => {
					resolve({
						file: file,
						status: process.exitCode ?? 1,
						stdout: buffer,
					});
				});
				process.stdout.on("data", (data) => {
					buffer += data.toString();
				});
				process.stderr.on("data", (data) => {
					buffer += data.toString();
				});
			})
		);
	}
	for (const promise of promises) {
		const result = await promise;
		console.log(result.file);
		if (result.status != 0) {
			console.log(result.stdout.toString());
			someFileError = true;
		}
	}

	if (someFileError) {
		console.error("Some files had type errors.");
		exit(1);
	}
})();
