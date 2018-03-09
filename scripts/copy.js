/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const fs = require('fs');
const path = require('path');

const source = path.join(process.cwd(), process.argv[2]);
const destination = path.join(process.cwd(), process.argv[3]);

// ensure target dir
(function () {
	let dirs = [];
	let dirname = path.dirname(destination);
	while (dirname !== process.cwd()) {
		dirs.push(dirname);
		dirname = path.dirname(dirname);
	}

	dirs.reverse();

	dirs.forEach((dir) => {
		try { fs.mkdirSync(dir); } catch (err) { }
	})
})();

fs.writeFileSync(destination, fs.readFileSync(source));

console.log(`Copied ${process.argv[2]} to ${process.argv[3]}`);
