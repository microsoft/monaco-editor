"use strict";
/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.36.1(6c56744c3419458f0dd48864520b759d1a3a1ca8)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
define("vs/basic-languages/yaml/yaml", ["require"],(require)=>{
var moduleExports = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw new Error('Dynamic require of "' + x + '" is not supported');
  });
  var __commonJS = (cb, mod) => function __require2() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
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
  var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/fillers/monaco-editor-core-amd.ts
  var require_monaco_editor_core_amd = __commonJS({
    "src/fillers/monaco-editor-core-amd.ts"(exports, module) {
      var api = __toESM(__require("vs/editor/editor.api"));
      module.exports = api;
    }
  });

  // src/basic-languages/yaml/yaml.ts
  var yaml_exports = {};
  __export(yaml_exports, {
    conf: () => conf,
    language: () => language
  });

  // src/fillers/monaco-editor-core.ts
  var monaco_editor_core_exports = {};
  __reExport(monaco_editor_core_exports, __toESM(require_monaco_editor_core_amd()));

  // src/basic-languages/yaml/yaml.ts
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
      offSide: true
    },
    onEnterRules: [
      {
        beforeText: /:\s*$/,
        action: {
          indentAction: monaco_editor_core_exports.languages.IndentAction.Indent
        }
      }
    ]
  };
  var language = {
    tokenPostfix: ".yaml",
    brackets: [
      { token: "delimiter.bracket", open: "{", close: "}" },
      { token: "delimiter.square", open: "[", close: "]" }
    ],
    keywords: ["true", "True", "TRUE", "false", "False", "FALSE", "null", "Null", "Null", "~"],
    numberInteger: /(?:0|[+-]?[0-9]+)/,
    numberFloat: /(?:0|[+-]?[0-9]+)(?:\.[0-9]+)?(?:e[-+][1-9][0-9]*)?/,
    numberOctal: /0o[0-7]+/,
    numberHex: /0x[0-9a-fA-F]+/,
    numberInfinity: /[+-]?\.(?:inf|Inf|INF)/,
    numberNaN: /\.(?:nan|Nan|NAN)/,
    numberDate: /\d{4}-\d\d-\d\d([Tt ]\d\d:\d\d:\d\d(\.\d+)?(( ?[+-]\d\d?(:\d\d)?)|Z)?)?/,
    escapes: /\\(?:[btnfr\\"']|[0-7][0-7]?|[0-3][0-7]{2})/,
    tokenizer: {
      root: [
        { include: "@whitespace" },
        { include: "@comment" },
        [/%[^ ]+.*$/, "meta.directive"],
        [/---/, "operators.directivesEnd"],
        [/\.{3}/, "operators.documentEnd"],
        [/[-?:](?= )/, "operators"],
        { include: "@anchor" },
        { include: "@tagHandle" },
        { include: "@flowCollections" },
        { include: "@blockStyle" },
        [/@numberInteger(?![ \t]*\S+)/, "number"],
        [/@numberFloat(?![ \t]*\S+)/, "number.float"],
        [/@numberOctal(?![ \t]*\S+)/, "number.octal"],
        [/@numberHex(?![ \t]*\S+)/, "number.hex"],
        [/@numberInfinity(?![ \t]*\S+)/, "number.infinity"],
        [/@numberNaN(?![ \t]*\S+)/, "number.nan"],
        [/@numberDate(?![ \t]*\S+)/, "number.date"],
        [/(".*?"|'.*?'|.*?)([ \t]*)(:)( |$)/, ["type", "white", "operators", "white"]],
        { include: "@flowScalars" },
        [
          /[^#]+/,
          {
            cases: {
              "@keywords": "keyword",
              "@default": "string"
            }
          }
        ]
      ],
      object: [
        { include: "@whitespace" },
        { include: "@comment" },
        [/\}/, "@brackets", "@pop"],
        [/,/, "delimiter.comma"],
        [/:(?= )/, "operators"],
        [/(?:".*?"|'.*?'|[^,\{\[]+?)(?=: )/, "type"],
        { include: "@flowCollections" },
        { include: "@flowScalars" },
        { include: "@tagHandle" },
        { include: "@anchor" },
        { include: "@flowNumber" },
        [
          /[^\},]+/,
          {
            cases: {
              "@keywords": "keyword",
              "@default": "string"
            }
          }
        ]
      ],
      array: [
        { include: "@whitespace" },
        { include: "@comment" },
        [/\]/, "@brackets", "@pop"],
        [/,/, "delimiter.comma"],
        { include: "@flowCollections" },
        { include: "@flowScalars" },
        { include: "@tagHandle" },
        { include: "@anchor" },
        { include: "@flowNumber" },
        [
          /[^\],]+/,
          {
            cases: {
              "@keywords": "keyword",
              "@default": "string"
            }
          }
        ]
      ],
      multiString: [[/^( +).+$/, "string", "@multiStringContinued.$1"]],
      multiStringContinued: [
        [
          /^( *).+$/,
          {
            cases: {
              "$1==$S2": "string",
              "@default": { token: "@rematch", next: "@popall" }
            }
          }
        ]
      ],
      whitespace: [[/[ \t\r\n]+/, "white"]],
      comment: [[/#.*$/, "comment"]],
      flowCollections: [
        [/\[/, "@brackets", "@array"],
        [/\{/, "@brackets", "@object"]
      ],
      flowScalars: [
        [/"([^"\\]|\\.)*$/, "string.invalid"],
        [/'([^'\\]|\\.)*$/, "string.invalid"],
        [/'[^']*'/, "string"],
        [/"/, "string", "@doubleQuotedString"]
      ],
      doubleQuotedString: [
        [/[^\\"]+/, "string"],
        [/@escapes/, "string.escape"],
        [/\\./, "string.escape.invalid"],
        [/"/, "string", "@pop"]
      ],
      blockStyle: [[/[>|][0-9]*[+-]?$/, "operators", "@multiString"]],
      flowNumber: [
        [/@numberInteger(?=[ \t]*[,\]\}])/, "number"],
        [/@numberFloat(?=[ \t]*[,\]\}])/, "number.float"],
        [/@numberOctal(?=[ \t]*[,\]\}])/, "number.octal"],
        [/@numberHex(?=[ \t]*[,\]\}])/, "number.hex"],
        [/@numberInfinity(?=[ \t]*[,\]\}])/, "number.infinity"],
        [/@numberNaN(?=[ \t]*[,\]\}])/, "number.nan"],
        [/@numberDate(?=[ \t]*[,\]\}])/, "number.date"]
      ],
      tagHandle: [[/\![^ ]*/, "tag"]],
      anchor: [[/[&*][^ ]+/, "namespace"]]
    }
  };
  return __toCommonJS(yaml_exports);
})();
return moduleExports;
});
