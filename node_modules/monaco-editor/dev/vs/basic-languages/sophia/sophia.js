"use strict";
/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.37.1(20a8d5a651d057aaed7875ad1c1f2ecf13c4e773)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
define("vs/basic-languages/sophia/sophia", ["require"],(require)=>{
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

  // src/basic-languages/sophia/sophia.ts
  var sophia_exports = {};
  __export(sophia_exports, {
    conf: () => conf,
    language: () => language
  });
  var conf = {
    comments: {
      lineComment: "//",
      blockComment: ["/*", "*/"]
    },
    brackets: [
      ["{", "}"],
      ["[", "]"],
      ["(", ")"],
      ["<", ">"]
    ],
    autoClosingPairs: [
      { open: '"', close: '"', notIn: ["string", "comment"] },
      { open: "{", close: "}", notIn: ["string", "comment"] },
      { open: "[", close: "]", notIn: ["string", "comment"] },
      { open: "(", close: ")", notIn: ["string", "comment"] }
    ]
  };
  var language = {
    defaultToken: "",
    tokenPostfix: ".aes",
    brackets: [
      { token: "delimiter.curly", open: "{", close: "}" },
      { token: "delimiter.parenthesis", open: "(", close: ")" },
      { token: "delimiter.square", open: "[", close: "]" },
      { token: "delimiter.angle", open: "<", close: ">" }
    ],
    keywords: [
      "contract",
      "library",
      "entrypoint",
      "function",
      "stateful",
      "state",
      "hash",
      "signature",
      "tuple",
      "list",
      "address",
      "string",
      "bool",
      "int",
      "record",
      "datatype",
      "type",
      "option",
      "oracle",
      "oracle_query",
      "Call",
      "Bits",
      "Bytes",
      "Oracle",
      "String",
      "Crypto",
      "Address",
      "Auth",
      "Chain",
      "None",
      "Some",
      "bits",
      "bytes",
      "event",
      "let",
      "map",
      "private",
      "public",
      "true",
      "false",
      "var",
      "if",
      "else",
      "throw"
    ],
    operators: [
      "=",
      ">",
      "<",
      "!",
      "~",
      "?",
      "::",
      ":",
      "==",
      "<=",
      ">=",
      "!=",
      "&&",
      "||",
      "++",
      "--",
      "+",
      "-",
      "*",
      "/",
      "&",
      "|",
      "^",
      "%",
      "<<",
      ">>",
      ">>>",
      "+=",
      "-=",
      "*=",
      "/=",
      "&=",
      "|=",
      "^=",
      "%=",
      "<<=",
      ">>=",
      ">>>="
    ],
    symbols: /[=><!~?:&|+\-*\/\^%]+/,
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    integersuffix: /(ll|LL|u|U|l|L)?(ll|LL|u|U|l|L)?/,
    floatsuffix: /[fFlL]?/,
    tokenizer: {
      root: [
        [
          /[a-zA-Z_]\w*/,
          {
            cases: {
              "@keywords": { token: "keyword.$0" },
              "@default": "identifier"
            }
          }
        ],
        { include: "@whitespace" },
        [/\[\[.*\]\]/, "annotation"],
        [/^\s*#\w+/, "keyword"],
        [/int\d*/, "keyword"],
        [/[{}()\[\]]/, "@brackets"],
        [/[<>](?!@symbols)/, "@brackets"],
        [
          /@symbols/,
          {
            cases: {
              "@operators": "delimiter",
              "@default": ""
            }
          }
        ],
        [/\d*\d+[eE]([\-+]?\d+)?(@floatsuffix)/, "number.float"],
        [/\d*\.\d+([eE][\-+]?\d+)?(@floatsuffix)/, "number.float"],
        [/0[xX][0-9a-fA-F']*[0-9a-fA-F](@integersuffix)/, "number.hex"],
        [/0[0-7']*[0-7](@integersuffix)/, "number.octal"],
        [/0[bB][0-1']*[0-1](@integersuffix)/, "number.binary"],
        [/\d[\d']*\d(@integersuffix)/, "number"],
        [/\d(@integersuffix)/, "number"],
        [/[;,.]/, "delimiter"],
        [/"([^"\\]|\\.)*$/, "string.invalid"],
        [/"/, "string", "@string"],
        [/'[^\\']'/, "string"],
        [/(')(@escapes)(')/, ["string", "string.escape", "string"]],
        [/'/, "string.invalid"]
      ],
      whitespace: [
        [/[ \t\r\n]+/, ""],
        [/\/\*\*(?!\/)/, "comment.doc", "@doccomment"],
        [/\/\*/, "comment", "@comment"],
        [/\/\/.*$/, "comment"]
      ],
      comment: [
        [/[^\/*]+/, "comment"],
        [/\*\//, "comment", "@pop"],
        [/[\/*]/, "comment"]
      ],
      doccomment: [
        [/[^\/*]+/, "comment.doc"],
        [/\*\//, "comment.doc", "@pop"],
        [/[\/*]/, "comment.doc"]
      ],
      string: [
        [/[^\\"]+/, "string"],
        [/@escapes/, "string.escape"],
        [/\\./, "string.escape.invalid"],
        [/"/, "string", "@pop"]
      ]
    }
  };
  return __toCommonJS(sophia_exports);
})();
return moduleExports;
});
