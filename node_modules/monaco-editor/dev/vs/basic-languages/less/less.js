"use strict";
/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.36.1(6c56744c3419458f0dd48864520b759d1a3a1ca8)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
define("vs/basic-languages/less/less", ["require"],(require)=>{
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

  // src/basic-languages/less/less.ts
  var less_exports = {};
  __export(less_exports, {
    conf: () => conf,
    language: () => language
  });
  var conf = {
    wordPattern: /(#?-?\d*\.\d\w*%?)|([@#!.:]?[\w-?]+%?)|[@#!.]/g,
    comments: {
      blockComment: ["/*", "*/"],
      lineComment: "//"
    },
    brackets: [
      ["{", "}"],
      ["[", "]"],
      ["(", ")"]
    ],
    autoClosingPairs: [
      { open: "{", close: "}", notIn: ["string", "comment"] },
      { open: "[", close: "]", notIn: ["string", "comment"] },
      { open: "(", close: ")", notIn: ["string", "comment"] },
      { open: '"', close: '"', notIn: ["string", "comment"] },
      { open: "'", close: "'", notIn: ["string", "comment"] }
    ],
    surroundingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: '"', close: '"' },
      { open: "'", close: "'" }
    ],
    folding: {
      markers: {
        start: new RegExp("^\\s*\\/\\*\\s*#region\\b\\s*(.*?)\\s*\\*\\/"),
        end: new RegExp("^\\s*\\/\\*\\s*#endregion\\b.*\\*\\/")
      }
    }
  };
  var language = {
    defaultToken: "",
    tokenPostfix: ".less",
    identifier: "-?-?([a-zA-Z]|(\\\\(([0-9a-fA-F]{1,6}\\s?)|[^[0-9a-fA-F])))([\\w\\-]|(\\\\(([0-9a-fA-F]{1,6}\\s?)|[^[0-9a-fA-F])))*",
    identifierPlus: "-?-?([a-zA-Z:.]|(\\\\(([0-9a-fA-F]{1,6}\\s?)|[^[0-9a-fA-F])))([\\w\\-:.]|(\\\\(([0-9a-fA-F]{1,6}\\s?)|[^[0-9a-fA-F])))*",
    brackets: [
      { open: "{", close: "}", token: "delimiter.curly" },
      { open: "[", close: "]", token: "delimiter.bracket" },
      { open: "(", close: ")", token: "delimiter.parenthesis" },
      { open: "<", close: ">", token: "delimiter.angle" }
    ],
    tokenizer: {
      root: [
        { include: "@nestedJSBegin" },
        ["[ \\t\\r\\n]+", ""],
        { include: "@comments" },
        { include: "@keyword" },
        { include: "@strings" },
        { include: "@numbers" },
        ["[*_]?[a-zA-Z\\-\\s]+(?=:.*(;|(\\\\$)))", "attribute.name", "@attribute"],
        ["url(\\-prefix)?\\(", { token: "tag", next: "@urldeclaration" }],
        ["[{}()\\[\\]]", "@brackets"],
        ["[,:;]", "delimiter"],
        ["#@identifierPlus", "tag.id"],
        ["&", "tag"],
        ["\\.@identifierPlus(?=\\()", "tag.class", "@attribute"],
        ["\\.@identifierPlus", "tag.class"],
        ["@identifierPlus", "tag"],
        { include: "@operators" },
        ["@(@identifier(?=[:,\\)]))", "variable", "@attribute"],
        ["@(@identifier)", "variable"],
        ["@", "key", "@atRules"]
      ],
      nestedJSBegin: [
        ["``", "delimiter.backtick"],
        [
          "`",
          {
            token: "delimiter.backtick",
            next: "@nestedJSEnd",
            nextEmbedded: "text/javascript"
          }
        ]
      ],
      nestedJSEnd: [
        [
          "`",
          {
            token: "delimiter.backtick",
            next: "@pop",
            nextEmbedded: "@pop"
          }
        ]
      ],
      operators: [["[<>=\\+\\-\\*\\/\\^\\|\\~]", "operator"]],
      keyword: [
        [
          "(@[\\s]*import|![\\s]*important|true|false|when|iscolor|isnumber|isstring|iskeyword|isurl|ispixel|ispercentage|isem|hue|saturation|lightness|alpha|lighten|darken|saturate|desaturate|fadein|fadeout|fade|spin|mix|round|ceil|floor|percentage)\\b",
          "keyword"
        ]
      ],
      urldeclaration: [
        { include: "@strings" },
        ["[^)\r\n]+", "string"],
        ["\\)", { token: "tag", next: "@pop" }]
      ],
      attribute: [
        { include: "@nestedJSBegin" },
        { include: "@comments" },
        { include: "@strings" },
        { include: "@numbers" },
        { include: "@keyword" },
        ["[a-zA-Z\\-]+(?=\\()", "attribute.value", "@attribute"],
        [">", "operator", "@pop"],
        ["@identifier", "attribute.value"],
        { include: "@operators" },
        ["@(@identifier)", "variable"],
        ["[)\\}]", "@brackets", "@pop"],
        ["[{}()\\[\\]>]", "@brackets"],
        ["[;]", "delimiter", "@pop"],
        ["[,=:]", "delimiter"],
        ["\\s", ""],
        [".", "attribute.value"]
      ],
      comments: [
        ["\\/\\*", "comment", "@comment"],
        ["\\/\\/+.*", "comment"]
      ],
      comment: [
        ["\\*\\/", "comment", "@pop"],
        [".", "comment"]
      ],
      numbers: [
        ["(\\d*\\.)?\\d+([eE][\\-+]?\\d+)?", { token: "attribute.value.number", next: "@units" }],
        ["#[0-9a-fA-F_]+(?!\\w)", "attribute.value.hex"]
      ],
      units: [
        [
          "(em|ex|ch|rem|fr|vmin|vmax|vw|vh|vm|cm|mm|in|px|pt|pc|deg|grad|rad|turn|s|ms|Hz|kHz|%)?",
          "attribute.value.unit",
          "@pop"
        ]
      ],
      strings: [
        ['~?"', { token: "string.delimiter", next: "@stringsEndDoubleQuote" }],
        ["~?'", { token: "string.delimiter", next: "@stringsEndQuote" }]
      ],
      stringsEndDoubleQuote: [
        ['\\\\"', "string"],
        ['"', { token: "string.delimiter", next: "@popall" }],
        [".", "string"]
      ],
      stringsEndQuote: [
        ["\\\\'", "string"],
        ["'", { token: "string.delimiter", next: "@popall" }],
        [".", "string"]
      ],
      atRules: [
        { include: "@comments" },
        { include: "@strings" },
        ["[()]", "delimiter"],
        ["[\\{;]", "delimiter", "@pop"],
        [".", "key"]
      ]
    }
  };
  return __toCommonJS(less_exports);
})();
return moduleExports;
});
