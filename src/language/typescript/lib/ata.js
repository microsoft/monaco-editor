var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/apis.ts
var getNPMVersionsForModule = (config, moduleName) => {
  const url = `https://data.jsdelivr.com/v1/package/npm/${moduleName}`;
  return api(config, url, { cache: "no-store" });
};
var getNPMVersionForModuleReference = (config, moduleName, reference) => {
  const url = `https://data.jsdelivr.com/v1/package/resolve/npm/${moduleName}@${reference}`;
  return api(config, url);
};
var getFiletreeForModuleWithVersion = (config, moduleName, version) => __async(void 0, null, function* () {
  const url = `https://data.jsdelivr.com/v1/package/npm/${moduleName}@${version}/flat`;
  const res = yield api(config, url);
  if (res instanceof Error) {
    return res;
  } else {
    return __spreadProps(__spreadValues({}, res), {
      moduleName,
      version
    });
  }
});
var getDTSFileForModuleWithVersion = (config, moduleName, version, file) => __async(void 0, null, function* () {
  const url = `https://cdn.jsdelivr.net/npm/${moduleName}@${version}${file}`;
  const f = config.fetcher || fetch;
  const res = yield f(url);
  if (res.ok) {
    return res.text();
  } else {
    return new Error("OK");
  }
});
function api(config, url, init) {
  const f = config.fetcher || fetch;
  return f(url, init).then((res) => {
    if (res.ok) {
      return res.json().then((f2) => f2);
    } else {
      return new Error("OK");
    }
  });
}

// src/edgeCases.ts
var mapModuleNameToModule = (name) => {
  const builtInNodeMods = [
    "assert",
    "assert/strict",
    "async_hooks",
    "buffer",
    "child_process",
    "cluster",
    "console",
    "constants",
    "crypto",
    "dgram",
    "diagnostics_channel",
    "dns",
    "dns/promises",
    "domain",
    "events",
    "fs",
    "fs/promises",
    "http",
    "http2",
    "https",
    "inspector",
    "module",
    "net",
    "os",
    "path",
    "path/posix",
    "path/win32",
    "perf_hooks",
    "process",
    "punycode",
    "querystring",
    "readline",
    "repl",
    "stream",
    "stream/promises",
    "stream/consumers",
    "stream/web",
    "string_decoder",
    "sys",
    "timers",
    "timers/promises",
    "tls",
    "trace_events",
    "tty",
    "url",
    "util",
    "util/types",
    "v8",
    "vm",
    "wasi",
    "worker_threads",
    "zlib"
  ];
  if (builtInNodeMods.includes(name.replace("node:", ""))) {
    return "node";
  }
  return name;
};

// src/index.ts
var setupTypeAcquisition = (config) => {
  const moduleMap = new Map();
  const fsMap = new Map();
  let estimatedToDownload = 0;
  let estimatedDownloaded = 0;
  return (initialSourceFile) => {
    estimatedToDownload = 0;
    estimatedDownloaded = 0;
    resolveDeps(initialSourceFile, 0).then((t) => {
      var _a, _b;
      if (estimatedDownloaded > 0) {
        (_b = (_a = config.delegate).finished) == null ? void 0 : _b.call(_a, fsMap);
      }
    });
  };
  function resolveDeps(initialSourceFile, depth) {
    return __async(this, null, function* () {
      var _a, _b, _c, _d, _e;
      const depsToGet = getNewDependencies(config, moduleMap, initialSourceFile);
      depsToGet.forEach((dep) => moduleMap.set(dep.module, { state: "loading" }));
      const trees = yield Promise.all(depsToGet.map((f) => getFileTreeForModuleWithTag(config, f.module, f.version)));
      const treesOnly = trees.filter((t) => !("error" in t));
      const hasDTS = treesOnly.filter((t) => t.files.find((f) => f.name.endsWith(".d.ts")));
      const dtsFilesFromNPM = hasDTS.map((t) => treeToDTSFiles(t, `/node_modules/${t.moduleName}`));
      const mightBeOnDT = treesOnly.filter((t) => !hasDTS.includes(t));
      const dtTrees = yield Promise.all(mightBeOnDT.map((f) => getFileTreeForModuleWithTag(config, `@types/${getDTName(f.moduleName)}`, "latest")));
      const dtTreesOnly = dtTrees.filter((t) => !("error" in t));
      const dtsFilesFromDT = dtTreesOnly.map((t) => treeToDTSFiles(t, `/node_modules/@types/${getDTName(t.moduleName).replace("types__", "")}`));
      const allDTSFiles = dtsFilesFromNPM.concat(dtsFilesFromDT).reduce((p, c) => p.concat(c), []);
      estimatedToDownload += allDTSFiles.length;
      if (allDTSFiles.length && depth === 0) {
        (_b = (_a = config.delegate).started) == null ? void 0 : _b.call(_a);
      }
      for (const tree of treesOnly) {
        let prefix = `/node_modules/${tree.moduleName}`;
        if (dtTreesOnly.includes(tree))
          prefix = `/node_modules/@types/${getDTName(tree.moduleName).replace("types__", "")}`;
        const path = prefix + "/package.json";
        const pkgJSON = yield getDTSFileForModuleWithVersion(config, tree.moduleName, tree.version, "/package.json");
        if (typeof pkgJSON == "string") {
          fsMap.set(path, pkgJSON);
          (_d = (_c = config.delegate).receivedFile) == null ? void 0 : _d.call(_c, pkgJSON, path);
        } else {
          (_e = config.logger) == null ? void 0 : _e.error(`Could not download package.json for ${tree.moduleName}`);
        }
      }
      yield Promise.all(allDTSFiles.map((dts) => __async(this, null, function* () {
        var _a2, _b2, _c2;
        const dtsCode = yield getDTSFileForModuleWithVersion(config, dts.moduleName, dts.moduleVersion, dts.path);
        estimatedDownloaded++;
        if (dtsCode instanceof Error) {
          (_a2 = config.logger) == null ? void 0 : _a2.error(`Had an issue getting ${dts.path} for ${dts.moduleName}`);
        } else {
          fsMap.set(dts.vfsPath, dtsCode);
          (_c2 = (_b2 = config.delegate).receivedFile) == null ? void 0 : _c2.call(_b2, dtsCode, dts.vfsPath);
          if (config.delegate.progress && estimatedDownloaded % 5 === 0) {
            config.delegate.progress(estimatedDownloaded, estimatedToDownload);
          }
          yield resolveDeps(dtsCode, depth + 1);
        }
      })));
    });
  }
};
function treeToDTSFiles(tree, vfsPrefix) {
  const dtsRefs = [];
  for (const file of tree.files) {
    if (file.name.endsWith(".d.ts")) {
      dtsRefs.push({
        moduleName: tree.moduleName,
        moduleVersion: tree.version,
        vfsPath: `${vfsPrefix}${file.name}`,
        path: file.name
      });
    }
  }
  return dtsRefs;
}
var getReferencesForModule = (ts, code) => {
  const meta = ts.preProcessFile(code);
  const libMap = ts.libMap || new Map();
  const references = meta.referencedFiles.concat(meta.importedFiles).concat(meta.libReferenceDirectives).filter((f) => !f.fileName.endsWith(".d.ts")).filter((d) => !libMap.has(d.fileName));
  return references.map((r) => {
    let version = void 0;
    if (!r.fileName.startsWith(".")) {
      version = "latest";
      const line = code.slice(r.end).split("\n")[0];
      if (line.includes("// types:"))
        version = line.split("// types: ")[1].trim();
    }
    return {
      module: r.fileName,
      version
    };
  });
};
function getNewDependencies(config, moduleMap, code) {
  const refs = getReferencesForModule(config.typescript, code).map((ref) => __spreadProps(__spreadValues({}, ref), {
    module: mapModuleNameToModule(ref.module)
  }));
  const modules = refs.filter((f) => !f.module.startsWith(".")).filter((m) => !moduleMap.has(m.module));
  return modules;
}
var getFileTreeForModuleWithTag = (config, moduleName, tag) => __async(void 0, null, function* () {
  let toDownload = tag || "latest";
  if (toDownload.split(".").length < 2) {
    const response = yield getNPMVersionForModuleReference(config, moduleName, toDownload);
    if (response instanceof Error) {
      return {
        error: response,
        userFacingMessage: `Could not go from a tag to version on npm for ${moduleName} - possible typo?`
      };
    }
    const neededVersion = response.version;
    if (!neededVersion) {
      const versions = yield getNPMVersionsForModule(config, moduleName);
      if (versions instanceof Error) {
        return {
          error: response,
          userFacingMessage: `Could not get versions on npm for ${moduleName} - possible typo?`
        };
      }
      const tags = Object.entries(versions.tags).join(", ");
      return {
        error: new Error("Could not find tag for module"),
        userFacingMessage: `Could not find a tag for ${moduleName} called ${tag}. Did find ${tags}`
      };
    }
    toDownload = neededVersion;
  }
  const res = yield getFiletreeForModuleWithVersion(config, moduleName, toDownload);
  if (res instanceof Error) {
    return {
      error: res,
      userFacingMessage: `Could not get the files for ${moduleName}@${toDownload}. Is it possibly a typo?`
    };
  }
  return res;
});
function getDTName(s) {
  if (s.indexOf("@") === 0 && s.indexOf("/") !== -1) {
    s = s.substr(1).replace("/", "__");
  }
  return s;
}
export {
  getFileTreeForModuleWithTag,
  getNewDependencies,
  getReferencesForModule,
  setupTypeAcquisition
};
