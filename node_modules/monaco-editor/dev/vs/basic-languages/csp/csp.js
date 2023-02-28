"use strict";
/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.36.1(6c56744c3419458f0dd48864520b759d1a3a1ca8)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
define("vs/basic-languages/csp/csp", ["require"],(require)=>{
var moduleExports = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/basic-languages/csp/csp.ts
  var csp_exports = {};
  __export(csp_exports, {
    conf: () => conf,
    language: () => language
  });
  var conf = {
    brackets: [],
    autoClosingPairs: [],
    surroundingPairs: []
  };
  var language = {
    keywords: [],
    typeKeywords: [],
    tokenPostfix: ".csp",
    operators: [],
    symbols: /[=><!~?:&|+\-*\/\^%]+/,
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    tokenizer: {
      root: [
        [/child-src/, "string.quote"],
        [/connect-src/, "string.quote"],
        [/default-src/, "string.quote"],
        [/font-src/, "string.quote"],
        [/frame-src/, "string.quote"],
        [/img-src/, "string.quote"],
        [/manifest-src/, "string.quote"],
        [/media-src/, "string.quote"],
        [/object-src/, "string.quote"],
        [/script-src/, "string.quote"],
        [/style-src/, "string.quote"],
        [/worker-src/, "string.quote"],
        [/base-uri/, "string.quote"],
        [/plugin-types/, "string.quote"],
        [/sandbox/, "string.quote"],
        [/disown-opener/, "string.quote"],
        [/form-action/, "string.quote"],
        [/frame-ancestors/, "string.quote"],
        [/report-uri/, "string.quote"],
        [/report-to/, "string.quote"],
        [/upgrade-insecure-requests/, "string.quote"],
        [/block-all-mixed-content/, "string.quote"],
        [/require-sri-for/, "string.quote"],
        [/reflected-xss/, "string.quote"],
        [/referrer/, "string.quote"],
        [/policy-uri/, "string.quote"],
        [/'self'/, "string.quote"],
        [/'unsafe-inline'/, "string.quote"],
        [/'unsafe-eval'/, "string.quote"],
        [/'strict-dynamic'/, "string.quote"],
        [/'unsafe-hashed-attributes'/, "string.quote"]
      ]
    }
  };
  return __toCommonJS(csp_exports);
})();
return moduleExports;
});
