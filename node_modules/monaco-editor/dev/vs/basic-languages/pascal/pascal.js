"use strict";
/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.37.1(20a8d5a651d057aaed7875ad1c1f2ecf13c4e773)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
define("vs/basic-languages/pascal/pascal", ["require"],(require)=>{
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

  // src/basic-languages/pascal/pascal.ts
  var pascal_exports = {};
  __export(pascal_exports, {
    conf: () => conf,
    language: () => language
  });
  var conf = {
    wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
    comments: {
      lineComment: "//",
      blockComment: ["{", "}"]
    },
    brackets: [
      ["{", "}"],
      ["[", "]"],
      ["(", ")"],
      ["<", ">"]
    ],
    autoClosingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: "<", close: ">" },
      { open: "'", close: "'" }
    ],
    surroundingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: "<", close: ">" },
      { open: "'", close: "'" }
    ],
    folding: {
      markers: {
        start: new RegExp("^\\s*\\{\\$REGION(\\s\\'.*\\')?\\}"),
        end: new RegExp("^\\s*\\{\\$ENDREGION\\}")
      }
    }
  };
  var language = {
    defaultToken: "",
    tokenPostfix: ".pascal",
    ignoreCase: true,
    brackets: [
      { open: "{", close: "}", token: "delimiter.curly" },
      { open: "[", close: "]", token: "delimiter.square" },
      { open: "(", close: ")", token: "delimiter.parenthesis" },
      { open: "<", close: ">", token: "delimiter.angle" }
    ],
    keywords: [
      "absolute",
      "abstract",
      "all",
      "and_then",
      "array",
      "as",
      "asm",
      "attribute",
      "begin",
      "bindable",
      "case",
      "class",
      "const",
      "contains",
      "default",
      "div",
      "else",
      "end",
      "except",
      "exports",
      "external",
      "far",
      "file",
      "finalization",
      "finally",
      "forward",
      "generic",
      "goto",
      "if",
      "implements",
      "import",
      "in",
      "index",
      "inherited",
      "initialization",
      "interrupt",
      "is",
      "label",
      "library",
      "mod",
      "module",
      "name",
      "near",
      "not",
      "object",
      "of",
      "on",
      "only",
      "operator",
      "or_else",
      "otherwise",
      "override",
      "package",
      "packed",
      "pow",
      "private",
      "program",
      "protected",
      "public",
      "published",
      "interface",
      "implementation",
      "qualified",
      "read",
      "record",
      "resident",
      "requires",
      "resourcestring",
      "restricted",
      "segment",
      "set",
      "shl",
      "shr",
      "specialize",
      "stored",
      "strict",
      "then",
      "threadvar",
      "to",
      "try",
      "type",
      "unit",
      "uses",
      "var",
      "view",
      "virtual",
      "dynamic",
      "overload",
      "reintroduce",
      "with",
      "write",
      "xor",
      "true",
      "false",
      "procedure",
      "function",
      "constructor",
      "destructor",
      "property",
      "break",
      "continue",
      "exit",
      "abort",
      "while",
      "do",
      "for",
      "raise",
      "repeat",
      "until"
    ],
    typeKeywords: [
      "boolean",
      "double",
      "byte",
      "integer",
      "shortint",
      "char",
      "longint",
      "float",
      "string"
    ],
    operators: [
      "=",
      ">",
      "<",
      "<=",
      ">=",
      "<>",
      ":",
      ":=",
      "and",
      "or",
      "+",
      "-",
      "*",
      "/",
      "@",
      "&",
      "^",
      "%"
    ],
    symbols: /[=><:@\^&|+\-*\/\^%]+/,
    tokenizer: {
      root: [
        [
          /[a-zA-Z_][\w]*/,
          {
            cases: {
              "@keywords": { token: "keyword.$0" },
              "@default": "identifier"
            }
          }
        ],
        { include: "@whitespace" },
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
        [/\d*\.\d+([eE][\-+]?\d+)?/, "number.float"],
        [/\$[0-9a-fA-F]{1,16}/, "number.hex"],
        [/\d+/, "number"],
        [/[;,.]/, "delimiter"],
        [/'([^'\\]|\\.)*$/, "string.invalid"],
        [/'/, "string", "@string"],
        [/'[^\\']'/, "string"],
        [/'/, "string.invalid"],
        [/\#\d+/, "string"]
      ],
      comment: [
        [/[^\*\}]+/, "comment"],
        [/\}/, "comment", "@pop"],
        [/[\{]/, "comment"]
      ],
      string: [
        [/[^\\']+/, "string"],
        [/\\./, "string.escape.invalid"],
        [/'/, { token: "string.quote", bracket: "@close", next: "@pop" }]
      ],
      whitespace: [
        [/[ \t\r\n]+/, "white"],
        [/\{/, "comment", "@comment"],
        [/\/\/.*$/, "comment"]
      ]
    }
  };
  return __toCommonJS(pascal_exports);
})();
return moduleExports;
});
