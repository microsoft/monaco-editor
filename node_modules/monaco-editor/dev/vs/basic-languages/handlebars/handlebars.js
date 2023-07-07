"use strict";
/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.40.0(83b3cf23ca80c94cccca7c5b3e48351b220f8e35)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
define("vs/basic-languages/handlebars/handlebars", ["require"],(require)=>{
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

  // src/basic-languages/handlebars/handlebars.ts
  var handlebars_exports = {};
  __export(handlebars_exports, {
    conf: () => conf,
    language: () => language
  });

  // src/fillers/monaco-editor-core.ts
  var monaco_editor_core_exports = {};
  __reExport(monaco_editor_core_exports, __toESM(require_monaco_editor_core_amd()));

  // src/basic-languages/handlebars/handlebars.ts
  var EMPTY_ELEMENTS = [
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "keygen",
    "link",
    "menuitem",
    "meta",
    "param",
    "source",
    "track",
    "wbr"
  ];
  var conf = {
    wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\$\^\&\*\(\)\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\s]+)/g,
    comments: {
      blockComment: ["{{!--", "--}}"]
    },
    brackets: [
      ["<!--", "-->"],
      ["<", ">"],
      ["{{", "}}"],
      ["{", "}"],
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
      { open: "<", close: ">" },
      { open: '"', close: '"' },
      { open: "'", close: "'" }
    ],
    onEnterRules: [
      {
        beforeText: new RegExp(`<(?!(?:${EMPTY_ELEMENTS.join("|")}))(\\w[\\w\\d]*)([^/>]*(?!/)>)[^<]*$`, "i"),
        afterText: /^<\/(\w[\w\d]*)\s*>$/i,
        action: {
          indentAction: monaco_editor_core_exports.languages.IndentAction.IndentOutdent
        }
      },
      {
        beforeText: new RegExp(`<(?!(?:${EMPTY_ELEMENTS.join("|")}))(\\w[\\w\\d]*)([^/>]*(?!/)>)[^<]*$`, "i"),
        action: { indentAction: monaco_editor_core_exports.languages.IndentAction.Indent }
      }
    ]
  };
  var language = {
    defaultToken: "",
    tokenPostfix: "",
    tokenizer: {
      root: [
        [/\{\{!--/, "comment.block.start.handlebars", "@commentBlock"],
        [/\{\{!/, "comment.start.handlebars", "@comment"],
        [/\{\{/, { token: "@rematch", switchTo: "@handlebarsInSimpleState.root" }],
        [/<!DOCTYPE/, "metatag.html", "@doctype"],
        [/<!--/, "comment.html", "@commentHtml"],
        [/(<)(\w+)(\/>)/, ["delimiter.html", "tag.html", "delimiter.html"]],
        [/(<)(script)/, ["delimiter.html", { token: "tag.html", next: "@script" }]],
        [/(<)(style)/, ["delimiter.html", { token: "tag.html", next: "@style" }]],
        [/(<)([:\w]+)/, ["delimiter.html", { token: "tag.html", next: "@otherTag" }]],
        [/(<\/)(\w+)/, ["delimiter.html", { token: "tag.html", next: "@otherTag" }]],
        [/</, "delimiter.html"],
        [/\{/, "delimiter.html"],
        [/[^<{]+/]
      ],
      doctype: [
        [
          /\{\{/,
          {
            token: "@rematch",
            switchTo: "@handlebarsInSimpleState.comment"
          }
        ],
        [/[^>]+/, "metatag.content.html"],
        [/>/, "metatag.html", "@pop"]
      ],
      comment: [
        [/\}\}/, "comment.end.handlebars", "@pop"],
        [/./, "comment.content.handlebars"]
      ],
      commentBlock: [
        [/--\}\}/, "comment.block.end.handlebars", "@pop"],
        [/./, "comment.content.handlebars"]
      ],
      commentHtml: [
        [
          /\{\{/,
          {
            token: "@rematch",
            switchTo: "@handlebarsInSimpleState.comment"
          }
        ],
        [/-->/, "comment.html", "@pop"],
        [/[^-]+/, "comment.content.html"],
        [/./, "comment.content.html"]
      ],
      otherTag: [
        [
          /\{\{/,
          {
            token: "@rematch",
            switchTo: "@handlebarsInSimpleState.otherTag"
          }
        ],
        [/\/?>/, "delimiter.html", "@pop"],
        [/"([^"]*)"/, "attribute.value"],
        [/'([^']*)'/, "attribute.value"],
        [/[\w\-]+/, "attribute.name"],
        [/=/, "delimiter"],
        [/[ \t\r\n]+/]
      ],
      script: [
        [
          /\{\{/,
          {
            token: "@rematch",
            switchTo: "@handlebarsInSimpleState.script"
          }
        ],
        [/type/, "attribute.name", "@scriptAfterType"],
        [/"([^"]*)"/, "attribute.value"],
        [/'([^']*)'/, "attribute.value"],
        [/[\w\-]+/, "attribute.name"],
        [/=/, "delimiter"],
        [
          />/,
          {
            token: "delimiter.html",
            next: "@scriptEmbedded.text/javascript",
            nextEmbedded: "text/javascript"
          }
        ],
        [/[ \t\r\n]+/],
        [
          /(<\/)(script\s*)(>)/,
          ["delimiter.html", "tag.html", { token: "delimiter.html", next: "@pop" }]
        ]
      ],
      scriptAfterType: [
        [
          /\{\{/,
          {
            token: "@rematch",
            switchTo: "@handlebarsInSimpleState.scriptAfterType"
          }
        ],
        [/=/, "delimiter", "@scriptAfterTypeEquals"],
        [
          />/,
          {
            token: "delimiter.html",
            next: "@scriptEmbedded.text/javascript",
            nextEmbedded: "text/javascript"
          }
        ],
        [/[ \t\r\n]+/],
        [/<\/script\s*>/, { token: "@rematch", next: "@pop" }]
      ],
      scriptAfterTypeEquals: [
        [
          /\{\{/,
          {
            token: "@rematch",
            switchTo: "@handlebarsInSimpleState.scriptAfterTypeEquals"
          }
        ],
        [
          /"([^"]*)"/,
          {
            token: "attribute.value",
            switchTo: "@scriptWithCustomType.$1"
          }
        ],
        [
          /'([^']*)'/,
          {
            token: "attribute.value",
            switchTo: "@scriptWithCustomType.$1"
          }
        ],
        [
          />/,
          {
            token: "delimiter.html",
            next: "@scriptEmbedded.text/javascript",
            nextEmbedded: "text/javascript"
          }
        ],
        [/[ \t\r\n]+/],
        [/<\/script\s*>/, { token: "@rematch", next: "@pop" }]
      ],
      scriptWithCustomType: [
        [
          /\{\{/,
          {
            token: "@rematch",
            switchTo: "@handlebarsInSimpleState.scriptWithCustomType.$S2"
          }
        ],
        [
          />/,
          {
            token: "delimiter.html",
            next: "@scriptEmbedded.$S2",
            nextEmbedded: "$S2"
          }
        ],
        [/"([^"]*)"/, "attribute.value"],
        [/'([^']*)'/, "attribute.value"],
        [/[\w\-]+/, "attribute.name"],
        [/=/, "delimiter"],
        [/[ \t\r\n]+/],
        [/<\/script\s*>/, { token: "@rematch", next: "@pop" }]
      ],
      scriptEmbedded: [
        [
          /\{\{/,
          {
            token: "@rematch",
            switchTo: "@handlebarsInEmbeddedState.scriptEmbedded.$S2",
            nextEmbedded: "@pop"
          }
        ],
        [/<\/script/, { token: "@rematch", next: "@pop", nextEmbedded: "@pop" }]
      ],
      style: [
        [
          /\{\{/,
          {
            token: "@rematch",
            switchTo: "@handlebarsInSimpleState.style"
          }
        ],
        [/type/, "attribute.name", "@styleAfterType"],
        [/"([^"]*)"/, "attribute.value"],
        [/'([^']*)'/, "attribute.value"],
        [/[\w\-]+/, "attribute.name"],
        [/=/, "delimiter"],
        [
          />/,
          {
            token: "delimiter.html",
            next: "@styleEmbedded.text/css",
            nextEmbedded: "text/css"
          }
        ],
        [/[ \t\r\n]+/],
        [
          /(<\/)(style\s*)(>)/,
          ["delimiter.html", "tag.html", { token: "delimiter.html", next: "@pop" }]
        ]
      ],
      styleAfterType: [
        [
          /\{\{/,
          {
            token: "@rematch",
            switchTo: "@handlebarsInSimpleState.styleAfterType"
          }
        ],
        [/=/, "delimiter", "@styleAfterTypeEquals"],
        [
          />/,
          {
            token: "delimiter.html",
            next: "@styleEmbedded.text/css",
            nextEmbedded: "text/css"
          }
        ],
        [/[ \t\r\n]+/],
        [/<\/style\s*>/, { token: "@rematch", next: "@pop" }]
      ],
      styleAfterTypeEquals: [
        [
          /\{\{/,
          {
            token: "@rematch",
            switchTo: "@handlebarsInSimpleState.styleAfterTypeEquals"
          }
        ],
        [
          /"([^"]*)"/,
          {
            token: "attribute.value",
            switchTo: "@styleWithCustomType.$1"
          }
        ],
        [
          /'([^']*)'/,
          {
            token: "attribute.value",
            switchTo: "@styleWithCustomType.$1"
          }
        ],
        [
          />/,
          {
            token: "delimiter.html",
            next: "@styleEmbedded.text/css",
            nextEmbedded: "text/css"
          }
        ],
        [/[ \t\r\n]+/],
        [/<\/style\s*>/, { token: "@rematch", next: "@pop" }]
      ],
      styleWithCustomType: [
        [
          /\{\{/,
          {
            token: "@rematch",
            switchTo: "@handlebarsInSimpleState.styleWithCustomType.$S2"
          }
        ],
        [
          />/,
          {
            token: "delimiter.html",
            next: "@styleEmbedded.$S2",
            nextEmbedded: "$S2"
          }
        ],
        [/"([^"]*)"/, "attribute.value"],
        [/'([^']*)'/, "attribute.value"],
        [/[\w\-]+/, "attribute.name"],
        [/=/, "delimiter"],
        [/[ \t\r\n]+/],
        [/<\/style\s*>/, { token: "@rematch", next: "@pop" }]
      ],
      styleEmbedded: [
        [
          /\{\{/,
          {
            token: "@rematch",
            switchTo: "@handlebarsInEmbeddedState.styleEmbedded.$S2",
            nextEmbedded: "@pop"
          }
        ],
        [/<\/style/, { token: "@rematch", next: "@pop", nextEmbedded: "@pop" }]
      ],
      handlebarsInSimpleState: [
        [/\{\{\{?/, "delimiter.handlebars"],
        [/\}\}\}?/, { token: "delimiter.handlebars", switchTo: "@$S2.$S3" }],
        { include: "handlebarsRoot" }
      ],
      handlebarsInEmbeddedState: [
        [/\{\{\{?/, "delimiter.handlebars"],
        [
          /\}\}\}?/,
          {
            token: "delimiter.handlebars",
            switchTo: "@$S2.$S3",
            nextEmbedded: "$S3"
          }
        ],
        { include: "handlebarsRoot" }
      ],
      handlebarsRoot: [
        [/"[^"]*"/, "string.handlebars"],
        [/[#/][^\s}]+/, "keyword.helper.handlebars"],
        [/else\b/, "keyword.helper.handlebars"],
        [/[\s]+/],
        [/[^}]/, "variable.parameter.handlebars"]
      ]
    }
  };
  return __toCommonJS(handlebars_exports);
})();
return moduleExports;
});
