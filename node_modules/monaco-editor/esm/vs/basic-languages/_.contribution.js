/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.37.1(20a8d5a651d057aaed7875ad1c1f2ecf13c4e773)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));

// src/fillers/monaco-editor-core.ts
var monaco_editor_core_exports = {};
__reExport(monaco_editor_core_exports, monaco_editor_core_star);
import * as monaco_editor_core_star from "../editor/editor.api.js";

// src/basic-languages/_.contribution.ts
var languageDefinitions = {};
var lazyLanguageLoaders = {};
var LazyLanguageLoader = class {
  static getOrCreate(languageId) {
    if (!lazyLanguageLoaders[languageId]) {
      lazyLanguageLoaders[languageId] = new LazyLanguageLoader(languageId);
    }
    return lazyLanguageLoaders[languageId];
  }
  _languageId;
  _loadingTriggered;
  _lazyLoadPromise;
  _lazyLoadPromiseResolve;
  _lazyLoadPromiseReject;
  constructor(languageId) {
    this._languageId = languageId;
    this._loadingTriggered = false;
    this._lazyLoadPromise = new Promise((resolve, reject) => {
      this._lazyLoadPromiseResolve = resolve;
      this._lazyLoadPromiseReject = reject;
    });
  }
  load() {
    if (!this._loadingTriggered) {
      this._loadingTriggered = true;
      languageDefinitions[this._languageId].loader().then((mod) => this._lazyLoadPromiseResolve(mod), (err) => this._lazyLoadPromiseReject(err));
    }
    return this._lazyLoadPromise;
  }
};
async function loadLanguage(languageId) {
  await LazyLanguageLoader.getOrCreate(languageId).load();
  const model = monaco_editor_core_exports.editor.createModel("", languageId);
  model.dispose();
}
function registerLanguage(def) {
  const languageId = def.id;
  languageDefinitions[languageId] = def;
  monaco_editor_core_exports.languages.register(def);
  const lazyLanguageLoader = LazyLanguageLoader.getOrCreate(languageId);
  monaco_editor_core_exports.languages.registerTokensProviderFactory(languageId, {
    create: async () => {
      const mod = await lazyLanguageLoader.load();
      return mod.language;
    }
  });
  monaco_editor_core_exports.languages.onLanguageEncountered(languageId, async () => {
    const mod = await lazyLanguageLoader.load();
    monaco_editor_core_exports.languages.setLanguageConfiguration(languageId, mod.conf);
  });
}
export {
  loadLanguage,
  registerLanguage
};
