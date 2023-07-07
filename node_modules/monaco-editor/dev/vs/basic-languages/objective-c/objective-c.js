"use strict";
/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.40.0(83b3cf23ca80c94cccca7c5b3e48351b220f8e35)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
define("vs/basic-languages/objective-c/objective-c", ["require"],(require)=>{
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

  // src/basic-languages/objective-c/objective-c.ts
  var objective_c_exports = {};
  __export(objective_c_exports, {
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
      ["(", ")"]
    ],
    autoClosingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: '"', close: '"' },
      { open: "'", close: "'" }
    ],
    surroundingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: '"', close: '"' },
      { open: "'", close: "'" }
    ]
  };
  var language = {
    defaultToken: "",
    tokenPostfix: ".objective-c",
    keywords: [
      "#import",
      "#include",
      "#define",
      "#else",
      "#endif",
      "#if",
      "#ifdef",
      "#ifndef",
      "#ident",
      "#undef",
      "@class",
      "@defs",
      "@dynamic",
      "@encode",
      "@end",
      "@implementation",
      "@interface",
      "@package",
      "@private",
      "@protected",
      "@property",
      "@protocol",
      "@public",
      "@selector",
      "@synthesize",
      "__declspec",
      "assign",
      "auto",
      "BOOL",
      "break",
      "bycopy",
      "byref",
      "case",
      "char",
      "Class",
      "const",
      "copy",
      "continue",
      "default",
      "do",
      "double",
      "else",
      "enum",
      "extern",
      "FALSE",
      "false",
      "float",
      "for",
      "goto",
      "if",
      "in",
      "int",
      "id",
      "inout",
      "IMP",
      "long",
      "nil",
      "nonatomic",
      "NULL",
      "oneway",
      "out",
      "private",
      "public",
      "protected",
      "readwrite",
      "readonly",
      "register",
      "return",
      "SEL",
      "self",
      "short",
      "signed",
      "sizeof",
      "static",
      "struct",
      "super",
      "switch",
      "typedef",
      "TRUE",
      "true",
      "union",
      "unsigned",
      "volatile",
      "void",
      "while"
    ],
    decpart: /\d(_?\d)*/,
    decimal: /0|@decpart/,
    tokenizer: {
      root: [
        { include: "@comments" },
        { include: "@whitespace" },
        { include: "@numbers" },
        { include: "@strings" },
        [/[,:;]/, "delimiter"],
        [/[{}\[\]()<>]/, "@brackets"],
        [
          /[a-zA-Z@#]\w*/,
          {
            cases: {
              "@keywords": "keyword",
              "@default": "identifier"
            }
          }
        ],
        [/[<>=\\+\\-\\*\\/\\^\\|\\~,]|and\\b|or\\b|not\\b]/, "operator"]
      ],
      whitespace: [[/\s+/, "white"]],
      comments: [
        ["\\/\\*", "comment", "@comment"],
        ["\\/\\/+.*", "comment"]
      ],
      comment: [
        ["\\*\\/", "comment", "@pop"],
        [".", "comment"]
      ],
      numbers: [
        [/0[xX][0-9a-fA-F]*(_?[0-9a-fA-F])*/, "number.hex"],
        [
          /@decimal((\.@decpart)?([eE][\-+]?@decpart)?)[fF]*/,
          {
            cases: {
              "(\\d)*": "number",
              $0: "number.float"
            }
          }
        ]
      ],
      strings: [
        [/'$/, "string.escape", "@popall"],
        [/'/, "string.escape", "@stringBody"],
        [/"$/, "string.escape", "@popall"],
        [/"/, "string.escape", "@dblStringBody"]
      ],
      stringBody: [
        [/[^\\']+$/, "string", "@popall"],
        [/[^\\']+/, "string"],
        [/\\./, "string"],
        [/'/, "string.escape", "@popall"],
        [/\\$/, "string"]
      ],
      dblStringBody: [
        [/[^\\"]+$/, "string", "@popall"],
        [/[^\\"]+/, "string"],
        [/\\./, "string"],
        [/"/, "string.escape", "@popall"],
        [/\\$/, "string"]
      ]
    }
  };
  return __toCommonJS(objective_c_exports);
})();
return moduleExports;
});
