/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.join(__dirname, '../../../');
const packagejsonPath = path.join(REPO_ROOT, 'package.json');
const packagejson = JSON.parse(fs.readFileSync(packagejsonPath).toString());
packagejson['devDependencies']['monaco-editor-core'] = 'file:../vscode/out-monaco-editor-core';
fs.writeFileSync(packagejsonPath, JSON.stringify(packagejson, null, '\t') + '\n');
