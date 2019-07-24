// @ts-check
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const {execSync} = require('child_process');
const {join} = require('path')
const {readFileSync, writeFileSync} = require("fs")

// Update to the daily build
execSync("npm install --save typescript@next")

// Update the dts files
execSync("npm run import-typescript")

// Sync the versions
const packagePath = join(__dirname, "../package.json")
const package = JSON.parse(readFileSync(packagePath, "utf8"))

const tsPackagePath = join(__dirname, "../node_modules/typescript/package.json")
const tsPackage = JSON.parse(readFileSync(tsPackagePath, "utf8"))

// Set the monaco-typescript version to directly match the typescript nightly version
package.version = tsPackage.version
writeFileSync(packagePath, JSON.stringify(package), "utf8")

