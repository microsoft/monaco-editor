"use strict";
/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.40.0(83b3cf23ca80c94cccca7c5b3e48351b220f8e35)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
define("vs/basic-languages/scala/scala", ["require"],(require)=>{
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

  // src/basic-languages/scala/scala.ts
  var scala_exports = {};
  __export(scala_exports, {
    conf: () => conf,
    language: () => language
  });
  var conf = {
    wordPattern: /(unary_[@~!#%^&*()\-=+\\|:<>\/?]+)|([a-zA-Z_$][\w$]*?_=)|(`[^`]+`)|([a-zA-Z_$][\w$]*)/g,
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
    ],
    folding: {
      markers: {
        start: new RegExp("^\\s*//\\s*(?:(?:#?region\\b)|(?:<editor-fold\\b))"),
        end: new RegExp("^\\s*//\\s*(?:(?:#?endregion\\b)|(?:</editor-fold>))")
      }
    }
  };
  var language = {
    tokenPostfix: ".scala",
    keywords: [
      "asInstanceOf",
      "catch",
      "class",
      "classOf",
      "def",
      "do",
      "else",
      "extends",
      "finally",
      "for",
      "foreach",
      "forSome",
      "if",
      "import",
      "isInstanceOf",
      "macro",
      "match",
      "new",
      "object",
      "package",
      "return",
      "throw",
      "trait",
      "try",
      "type",
      "until",
      "val",
      "var",
      "while",
      "with",
      "yield",
      "given",
      "enum",
      "then"
    ],
    softKeywords: ["as", "export", "extension", "end", "derives", "on"],
    constants: ["true", "false", "null", "this", "super"],
    modifiers: [
      "abstract",
      "final",
      "implicit",
      "lazy",
      "override",
      "private",
      "protected",
      "sealed"
    ],
    softModifiers: ["inline", "opaque", "open", "transparent", "using"],
    name: /(?:[a-z_$][\w$]*|`[^`]+`)/,
    type: /(?:[A-Z][\w$]*)/,
    symbols: /[=><!~?:&|+\-*\/^\\%@#]+/,
    digits: /\d+(_+\d+)*/,
    hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,
    escapes: /\\(?:[btnfr\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    fstring_conv: /[bBhHsScCdoxXeEfgGaAt]|[Tn](?:[HIklMSLNpzZsQ]|[BbhAaCYyjmde]|[RTrDFC])/,
    tokenizer: {
      root: [
        [/\braw"""/, { token: "string.quote", bracket: "@open", next: "@rawstringt" }],
        [/\braw"/, { token: "string.quote", bracket: "@open", next: "@rawstring" }],
        [/\bs"""/, { token: "string.quote", bracket: "@open", next: "@sstringt" }],
        [/\bs"/, { token: "string.quote", bracket: "@open", next: "@sstring" }],
        [/\bf""""/, { token: "string.quote", bracket: "@open", next: "@fstringt" }],
        [/\bf"/, { token: "string.quote", bracket: "@open", next: "@fstring" }],
        [/"""/, { token: "string.quote", bracket: "@open", next: "@stringt" }],
        [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],
        [/(@digits)[eE]([\-+]?(@digits))?[fFdD]?/, "number.float", "@allowMethod"],
        [/(@digits)\.(@digits)([eE][\-+]?(@digits))?[fFdD]?/, "number.float", "@allowMethod"],
        [/0[xX](@hexdigits)[Ll]?/, "number.hex", "@allowMethod"],
        [/(@digits)[fFdD]/, "number.float", "@allowMethod"],
        [/(@digits)[lL]?/, "number", "@allowMethod"],
        [/\b_\*/, "key"],
        [/\b(_)\b/, "keyword", "@allowMethod"],
        [/\bimport\b/, "keyword", "@import"],
        [/\b(case)([ \t]+)(class)\b/, ["keyword.modifier", "white", "keyword"]],
        [/\bcase\b/, "keyword", "@case"],
        [/\bva[lr]\b/, "keyword", "@vardef"],
        [
          /\b(def)([ \t]+)((?:unary_)?@symbols|@name(?:_=)|@name)/,
          ["keyword", "white", "identifier"]
        ],
        [/@name(?=[ \t]*:(?!:))/, "variable"],
        [/(\.)(@name|@symbols)/, ["operator", { token: "@rematch", next: "@allowMethod" }]],
        [/([{(])(\s*)(@name(?=\s*=>))/, ["@brackets", "white", "variable"]],
        [
          /@name/,
          {
            cases: {
              "@keywords": "keyword",
              "@softKeywords": "keyword",
              "@modifiers": "keyword.modifier",
              "@softModifiers": "keyword.modifier",
              "@constants": {
                token: "constant",
                next: "@allowMethod"
              },
              "@default": {
                token: "identifier",
                next: "@allowMethod"
              }
            }
          }
        ],
        [/@type/, "type", "@allowMethod"],
        { include: "@whitespace" },
        [/@[a-zA-Z_$][\w$]*(?:\.[a-zA-Z_$][\w$]*)*/, "annotation"],
        [/[{(]/, "@brackets"],
        [/[})]/, "@brackets", "@allowMethod"],
        [/\[/, "operator.square"],
        [/](?!\s*(?:va[rl]|def|type)\b)/, "operator.square", "@allowMethod"],
        [/]/, "operator.square"],
        [/([=-]>|<-|>:|<:|:>|<%)(?=[\s\w()[\]{},\."'`])/, "keyword"],
        [/@symbols/, "operator"],
        [/[;,\.]/, "delimiter"],
        [/'[a-zA-Z$][\w$]*(?!')/, "attribute.name"],
        [/'[^\\']'/, "string", "@allowMethod"],
        [/(')(@escapes)(')/, ["string", "string.escape", { token: "string", next: "@allowMethod" }]],
        [/'/, "string.invalid"]
      ],
      import: [
        [/;/, "delimiter", "@pop"],
        [/^|$/, "", "@pop"],
        [/[ \t]+/, "white"],
        [/[\n\r]+/, "white", "@pop"],
        [/\/\*/, "comment", "@comment"],
        [/@name|@type/, "type"],
        [/[(){}]/, "@brackets"],
        [/[[\]]/, "operator.square"],
        [/[\.,]/, "delimiter"]
      ],
      allowMethod: [
        [/^|$/, "", "@pop"],
        [/[ \t]+/, "white"],
        [/[\n\r]+/, "white", "@pop"],
        [/\/\*/, "comment", "@comment"],
        [/(?==>[\s\w([{])/, "keyword", "@pop"],
        [
          /(@name|@symbols)(?=[ \t]*[[({"'`]|[ \t]+(?:[+-]?\.?\d|\w))/,
          {
            cases: {
              "@keywords": { token: "keyword", next: "@pop" },
              "->|<-|>:|<:|<%": { token: "keyword", next: "@pop" },
              "@default": { token: "@rematch", next: "@pop" }
            }
          }
        ],
        ["", "", "@pop"]
      ],
      comment: [
        [/[^\/*]+/, "comment"],
        [/\/\*/, "comment", "@push"],
        [/\*\//, "comment", "@pop"],
        [/[\/*]/, "comment"]
      ],
      case: [
        [/\b_\*/, "key"],
        [/\b(_|true|false|null|this|super)\b/, "keyword", "@allowMethod"],
        [/\bif\b|=>/, "keyword", "@pop"],
        [/`[^`]+`/, "identifier", "@allowMethod"],
        [/@name/, "variable", "@allowMethod"],
        [/:::?|\||@(?![a-z_$])/, "keyword"],
        { include: "@root" }
      ],
      vardef: [
        [/\b_\*/, "key"],
        [/\b(_|true|false|null|this|super)\b/, "keyword"],
        [/@name/, "variable"],
        [/:::?|\||@(?![a-z_$])/, "keyword"],
        [/=|:(?!:)/, "operator", "@pop"],
        [/$/, "white", "@pop"],
        { include: "@root" }
      ],
      string: [
        [/[^\\"\n\r]+/, "string"],
        [/@escapes/, "string.escape"],
        [/\\./, "string.escape.invalid"],
        [
          /"/,
          {
            token: "string.quote",
            bracket: "@close",
            switchTo: "@allowMethod"
          }
        ]
      ],
      stringt: [
        [/[^\\"\n\r]+/, "string"],
        [/@escapes/, "string.escape"],
        [/\\./, "string.escape.invalid"],
        [/"(?=""")/, "string"],
        [
          /"""/,
          {
            token: "string.quote",
            bracket: "@close",
            switchTo: "@allowMethod"
          }
        ],
        [/"/, "string"]
      ],
      fstring: [
        [/@escapes/, "string.escape"],
        [
          /"/,
          {
            token: "string.quote",
            bracket: "@close",
            switchTo: "@allowMethod"
          }
        ],
        [/\$\$/, "string"],
        [/(\$)([a-z_]\w*)/, ["operator", "identifier"]],
        [/\$\{/, "operator", "@interp"],
        [/%%/, "string"],
        [
          /(%)([\-#+ 0,(])(\d+|\.\d+|\d+\.\d+)(@fstring_conv)/,
          ["metatag", "keyword.modifier", "number", "metatag"]
        ],
        [/(%)(\d+|\.\d+|\d+\.\d+)(@fstring_conv)/, ["metatag", "number", "metatag"]],
        [/(%)([\-#+ 0,(])(@fstring_conv)/, ["metatag", "keyword.modifier", "metatag"]],
        [/(%)(@fstring_conv)/, ["metatag", "metatag"]],
        [/./, "string"]
      ],
      fstringt: [
        [/@escapes/, "string.escape"],
        [/"(?=""")/, "string"],
        [
          /"""/,
          {
            token: "string.quote",
            bracket: "@close",
            switchTo: "@allowMethod"
          }
        ],
        [/\$\$/, "string"],
        [/(\$)([a-z_]\w*)/, ["operator", "identifier"]],
        [/\$\{/, "operator", "@interp"],
        [/%%/, "string"],
        [
          /(%)([\-#+ 0,(])(\d+|\.\d+|\d+\.\d+)(@fstring_conv)/,
          ["metatag", "keyword.modifier", "number", "metatag"]
        ],
        [/(%)(\d+|\.\d+|\d+\.\d+)(@fstring_conv)/, ["metatag", "number", "metatag"]],
        [/(%)([\-#+ 0,(])(@fstring_conv)/, ["metatag", "keyword.modifier", "metatag"]],
        [/(%)(@fstring_conv)/, ["metatag", "metatag"]],
        [/./, "string"]
      ],
      sstring: [
        [/@escapes/, "string.escape"],
        [
          /"/,
          {
            token: "string.quote",
            bracket: "@close",
            switchTo: "@allowMethod"
          }
        ],
        [/\$\$/, "string"],
        [/(\$)([a-z_]\w*)/, ["operator", "identifier"]],
        [/\$\{/, "operator", "@interp"],
        [/./, "string"]
      ],
      sstringt: [
        [/@escapes/, "string.escape"],
        [/"(?=""")/, "string"],
        [
          /"""/,
          {
            token: "string.quote",
            bracket: "@close",
            switchTo: "@allowMethod"
          }
        ],
        [/\$\$/, "string"],
        [/(\$)([a-z_]\w*)/, ["operator", "identifier"]],
        [/\$\{/, "operator", "@interp"],
        [/./, "string"]
      ],
      interp: [[/{/, "operator", "@push"], [/}/, "operator", "@pop"], { include: "@root" }],
      rawstring: [
        [/[^"]/, "string"],
        [
          /"/,
          {
            token: "string.quote",
            bracket: "@close",
            switchTo: "@allowMethod"
          }
        ]
      ],
      rawstringt: [
        [/[^"]/, "string"],
        [/"(?=""")/, "string"],
        [
          /"""/,
          {
            token: "string.quote",
            bracket: "@close",
            switchTo: "@allowMethod"
          }
        ],
        [/"/, "string"]
      ],
      whitespace: [
        [/[ \t\r\n]+/, "white"],
        [/\/\*/, "comment", "@comment"],
        [/\/\/.*$/, "comment"]
      ]
    }
  };
  return __toCommonJS(scala_exports);
})();
return moduleExports;
});
