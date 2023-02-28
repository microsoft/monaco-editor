"use strict";
/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.36.1(6c56744c3419458f0dd48864520b759d1a3a1ca8)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
define("vs/basic-languages/bicep/bicep", ["require"],(require)=>{
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

  // src/basic-languages/bicep/bicep.ts
  var bicep_exports = {};
  __export(bicep_exports, {
    conf: () => conf,
    language: () => language
  });
  var bounded = (text) => `\\b${text}\\b`;
  var identifierStart = "[_a-zA-Z]";
  var identifierContinue = "[_a-zA-Z0-9]";
  var identifier = bounded(`${identifierStart}${identifierContinue}*`);
  var keywords = [
    "targetScope",
    "resource",
    "module",
    "param",
    "var",
    "output",
    "for",
    "in",
    "if",
    "existing"
  ];
  var namedLiterals = ["true", "false", "null"];
  var nonCommentWs = `[ \\t\\r\\n]`;
  var numericLiteral = `[0-9]+`;
  var conf = {
    comments: {
      lineComment: "//",
      blockComment: ["/*", "*/"]
    },
    brackets: [
      ["{", "}"],
      ["[", "]"],
      ["(", ")"]
    ],
    surroundingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: "'", close: "'" },
      { open: "'''", close: "'''" }
    ],
    autoClosingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: "'", close: "'", notIn: ["string", "comment"] },
      { open: "'''", close: "'''", notIn: ["string", "comment"] }
    ],
    autoCloseBefore: ":.,=}])' \n	",
    indentationRules: {
      increaseIndentPattern: new RegExp("^((?!\\/\\/).)*(\\{[^}\"'`]*|\\([^)\"'`]*|\\[[^\\]\"'`]*)$"),
      decreaseIndentPattern: new RegExp("^((?!.*?\\/\\*).*\\*/)?\\s*[\\}\\]].*$")
    }
  };
  var language = {
    defaultToken: "",
    tokenPostfix: ".bicep",
    brackets: [
      { open: "{", close: "}", token: "delimiter.curly" },
      { open: "[", close: "]", token: "delimiter.square" },
      { open: "(", close: ")", token: "delimiter.parenthesis" }
    ],
    symbols: /[=><!~?:&|+\-*/^%]+/,
    keywords,
    namedLiterals,
    escapes: `\\\\(u{[0-9A-Fa-f]+}|n|r|t|\\\\|'|\\\${)`,
    tokenizer: {
      root: [{ include: "@expression" }, { include: "@whitespace" }],
      stringVerbatim: [
        { regex: `(|'|'')[^']`, action: { token: "string" } },
        { regex: `'''`, action: { token: "string.quote", next: "@pop" } }
      ],
      stringLiteral: [
        { regex: `\\\${`, action: { token: "delimiter.bracket", next: "@bracketCounting" } },
        { regex: `[^\\\\'$]+`, action: { token: "string" } },
        { regex: "@escapes", action: { token: "string.escape" } },
        { regex: `\\\\.`, action: { token: "string.escape.invalid" } },
        { regex: `'`, action: { token: "string", next: "@pop" } }
      ],
      bracketCounting: [
        { regex: `{`, action: { token: "delimiter.bracket", next: "@bracketCounting" } },
        { regex: `}`, action: { token: "delimiter.bracket", next: "@pop" } },
        { include: "expression" }
      ],
      comment: [
        { regex: `[^\\*]+`, action: { token: "comment" } },
        { regex: `\\*\\/`, action: { token: "comment", next: "@pop" } },
        { regex: `[\\/*]`, action: { token: "comment" } }
      ],
      whitespace: [
        { regex: nonCommentWs },
        { regex: `\\/\\*`, action: { token: "comment", next: "@comment" } },
        { regex: `\\/\\/.*$`, action: { token: "comment" } }
      ],
      expression: [
        { regex: `'''`, action: { token: "string.quote", next: "@stringVerbatim" } },
        { regex: `'`, action: { token: "string.quote", next: "@stringLiteral" } },
        { regex: numericLiteral, action: { token: "number" } },
        {
          regex: identifier,
          action: {
            cases: {
              "@keywords": { token: "keyword" },
              "@namedLiterals": { token: "keyword" },
              "@default": { token: "identifier" }
            }
          }
        }
      ]
    }
  };
  return __toCommonJS(bicep_exports);
})();
return moduleExports;
});
