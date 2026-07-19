/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check

const yaserver = require('yaserver');
const http = require('http');
const path = require('path');

const REPO_ROOT = path.join(__dirname, '../../');
const PORT = parseInt(process.env.PORT || '8563', 10);

yaserver
	.createServer({
		rootDir: REPO_ROOT
	})
	.then((/** @type {any} */ staticServer) => {
		const server = http.createServer((request, response) => {
			return staticServer.handle(request, response);
		});
		server.listen(PORT, '127.0.0.1', () => {
			console.log(`Server running at http://127.0.0.1:${PORT}`);
		});
	});
