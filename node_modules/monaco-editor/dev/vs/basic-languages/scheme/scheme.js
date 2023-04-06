"use strict";
/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.37.1(20a8d5a651d057aaed7875ad1c1f2ecf13c4e773)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
define("vs/basic-languages/scheme/scheme", ["require"],(require)=>{
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

  // src/basic-languages/scheme/scheme.ts
  var scheme_exports = {};
  __export(scheme_exports, {
    conf: () => conf,
    language: () => language
  });
  var conf = {
    comments: {
      lineComment: ";",
      blockComment: ["#|", "|#"]
    },
    brackets: [
      ["(", ")"],
      ["{", "}"],
      ["[", "]"]
    ],
    autoClosingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: '"', close: '"' }
    ],
    surroundingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: '"', close: '"' }
    ]
  };
  var language = {
    defaultToken: "",
    ignoreCase: true,
    tokenPostfix: ".scheme",
    brackets: [
      { open: "(", close: ")", token: "delimiter.parenthesis" },
      { open: "{", close: "}", token: "delimiter.curly" },
      { open: "[", close: "]", token: "delimiter.square" }
    ],
    keywords: [
      "case",
      "do",
      "let",
      "loop",
      "if",
      "else",
      "when",
      "cons",
      "car",
      "cdr",
      "cond",
      "lambda",
      "lambda*",
      "syntax-rules",
      "format",
      "set!",
      "quote",
      "eval",
      "append",
      "list",
      "list?",
      "member?",
      "load"
    ],
    constants: ["#t", "#f"],
    operators: ["eq?", "eqv?", "equal?", "and", "or", "not", "null?"],
    tokenizer: {
      root: [
        [/#[xXoObB][0-9a-fA-F]+/, "number.hex"],
        [/[+-]?\d+(?:(?:\.\d*)?(?:[eE][+-]?\d+)?)?/, "number.float"],
        [
          /(?:\b(?:(define|define-syntax|define-macro))\b)(\s+)((?:\w|\-|\!|\?)*)/,
          ["keyword", "white", "variable"]
        ],
        { include: "@whitespace" },
        { include: "@strings" },
        [
          /[a-zA-Z_#][a-zA-Z0-9_\-\?\!\*]*/,
          {
            cases: {
              "@keywords": "keyword",
              "@constants": "constant",
              "@operators": "operators",
              "@default": "identifier"
            }
          }
        ]
      ],
      comment: [
        [/[^\|#]+/, "comment"],
        [/#\|/, "comment", "@push"],
        [/\|#/, "comment", "@pop"],
        [/[\|#]/, "comment"]
      ],
      whitespace: [
        [/[ \t\r\n]+/, "white"],
        [/#\|/, "comment", "@comment"],
        [/;.*$/, "comment"]
      ],
      strings: [
        [/"$/, "string", "@popall"],
        [/"(?=.)/, "string", "@multiLineString"]
      ],
      multiLineString: [
        [/[^\\"]+$/, "string", "@popall"],
        [/[^\\"]+/, "string"],
        [/\\./, "string.escape"],
        [/"/, "string", "@popall"],
        [/\\$/, "string"]
      ]
    }
  };
  return __toCommonJS(scheme_exports);
})();
return moduleExports;
});
