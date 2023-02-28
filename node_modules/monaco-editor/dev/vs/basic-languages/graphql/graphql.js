"use strict";
/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.36.1(6c56744c3419458f0dd48864520b759d1a3a1ca8)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
define("vs/basic-languages/graphql/graphql", ["require"],(require)=>{
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

  // src/basic-languages/graphql/graphql.ts
  var graphql_exports = {};
  __export(graphql_exports, {
    conf: () => conf,
    language: () => language
  });
  var conf = {
    comments: {
      lineComment: "#"
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
      { open: '"""', close: '"""', notIn: ["string", "comment"] },
      { open: '"', close: '"', notIn: ["string", "comment"] }
    ],
    surroundingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: '"""', close: '"""' },
      { open: '"', close: '"' }
    ],
    folding: {
      offSide: true
    }
  };
  var language = {
    defaultToken: "invalid",
    tokenPostfix: ".gql",
    keywords: [
      "null",
      "true",
      "false",
      "query",
      "mutation",
      "subscription",
      "extend",
      "schema",
      "directive",
      "scalar",
      "type",
      "interface",
      "union",
      "enum",
      "input",
      "implements",
      "fragment",
      "on"
    ],
    typeKeywords: ["Int", "Float", "String", "Boolean", "ID"],
    directiveLocations: [
      "SCHEMA",
      "SCALAR",
      "OBJECT",
      "FIELD_DEFINITION",
      "ARGUMENT_DEFINITION",
      "INTERFACE",
      "UNION",
      "ENUM",
      "ENUM_VALUE",
      "INPUT_OBJECT",
      "INPUT_FIELD_DEFINITION",
      "QUERY",
      "MUTATION",
      "SUBSCRIPTION",
      "FIELD",
      "FRAGMENT_DEFINITION",
      "FRAGMENT_SPREAD",
      "INLINE_FRAGMENT",
      "VARIABLE_DEFINITION"
    ],
    operators: ["=", "!", "?", ":", "&", "|"],
    symbols: /[=!?:&|]+/,
    escapes: /\\(?:["\\\/bfnrt]|u[0-9A-Fa-f]{4})/,
    tokenizer: {
      root: [
        [
          /[a-z_][\w$]*/,
          {
            cases: {
              "@keywords": "keyword",
              "@default": "key.identifier"
            }
          }
        ],
        [
          /[$][\w$]*/,
          {
            cases: {
              "@keywords": "keyword",
              "@default": "argument.identifier"
            }
          }
        ],
        [
          /[A-Z][\w\$]*/,
          {
            cases: {
              "@typeKeywords": "keyword",
              "@default": "type.identifier"
            }
          }
        ],
        { include: "@whitespace" },
        [/[{}()\[\]]/, "@brackets"],
        [/@symbols/, { cases: { "@operators": "operator", "@default": "" } }],
        [/@\s*[a-zA-Z_\$][\w\$]*/, { token: "annotation", log: "annotation token: $0" }],
        [/\d*\.\d+([eE][\-+]?\d+)?/, "number.float"],
        [/0[xX][0-9a-fA-F]+/, "number.hex"],
        [/\d+/, "number"],
        [/[;,.]/, "delimiter"],
        [/"""/, { token: "string", next: "@mlstring", nextEmbedded: "markdown" }],
        [/"([^"\\]|\\.)*$/, "string.invalid"],
        [/"/, { token: "string.quote", bracket: "@open", next: "@string" }]
      ],
      mlstring: [
        [/[^"]+/, "string"],
        ['"""', { token: "string", next: "@pop", nextEmbedded: "@pop" }]
      ],
      string: [
        [/[^\\"]+/, "string"],
        [/@escapes/, "string.escape"],
        [/\\./, "string.escape.invalid"],
        [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }]
      ],
      whitespace: [
        [/[ \t\r\n]+/, ""],
        [/#.*$/, "comment"]
      ]
    }
  };
  return __toCommonJS(graphql_exports);
})();
return moduleExports;
});
