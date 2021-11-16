/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check

/** @typedef {import('../build/utils').IFile} IFile */

const path = require('path');
const cp = require('child_process');
const { REPO_ROOT } = require('./utils');

cp.execSync('git init', {
	cwd: path.join(REPO_ROOT, '../monaco-editor-website')
});

const remoteUrl = cp.execSync('git remote get-url origin');
const committerUserName = cp.execSync("git log --format='%an' -1");
const committerEmail = cp.execSync("git log --format='%ae' -1");

cp.execSync(`git config user.name ${committerUserName}`, {
	cwd: path.join(REPO_ROOT, '../monaco-editor-website')
});
cp.execSync(`git config user.email ${committerEmail}`, {
	cwd: path.join(REPO_ROOT, '../monaco-editor-website')
});

cp.execSync(`git remote add origin ${remoteUrl}`, {
	cwd: path.join(REPO_ROOT, '../monaco-editor-website')
});
cp.execSync('git checkout -b gh-pages', {
	cwd: path.join(REPO_ROOT, '../monaco-editor-website')
});
cp.execSync('git add .', {
	cwd: path.join(REPO_ROOT, '../monaco-editor-website')
});
cp.execSync('git commit -m "Publish website"', {
	cwd: path.join(REPO_ROOT, '../monaco-editor-website')
});

console.log('RUN monaco-editor-website>git push origin gh-pages --force');
