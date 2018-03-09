"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
exports.__esModule = true;
var fs = require("fs");
var ts = require("typescript");
var path = require("path");
var REPO_ROOT = path.join(__dirname, '../');
process({
    repoRoot: REPO_ROOT,
    esmSource: 'out',
    esmDestination: 'release/esm',
    entryPoints: [
        'monaco.contribution.js',
        'htmlMode.js',
        'html.worker.js',
        '../node_modules/vscode-html-languageservice/lib/esm/beautify/beautify-css.js',
        '../node_modules/vscode-html-languageservice/lib/esm/beautify/beautify.js',
    ],
    resolveAlias: {
        'vscode-nls': path.join(REPO_ROOT, "out/fillers/vscode-nls.js")
    },
    resolveSkip: [
        'monaco-editor-core'
    ],
    destinationFolderSimplification: {
        'node_modules': '_deps',
        'vscode-languageserver-types/lib/esm': 'vscode-languageserver-types',
        'vscode-uri/lib/esm': 'vscode-uri',
        'vscode-html-languageservice/lib/esm': 'vscode-html-languageservice'
    }
});
function process(options) {
    options.repoRoot = path.normalize(options.repoRoot).replace(/(\/|\\)$/, '');
    var ESM_SRC = path.join(options.repoRoot, options.esmSource);
    var ESM_DEST = path.join(options.repoRoot, options.esmDestination);
    var in_queue = Object.create(null);
    var queue = [];
    var enqueue = function (filePath) {
        if (in_queue[filePath]) {
            return;
        }
        in_queue[filePath] = true;
        queue.push(filePath);
    };
    var seenDir = {};
    var createDirectoryRecursive = function (dir) {
        if (seenDir[dir]) {
            return;
        }
        var lastSlash = dir.lastIndexOf('/');
        if (lastSlash === -1) {
            lastSlash = dir.lastIndexOf('\\');
        }
        if (lastSlash !== -1) {
            createDirectoryRecursive(dir.substring(0, lastSlash));
        }
        seenDir[dir] = true;
        try {
            fs.mkdirSync(dir);
        }
        catch (err) { }
    };
    seenDir[options.repoRoot] = true;
    var applyDestinationFolderSimplifications = function (filePath) {
        filePath = filePath.replace(/\\/g, '/');
        for (var key in options.destinationFolderSimplification) {
            var test = key.replace(/\\/g, '/');
            while (filePath.indexOf(test) >= 0) {
                filePath = filePath.replace(test, options.destinationFolderSimplification[test]);
            }
        }
        return filePath;
    };
    var shouldSkipImport = function (importText) {
        for (var i = 0; i < options.resolveSkip.length; i++) {
            var skip = options.resolveSkip[i];
            if (importText.indexOf(skip) === 0) {
                return true;
            }
        }
        return false;
    };
    var computeDestinationFilePath = function (filePath) {
        if (filePath.indexOf(ESM_SRC) === 0) {
            // This file is from our sources
            return path.join(ESM_DEST, path.relative(ESM_SRC, filePath));
        }
        else {
            // This file is from node_modules
            return path.normalize(applyDestinationFolderSimplifications(path.join(ESM_DEST, path.relative(options.repoRoot, filePath))));
        }
    };
    var write = function (filePath, fileContents) {
        var finalFilePath = computeDestinationFilePath(filePath);
        createDirectoryRecursive(path.dirname(finalFilePath));
        fs.writeFileSync(finalFilePath, fileContents);
    };
    options.entryPoints.forEach(function (filePath) {
        enqueue(path.join(ESM_SRC, filePath));
    });
    while (queue.length > 0) {
        var filePath = queue.shift();
        var fileContents = fs.readFileSync(filePath).toString();
        var info = ts.preProcessFile(fileContents);
        for (var i = info.importedFiles.length - 1; i >= 0; i--) {
            var importText = info.importedFiles[i].fileName;
            if (shouldSkipImport(importText)) {
                continue;
            }
            var pos = info.importedFiles[i].pos;
            var end = info.importedFiles[i].end;
            if (/(^\.\/)|(^\.\.\/)/.test(importText)) {
                // Relative import
                var importedFilename = path.join(path.dirname(filePath), importText) + '.js';
                enqueue(importedFilename);
            }
            else {
                var importedFilename = void 0;
                if (options.resolveAlias[importText]) {
                    importedFilename = options.resolveAlias[importText];
                }
                else {
                    importedFilename = findNodeModuleImport(options.repoRoot, importText, filePath);
                }
                var myDestinationPath = computeDestinationFilePath(filePath);
                var importDestinationPath = computeDestinationFilePath(importedFilename);
                var relativePath = path.relative(path.dirname(myDestinationPath), importDestinationPath);
                if (!/(^\.\/)|(^\.\.\/)/.test(relativePath)) {
                    relativePath = './' + relativePath;
                }
                relativePath = relativePath.replace(/\\/g, '/');
                relativePath = relativePath.replace(/\.js$/, '');
                fileContents = (fileContents.substring(0, pos + 1)
                    + relativePath
                    + fileContents.substring(end + 1));
                enqueue(importedFilename);
            }
        }
        write(filePath, fileContents);
    }
}
function findNodeModuleImport(repoRoot, module, sourceFilePath) {
    var modulePath = findNodeModule(repoRoot, module, sourceFilePath);
    var modulePackagePath = path.join(modulePath, 'package.json');
    if (!fs.existsSync(modulePackagePath)) {
        throw new Error("Missing " + modulePackagePath + " in node module " + modulePath);
    }
    var modulePackage = JSON.parse(fs.readFileSync(modulePackagePath).toString());
    if (typeof modulePackage.module !== 'string') {
        throw new Error("Missing property 'module' package.json at " + modulePackagePath);
    }
    var result = path.join(modulePath, modulePackage.module);
    if (!fs.existsSync(result)) {
        throw new Error("Missing file " + result);
    }
    return result;
    function findNodeModule(repoRoot, module, sourceFilePath) {
        var modulePaths = generatePaths(repoRoot, module, sourceFilePath);
        for (var i = 0; i < modulePaths.length; i++) {
            if (fs.existsSync(modulePaths[i])) {
                return modulePaths[i];
            }
        }
        throw new Error("Cannot find module " + module + " requested by " + sourceFilePath);
    }
    function generatePaths(repoRoot, module, sourceFilePath) {
        var sourceDir = path.dirname(sourceFilePath);
        var result = [];
        while (sourceDir.length >= repoRoot.length) {
            result.push(path.join(sourceDir, 'node_modules', module));
            sourceDir = path.dirname(sourceDir);
        }
        return result;
    }
}
