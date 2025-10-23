import { readFile } from 'fs/promises';
import * as path from 'path';
import MagicString from 'magic-string';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


var __assign = function () {
	__assign = Object.assign || function __assign(t) {
		for (var s, i = 1, n = arguments.length; i < n; i++) {
			s = arguments[i];
			for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
		}
		return t;
	};
	return __assign.apply(this, arguments);
};

function __rest(s, e) {
	var t = {};
	for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
		t[p] = s[p];
	if (s != null && typeof Object.getOwnPropertySymbols === "function")
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
			if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
				t[p[i]] = s[p[i]];
		}
	return t;
}

function __awaiter(thisArg, _arguments, P, generator) {
	function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	return new (P || (P = Promise))(function (resolve, reject) {
		function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
		function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
		function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
		step((generator = generator.apply(thisArg, _arguments || [])).next());
	});
}

function __generator(thisArg, body) {
	var _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
	function verb(n) { return function (v) { return step([n, v]); }; }
	function step(op) {
		if (f) throw new TypeError("Generator is already executing.");
		while (g && (g = 0, op[0] && (_ = 0)), _) try {
			if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
			if (y = 0, t) op = [op[0] & 2, t.value];
			switch (op[0]) {
				case 0: case 1: t = op; break;
				case 4: _.label++; return { value: op[1], done: false };
				case 5: _.label++; y = op[1]; op = [0]; continue;
				case 7: op = _.ops.pop(); _.trys.pop(); continue;
				default:
					if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
					if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
					if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
					if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
					if (t[2]) _.ops.pop();
					_.trys.pop(); continue;
			}
			op = body.call(thisArg, _);
		} catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
		if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	}
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
	var e = new Error(message);
	return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var escapeRegex = function (val) { return val.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&"); };
var assertDuplicates = function (stylesToEmit) {
	Object.values(stylesToEmit).forEach(function (v, i, all) {
		if (all.some(function (av, ai) { return !!v.output && v.output === av.output && ai != i; })) {
			throw new Error("Two or more assets have conflicting output path ".concat(v.output));
		}
	});
};
var assertLocation = function (outDir, assetPath) {
	if (!path.normalize(assetPath).startsWith(path.normalize(outDir))) {
		throw new Error("Output path ".concat(assetPath, " must be in output directory ").concat(outDir));
	}
};
var ensureSourceMap = function (_a, includeSourceMap, fileName, onEmit) {
	var css = _a.css, map = _a.map;
	if (map) {
		if (includeSourceMap === "inline") {
			css += "\n/*# sourceMappingURL=data:application/json;base64,".concat((map instanceof Uint8Array ? Buffer.from(map) : Buffer.from(map, "utf8")).toString("base64"), "*/");
		}
		else if (includeSourceMap === true) {
			css += "\n/*# sourceMappingURL=".concat(path.basename(fileName), ".map */");
		}
		if (includeSourceMap === true) {
			onEmit({
				type: "asset",
				fileName: fileName + ".map",
				source: map,
			});
		}
	}
	return css;
};
var formatProcessedToCSS = function (input, sourceMap) {
	return typeof input === "string"
		? { css: input, map: "" }
		: typeof input === "object"
			? {
				css: input.css,
				map: !sourceMap ? "" : typeof input.map === "object" ? JSON.stringify(input.map) : input.map,
			}
			: input;
};
var requireSass = function () {
	try {
		return import('sass');
	}
	catch (e) {
		throw new Error("You have to install `sass` package! Try running\n\t" +
			"npm install --save-dev sass\nor\nyarn add sass --dev\n" +
			"or use `sass` option to pass processor");
	}
};

function ensureCompiler(sass) {
	return __awaiter(this, void 0, void 0, function () {
		var sassProcessor, _a;
		return __generator(this, function (_b) {
			switch (_b.label) {
				case 0:
					_a = sass;
					if (_a) return [3 /*break*/, 2];
					return [4 /*yield*/, requireSass()];
				case 1:
					_a = (_b.sent());
					_b.label = 2;
				case 2:
					sassProcessor = _a;
					if (!("compileAsync" in sassProcessor)) {
						throw new Error("You have to install `sass` package! Or provide an object which implements `compileAsync` as `sass` option");
					}
					return [2 /*return*/, sassProcessor];
			}
		});
	});
}
var isPostCssCompatible = function (result) {
	return result && typeof result === "object" && "process" in result && typeof result.process === "function";
};
var compileSass = function (sassPath, outWatchList, _a) {
	var outputExt = _a.outputExt, sass = _a.sass, postProcessor = _a.postProcessor, loadPaths = _a.loadPaths, sourceMap = _a.sourceMap, sassOptions = _a.sassOptions;
	return __awaiter(void 0, void 0, void 0, function () {
		var sassProcessor, watchListNeeded, compiled, css, mapObject, sources, map, result, _b, _c;
		return __generator(this, function (_d) {
			switch (_d.label) {
				case 0:
					if (!sassPath) {
						return [2 /*return*/, { css: "", map: "" }];
					}
					return [4 /*yield*/, ensureCompiler(sass)];
				case 1:
					sassProcessor = _d.sent();
					watchListNeeded = Array.isArray(outWatchList);
					return [4 /*yield*/, sassProcessor.compileAsync(sassPath, __assign({ loadPaths: loadPaths, style: "expanded", sourceMap: !!sourceMap || watchListNeeded, sourceMapIncludeSources: !!sourceMap || watchListNeeded }, (sassOptions || [])))];
				case 2:
					compiled = _d.sent();
					css = compiled.css.toString();
					if (watchListNeeded && compiled.sourceMap && typeof compiled.sourceMap === "object") {
						mapObject = "toJSON" in compiled.sourceMap && typeof compiled.sourceMap.toJSON === "function"
							? compiled.sourceMap.toJSON()
							: compiled.sourceMap;
						sources = mapObject.sources || mapObject._sources;
						outWatchList.push.apply(outWatchList, sources.filter(function (s) { return s && typeof s === "string"; }));
					}
					map = compiled.sourceMap
						? typeof compiled.sourceMap === "object"
							? JSON.stringify(compiled.sourceMap)
							: compiled.sourceMap
						: "";
					if (!(typeof postProcessor === "function")) return [3 /*break*/, 7];
					return [4 /*yield*/, postProcessor(css, map)];
				case 3:
					result = _d.sent();
					if ((typeof result !== "string" && typeof result !== "object") || result === null) {
						throw new Error("`postProcessor` must return string, object with `css` and `map` or PostCSS like object which implements `process` function");
					}
					_b = formatProcessedToCSS;
					if (!isPostCssCompatible(result) // If PostCSS compatible result
					) return [3 /*break*/, 5]; // If PostCSS compatible result
					return [4 /*yield*/, Promise.resolve(result.process(css, {
						from: sassPath,
						to: path.parse(sassPath).name + outputExt,
						map: map ? { prev: map, inline: false } : null,
					}))];
				case 4:
					_c = _d.sent();
					return [3 /*break*/, 6];
				case 5:
					_c = result;
					_d.label = 6;
				case 6: return [2 /*return*/, _b.apply(void 0, [_c, sourceMap])];
				case 7: return [2 /*return*/, { css: css, map: sourceMap ? map : undefined }];
			}
		});
	});
};

var PLUGIN_NAME = "keep-css-imports";
var FILE_URL_PREFIX = new URL("file://").toString();
var KEY_EXT_STRING = ".[keep-css-imports-plugin-ext]";

var createErrorMessage = function (message) { return "[".concat(PLUGIN_NAME, "] ").concat(message); };
var ImportUpdater = /** @class */ (function () {
	function ImportUpdater(pluginContext, outputOptions) {
		var _this = this;
		this.addImportAndGetNewId = function (resolvedId) {
			var moduleIndex = _this._pluginContext.allStyleImports.indexOf(resolvedId);
			return !~moduleIndex ? _this._pluginContext.allStyleImports.push(resolvedId) - 1 : moduleIndex;
		};
		this._pluginContext = pluginContext;
		this._outputOptions = outputOptions;
	}
	ImportUpdater.prototype.getMagicId = function (id) {
		return "\0" + this.addImportAndGetNewId(id) + KEY_EXT_STRING;
	};
	ImportUpdater.prototype.updateImports = function (code, chunk, bundleOutDir, moduleRoot) {
		var _this = this;
		var magicString = new MagicString(code);
		var matchRegex = new RegExp("\0([^\"']+)".concat(escapeRegex(KEY_EXT_STRING)), "g");
		Array.from(code.matchAll(matchRegex))
			.reverse()
			.forEach(function (m) {
				return _this.updateMatchedImport(m, magicString, {
					chunk: chunk,
					bundleOutDir: bundleOutDir,
					moduleRoot: moduleRoot,
				});
			});
		return {
			code: magicString.toString(),
			map: magicString.generateMap({ hires: true }),
		};
	};
	ImportUpdater.prototype.updateMatchedImport = function (m, magicString, chunkDetails) {
		var importId = m[0];
		var assetId = this._pluginContext.allStyleImports[m[1]];
		if (!assetId || typeof assetId !== "string" || !this._pluginContext.stylesToEmit[assetId]) {
			return;
		}
		var updatedImport = this.saveAndGetUpdatedImportPath(assetId, chunkDetails);
		var start = m.index;
		var end = start + importId.length;
		magicString.overwrite(start, end, updatedImport);
		this.updateChunk(importId, updatedImport, chunkDetails.chunk);
	};
	ImportUpdater.prototype.updateChunk = function (importId, updatedImport, chunk) {
		if (chunk.importedBindings[importId]) {
			chunk.importedBindings[updatedImport] = chunk.importedBindings[importId];
			if (updatedImport !== importId) {
				delete chunk.importedBindings[importId];
			}
		}
		var importIndex = chunk.imports.indexOf(importId);
		if (~importIndex) {
			chunk.imports[importIndex] = updatedImport;
		}
	};
	ImportUpdater.prototype.saveAndGetUpdatedImportPath = function (assetId, _a) {
		var bundleOutDir = _a.bundleOutDir, moduleRoot = _a.moduleRoot, chunk = _a.chunk;
		var assetOutput = this.resolveOutputPath(bundleOutDir, assetId, moduleRoot);
		var updatedImport = path
			.relative(path.dirname(path.resolve(bundleOutDir, chunk.fileName)), assetOutput)
			.replace(/\\/g, "/");
		this._pluginContext.stylesToEmit[assetId].output = path.relative(path.resolve(bundleOutDir), assetOutput);
		if (this.shouldAddPrefixCurrentDir(updatedImport) &&
			!updatedImport.startsWith("./") &&
			!updatedImport.startsWith("../") &&
			!updatedImport.match(/^[a-zA-Z]:/)) {
			updatedImport = "./" + updatedImport;
		}
		return updatedImport;
	};
	ImportUpdater.prototype.shouldAddPrefixCurrentDir = function (updatedImport) {
		var skip = this._outputOptions.skipCurrentFolderPart;
		return !skip || (skip instanceof RegExp && !skip.test(updatedImport));
	};
	ImportUpdater.prototype.resolveOutputPath = function (bundleOutDir, assetId, moduleRoot) {
		var _a = this._outputOptions, outputPath = _a.outputPath, outputDir = _a.outputDir, outputExt = _a.outputExt;
		var newPath = undefined;
		if (typeof outputPath === "function") {
			newPath = outputPath(assetId);
			assertLocation(bundleOutDir, newPath);
		}
		else if (typeof outputPath === "string") {
			newPath = path.resolve(bundleOutDir, outputDir, outputPath !== "keep" ? outputPath : path.relative(moduleRoot, assetId));
			assertLocation(bundleOutDir, newPath);
		}
		else {
			throw new Error(createErrorMessage("Invalid outputPath option value!"));
		}
		return newPath.replace(/\.s[ca]ss$/, outputExt);
	};
	return ImportUpdater;
}());

var ensureStylesInfo = function (stylesMap, importer, resolvedId) {
	stylesMap[resolvedId] = stylesMap[resolvedId] || { importers: [], watchList: [] };
	stylesMap[resolvedId].importers.push(importer);
	return stylesMap[resolvedId];
};
var ensureCodeAndWatchList = function (filePath, stylesInfo, isWatch, compilerOptions) {
	return __awaiter(void 0, void 0, void 0, function () {
		var outWatchList, _a, _b, css, map;
		return __generator(this, function (_c) {
			switch (_c.label) {
				case 0:
					outWatchList = [];
					if (!filePath.endsWith(".css")) return [3 /*break*/, 2];
					_a = stylesInfo;
					return [4 /*yield*/, readFile(filePath, "utf8")];
				case 1:
					_a.css = _c.sent();
					return [3 /*break*/, 4];
				case 2: return [4 /*yield*/, compileSass(filePath, isWatch ? outWatchList : undefined, compilerOptions)];
				case 3:
					_b = _c.sent(), css = _b.css, map = _b.map;
					stylesInfo.css = css;
					stylesInfo.map = map;
					_c.label = 4;
				case 4:
					outWatchList.push(filePath);
					stylesInfo.watchList = outWatchList.map(function (watchFile) { return path.resolve(watchFile.replace(FILE_URL_PREFIX, "")); });
					return [2 /*return*/];
			}
		});
	});
};
function keepCssImports(_a) {
	if (_a === void 0) { _a = {}; }
	var _b = _a.outputExt, outputExt = _b === void 0 ? ".css" : _b, _c = _a.outputPath, outputPath = _c === void 0 ? "keep" : _c, _d = _a.skipCurrentFolderPart, skipCurrentFolderPart = _d === void 0 ? false : _d, _e = _a.includeRegexp, includeRegexp = _e === void 0 ? /\.(?:s[ca]|c)ss$/ : _e, sass = _a.sass, postProcessor = _a.postProcessor, sassOptions = _a.sassOptions, options = __rest(_a, ["outputExt", "outputPath", "skipCurrentFolderPart", "includeRegexp", "sass", "postProcessor", "sassOptions"]);
	var stylesOutputOptions = {
		outputPath: outputPath,
		outputExt: outputExt,
		outputDir: options.outputDir ? path.resolve(options.outputDir) : "./",
		skipCurrentFolderPart: skipCurrentFolderPart,
	};
	var context = {
		allStyleImports: [],
		modulesWithCss: new Set(),
		stylesToEmit: {},
	};
	var importUpdater = new ImportUpdater(context, stylesOutputOptions);
	var loadPaths = options.includePaths || ["node_modules/"];
	loadPaths.push(process.cwd());
	loadPaths = loadPaths.filter(function (v, i, a) { return a.indexOf(v) === i; });
	var compilerOptions = {
		outputExt: outputExt,
		sass: sass,
		postProcessor: typeof postProcessor === "function"
			? function (css, map) { return postProcessor(css, map, context.stylesToEmit); }
			: undefined,
		loadPaths: loadPaths,
		sourceMap: !!options.sourceMap,
		sassOptions: sassOptions,
	};
	return {
		name: PLUGIN_NAME,
		resolveId: function (source, importer, resolveOptions) {
			return __awaiter(this, void 0, void 0, function () {
				var _a, custom, _b, _c, _d, _e, _f, alreadyResolving, resolved, styleInfo;
				var _g, _h;
				var _this = this;
				return __generator(this, function (_j) {
					switch (_j.label) {
						case 0:
							if (!importer || !includeRegexp.test(source) || /\0/.test(source)) {
								return [2 /*return*/, null];
							}
							_a = resolveOptions.custom, custom = _a === void 0 ? {} : _a;
							_b = custom, _c = PLUGIN_NAME, _d = _b[_c], _e = _d === void 0 ? {} : _d, _f = _e.resolving, alreadyResolving = _f === void 0 ? false : _f;
							if (alreadyResolving) {
								return [2 /*return*/, null];
							}
							return [4 /*yield*/, this.resolve(source, importer, __assign(__assign({ skipSelf: true }, resolveOptions), { custom: __assign(__assign({}, custom), (_g = {}, _g[PLUGIN_NAME] = __assign(__assign({}, custom[PLUGIN_NAME]), { resolving: true }), _g)) }))];
						case 1:
							resolved = _j.sent();
							if (!resolved || resolved.external) {
								return [2 /*return*/, resolved];
							}
							context.modulesWithCss.add(importer);
							styleInfo = ensureStylesInfo(context.stylesToEmit, importer, resolved.id);
							return [4 /*yield*/, ensureCodeAndWatchList(resolved.id, styleInfo, this.meta.watchMode, compilerOptions)];
						case 2:
							_j.sent();
							styleInfo.watchList.forEach(function (watchFile) {
								_this.addWatchFile(watchFile);
							});
							return [2 /*return*/, {
								id: importUpdater.getMagicId(resolved.id),
								meta: (_h = {}, _h[PLUGIN_NAME] = { sourceId: resolved.id }, _h),
								external: true,
							}];
					}
				});
			});
		},
		buildStart: function () {
			var _this = this;
			// Every rebuild will refresh watcher, so we need to reattach
			if (this.meta.watchMode) {
				var allWatched_1 = this.getWatchFiles();
				Object.values(context.stylesToEmit).forEach(function (styleInfo) {
					return styleInfo.watchList.forEach(function (watchFile) {
						if (!allWatched_1.find(function (watched) { return path.normalize(watched) === path.normalize(watchFile); })) {
							_this.addWatchFile(watchFile);
						}
					});
				});
			}
		},
		watchChange: function (id) {
			return __awaiter(this, void 0, void 0, function () {
				var resolvedId, filesToUpdate;
				var _this = this;
				return __generator(this, function (_a) {
					switch (_a.label) {
						case 0:
							resolvedId = path.resolve(id);
							filesToUpdate = Object.entries(context.stylesToEmit).filter(function (_a) {
								var styleInfo = _a[1];
								return styleInfo.watchList.includes(resolvedId);
							});
							return [4 /*yield*/, Promise.all(filesToUpdate.map(function (_a) {
								var fileName = _a[0], styleInfo = _a[1];
								return ensureCodeAndWatchList(fileName, styleInfo, _this.meta.watchMode, compilerOptions);
							}))];
						case 1:
							_a.sent();
							return [2 /*return*/];
					}
				});
			});
		},
		renderChunk: function (code, chunk, outputOptions) {
			var bundleOutDir = path.resolve(outputOptions.dir || path.dirname(outputOptions.file));
			if (code && chunk.modules && Object.keys(chunk.modules).some(function (m) { return context.modulesWithCss.has(m); })) {
				var moduleRoot = outputOptions.preserveModulesRoot || process.cwd();
				return importUpdater.updateImports(code, chunk, bundleOutDir, moduleRoot);
			}
			return null;
		},
		generateBundle: function (_, __, isWrite) {
			if (!isWrite) {
				return;
			}
			assertDuplicates(context.stylesToEmit);
			for (var file in context.stylesToEmit) {
				var stylesInfo = context.stylesToEmit[file];
				var fileName = stylesInfo.output;
				var source = file.endsWith(".css")
					? stylesInfo.css
					: ensureSourceMap(stylesInfo, options.sourceMap || (sassOptions === null || sassOptions === void 0 ? void 0 : sassOptions.sourceMap), fileName, this.emitFile);
				this.emitFile({
					type: "asset",
					fileName: fileName,
					source: source,
				});
			}
		},
	};
}

export { keepCssImports as default };
