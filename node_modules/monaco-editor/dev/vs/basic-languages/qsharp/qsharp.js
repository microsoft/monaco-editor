"use strict";
/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.40.0(83b3cf23ca80c94cccca7c5b3e48351b220f8e35)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
define("vs/basic-languages/qsharp/qsharp", ["require"],(require)=>{
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

  // src/basic-languages/qsharp/qsharp.ts
  var qsharp_exports = {};
  __export(qsharp_exports, {
    conf: () => conf,
    language: () => language
  });
  var conf = {
    comments: {
      lineComment: "//"
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
      { open: '"', close: '"', notIn: ["string", "comment"] }
    ],
    surroundingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: '"', close: '"' }
    ]
  };
  var language = {
    keywords: [
      "namespace",
      "open",
      "as",
      "operation",
      "function",
      "body",
      "adjoint",
      "newtype",
      "controlled",
      "if",
      "elif",
      "else",
      "repeat",
      "until",
      "fixup",
      "for",
      "in",
      "while",
      "return",
      "fail",
      "within",
      "apply",
      "Adjoint",
      "Controlled",
      "Adj",
      "Ctl",
      "is",
      "self",
      "auto",
      "distribute",
      "invert",
      "intrinsic",
      "let",
      "set",
      "w/",
      "new",
      "not",
      "and",
      "or",
      "use",
      "borrow",
      "using",
      "borrowing",
      "mutable",
      "internal"
    ],
    typeKeywords: [
      "Unit",
      "Int",
      "BigInt",
      "Double",
      "Bool",
      "String",
      "Qubit",
      "Result",
      "Pauli",
      "Range"
    ],
    invalidKeywords: [
      "abstract",
      "base",
      "bool",
      "break",
      "byte",
      "case",
      "catch",
      "char",
      "checked",
      "class",
      "const",
      "continue",
      "decimal",
      "default",
      "delegate",
      "do",
      "double",
      "enum",
      "event",
      "explicit",
      "extern",
      "finally",
      "fixed",
      "float",
      "foreach",
      "goto",
      "implicit",
      "int",
      "interface",
      "lock",
      "long",
      "null",
      "object",
      "operator",
      "out",
      "override",
      "params",
      "private",
      "protected",
      "public",
      "readonly",
      "ref",
      "sbyte",
      "sealed",
      "short",
      "sizeof",
      "stackalloc",
      "static",
      "string",
      "struct",
      "switch",
      "this",
      "throw",
      "try",
      "typeof",
      "unit",
      "ulong",
      "unchecked",
      "unsafe",
      "ushort",
      "virtual",
      "void",
      "volatile"
    ],
    constants: ["true", "false", "PauliI", "PauliX", "PauliY", "PauliZ", "One", "Zero"],
    builtin: [
      "X",
      "Y",
      "Z",
      "H",
      "HY",
      "S",
      "T",
      "SWAP",
      "CNOT",
      "CCNOT",
      "MultiX",
      "R",
      "RFrac",
      "Rx",
      "Ry",
      "Rz",
      "R1",
      "R1Frac",
      "Exp",
      "ExpFrac",
      "Measure",
      "M",
      "MultiM",
      "Message",
      "Length",
      "Assert",
      "AssertProb",
      "AssertEqual"
    ],
    operators: [
      "and=",
      "<-",
      "->",
      "*",
      "*=",
      "@",
      "!",
      "^",
      "^=",
      ":",
      "::",
      "..",
      "==",
      "...",
      "=",
      "=>",
      ">",
      ">=",
      "<",
      "<=",
      "-",
      "-=",
      "!=",
      "or=",
      "%",
      "%=",
      "|",
      "+",
      "+=",
      "?",
      "/",
      "/=",
      "&&&",
      "&&&=",
      "^^^",
      "^^^=",
      ">>>",
      ">>>=",
      "<<<",
      "<<<=",
      "|||",
      "|||=",
      "~~~",
      "_",
      "w/",
      "w/="
    ],
    namespaceFollows: ["namespace", "open"],
    symbols: /[=><!~?:&|+\-*\/\^%@._]+/,
    escapes: /\\[\s\S]/,
    tokenizer: {
      root: [
        [
          /[a-zA-Z_$][\w$]*/,
          {
            cases: {
              "@namespaceFollows": {
                token: "keyword.$0",
                next: "@namespace"
              },
              "@typeKeywords": "type",
              "@keywords": "keyword",
              "@constants": "constant",
              "@builtin": "keyword",
              "@invalidKeywords": "invalid",
              "@default": "identifier"
            }
          }
        ],
        { include: "@whitespace" },
        [/[{}()\[\]]/, "@brackets"],
        [/@symbols/, { cases: { "@operators": "operator", "@default": "" } }],
        [/\d*\.\d+([eE][\-+]?\d+)?/, "number.float"],
        [/\d+/, "number"],
        [/[;,.]/, "delimiter"],
        [/"/, { token: "string.quote", bracket: "@open", next: "@string" }]
      ],
      string: [
        [/[^\\"]+/, "string"],
        [/@escapes/, "string.escape"],
        [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }]
      ],
      namespace: [
        { include: "@whitespace" },
        [/[A-Za-z]\w*/, "namespace"],
        [/[\.=]/, "delimiter"],
        ["", "", "@pop"]
      ],
      whitespace: [
        [/[ \t\r\n]+/, "white"],
        [/(\/\/).*/, "comment"]
      ]
    }
  };
  return __toCommonJS(qsharp_exports);
})();
return moduleExports;
});
