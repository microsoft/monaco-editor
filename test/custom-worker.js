// This example uses @typescript/vfs to create a virtual TS program
// which can do work on a bg thread.

// This version of the vfs edits the global scope (in the case of a webworker, this is 'self')
importScripts('https://unpkg.com/@typescript/vfs@1.3.0/dist/vfs.globals.js');

/** @type { import("@typescript/vfs") } */
const tsvfs = globalThis.tsvfs;

/** @type {import("../src/tsWorker").CustomTSWebWorkerFactory }*/
const worker = (TypeScriptWorker, ts, libFileMap) => {
	return class MonacoTSWorker extends TypeScriptWorker {
		// Adds a custom function to the webworker
		async getDTSEmitForFile(fileName) {
			const result = await this.getEmitOutput(fileName);
			const firstDTS = result.outputFiles.find((o) => o.name.endsWith('.d.ts'));
			return (firstDTS && firstDTS.text) || '';
		}

		async printAST(fileName) {
			console.log('Creating virtual TS project');
			const compilerOptions = this.getCompilationSettings();
			const fsMap = new Map();
			for (const key of Object.keys(libFileMap)) {
				fsMap.set(key, '/' + libFileMap[key]);
			}

			const thisCode = await this.getScriptText(fileName);
			fsMap.set('index.ts', thisCode);

			console.log('Starting up TS program');
			const system = tsvfs.createSystem(fsMap);
			const host = tsvfs.createVirtualCompilerHost(system, compilerOptions, ts);

			const program = ts.createProgram({
				rootNames: [...fsMap.keys()],
				options: compilerOptions,
				host: host.compilerHost
			});

			// Now I can look at the AST for the .ts file too
			const mainSrcFile = program.getSourceFile('index.ts');
			let miniAST = 'SourceFile';

			const recurse = (parent, depth) => {
				if (depth > 5) return;
				ts.forEachChild(parent, (node) => {
					const spaces = '  '.repeat(depth + 1);
					miniAST += `\n${spaces}${ts.SyntaxKind[node.kind]}`;
					recurse(node, depth + 1);
				});
			};
			recurse(mainSrcFile, 0);
			return miniAST;
		}
	};
};

self.customTSWorkerFactory = worker;
