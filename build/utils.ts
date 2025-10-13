/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';
import { ensureDir } from './fs';

export const REPO_ROOT = path.join(__dirname, '../');


export interface IFile {
	path: string;
	contents: Buffer;
}

export function readFiles(
	pattern: string,
	options: { base: string; ignore?: string[]; dot?: boolean }
): IFile[] {
	let files = glob.sync(pattern, { cwd: REPO_ROOT, ignore: options.ignore, dot: options.dot });
	// remove dirs
	files = files.filter((file) => {
		const fullPath = path.join(REPO_ROOT, file);
		const stats = fs.statSync(fullPath);
		return stats.isFile();
	});

	const base = options.base;
	return files.map((file) => readFile(file, base));
}

export function readFile(file: string, base: string = '') {
	const baseLength = base === '' ? 0 : base.endsWith('/') ? base.length : base.length + 1;
	const fullPath = path.join(REPO_ROOT, file);
	const contents = fs.readFileSync(fullPath);
	const relativePath = file.substring(baseLength);
	return {
		path: relativePath,
		contents
	};
}

export function writeFiles(files: IFile[], dest: string) {
	for (const file of files) {
		const fullPath = path.join(REPO_ROOT, dest, file.path);
		ensureDir(path.dirname(fullPath));
		fs.writeFileSync(fullPath, file.contents);
	}
}
