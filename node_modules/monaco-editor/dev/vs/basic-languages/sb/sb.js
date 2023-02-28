"use strict";
/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.36.1(6c56744c3419458f0dd48864520b759d1a3a1ca8)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
define("vs/basic-languages/sb/sb", ["require"],(require)=>{
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

  // src/basic-languages/sb/sb.ts
  var sb_exports = {};
  __export(sb_exports, {
    conf: () => conf,
    language: () => language
  });
  var conf = {
    comments: {
      lineComment: "'"
    },
    brackets: [
      ["(", ")"],
      ["[", "]"],
      ["If", "EndIf"],
      ["While", "EndWhile"],
      ["For", "EndFor"],
      ["Sub", "EndSub"]
    ],
    autoClosingPairs: [
      { open: '"', close: '"', notIn: ["string", "comment"] },
      { open: "(", close: ")", notIn: ["string", "comment"] },
      { open: "[", close: "]", notIn: ["string", "comment"] }
    ]
  };
  var language = {
    defaultToken: "",
    tokenPostfix: ".sb",
    ignoreCase: true,
    brackets: [
      { token: "delimiter.array", open: "[", close: "]" },
      { token: "delimiter.parenthesis", open: "(", close: ")" },
      { token: "keyword.tag-if", open: "If", close: "EndIf" },
      { token: "keyword.tag-while", open: "While", close: "EndWhile" },
      { token: "keyword.tag-for", open: "For", close: "EndFor" },
      { token: "keyword.tag-sub", open: "Sub", close: "EndSub" }
    ],
    keywords: [
      "Else",
      "ElseIf",
      "EndFor",
      "EndIf",
      "EndSub",
      "EndWhile",
      "For",
      "Goto",
      "If",
      "Step",
      "Sub",
      "Then",
      "To",
      "While"
    ],
    tagwords: ["If", "Sub", "While", "For"],
    operators: [">", "<", "<>", "<=", ">=", "And", "Or", "+", "-", "*", "/", "="],
    identifier: /[a-zA-Z_][\w]*/,
    symbols: /[=><:+\-*\/%\.,]+/,
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    tokenizer: {
      root: [
        { include: "@whitespace" },
        [/(@identifier)(?=[.])/, "type"],
        [
          /@identifier/,
          {
            cases: {
              "@keywords": { token: "keyword.$0" },
              "@operators": "operator",
              "@default": "variable.name"
            }
          }
        ],
        [
          /([.])(@identifier)/,
          {
            cases: {
              $2: ["delimiter", "type.member"],
              "@default": ""
            }
          }
        ],
        [/\d*\.\d+/, "number.float"],
        [/\d+/, "number"],
        [/[()\[\]]/, "@brackets"],
        [
          /@symbols/,
          {
            cases: {
              "@operators": "operator",
              "@default": "delimiter"
            }
          }
        ],
        [/"([^"\\]|\\.)*$/, "string.invalid"],
        [/"/, "string", "@string"]
      ],
      whitespace: [
        [/[ \t\r\n]+/, ""],
        [/(\').*$/, "comment"]
      ],
      string: [
        [/[^\\"]+/, "string"],
        [/@escapes/, "string.escape"],
        [/\\./, "string.escape.invalid"],
        [/"C?/, "string", "@pop"]
      ]
    }
  };
  return __toCommonJS(sb_exports);
})();
return moduleExports;
});
