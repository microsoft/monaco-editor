"use strict";
/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.36.1(6c56744c3419458f0dd48864520b759d1a3a1ca8)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
define("vs/basic-languages/markdown/markdown", ["require"],(require)=>{
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

  // src/basic-languages/markdown/markdown.ts
  var markdown_exports = {};
  __export(markdown_exports, {
    conf: () => conf,
    language: () => language
  });
  var conf = {
    comments: {
      blockComment: ["<!--", "-->"]
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
      { open: "<", close: ">", notIn: ["string"] }
    ],
    surroundingPairs: [
      { open: "(", close: ")" },
      { open: "[", close: "]" },
      { open: "`", close: "`" }
    ],
    folding: {
      markers: {
        start: new RegExp("^\\s*<!--\\s*#?region\\b.*-->"),
        end: new RegExp("^\\s*<!--\\s*#?endregion\\b.*-->")
      }
    }
  };
  var language = {
    defaultToken: "",
    tokenPostfix: ".md",
    control: /[\\`*_\[\]{}()#+\-\.!]/,
    noncontrol: /[^\\`*_\[\]{}()#+\-\.!]/,
    escapes: /\\(?:@control)/,
    jsescapes: /\\(?:[btnfr\\"']|[0-7][0-7]?|[0-3][0-7]{2})/,
    empty: [
      "area",
      "base",
      "basefont",
      "br",
      "col",
      "frame",
      "hr",
      "img",
      "input",
      "isindex",
      "link",
      "meta",
      "param"
    ],
    tokenizer: {
      root: [
        [/^\s*\|/, "@rematch", "@table_header"],
        [/^(\s{0,3})(#+)((?:[^\\#]|@escapes)+)((?:#+)?)/, ["white", "keyword", "keyword", "keyword"]],
        [/^\s*(=+|\-+)\s*$/, "keyword"],
        [/^\s*((\*[ ]?)+)\s*$/, "meta.separator"],
        [/^\s*>+/, "comment"],
        [/^\s*([\*\-+:]|\d+\.)\s/, "keyword"],
        [/^(\t|[ ]{4})[^ ].*$/, "string"],
        [/^\s*~~~\s*((?:\w|[\/\-#])+)?\s*$/, { token: "string", next: "@codeblock" }],
        [
          /^\s*```\s*((?:\w|[\/\-#])+).*$/,
          { token: "string", next: "@codeblockgh", nextEmbedded: "$1" }
        ],
        [/^\s*```\s*$/, { token: "string", next: "@codeblock" }],
        { include: "@linecontent" }
      ],
      table_header: [
        { include: "@table_common" },
        [/[^\|]+/, "keyword.table.header"]
      ],
      table_body: [{ include: "@table_common" }, { include: "@linecontent" }],
      table_common: [
        [/\s*[\-:]+\s*/, { token: "keyword", switchTo: "table_body" }],
        [/^\s*\|/, "keyword.table.left"],
        [/^\s*[^\|]/, "@rematch", "@pop"],
        [/^\s*$/, "@rematch", "@pop"],
        [
          /\|/,
          {
            cases: {
              "@eos": "keyword.table.right",
              "@default": "keyword.table.middle"
            }
          }
        ]
      ],
      codeblock: [
        [/^\s*~~~\s*$/, { token: "string", next: "@pop" }],
        [/^\s*```\s*$/, { token: "string", next: "@pop" }],
        [/.*$/, "variable.source"]
      ],
      codeblockgh: [
        [/```\s*$/, { token: "string", next: "@pop", nextEmbedded: "@pop" }],
        [/[^`]+/, "variable.source"]
      ],
      linecontent: [
        [/&\w+;/, "string.escape"],
        [/@escapes/, "escape"],
        [/\b__([^\\_]|@escapes|_(?!_))+__\b/, "strong"],
        [/\*\*([^\\*]|@escapes|\*(?!\*))+\*\*/, "strong"],
        [/\b_[^_]+_\b/, "emphasis"],
        [/\*([^\\*]|@escapes)+\*/, "emphasis"],
        [/`([^\\`]|@escapes)+`/, "variable"],
        [/\{+[^}]+\}+/, "string.target"],
        [/(!?\[)((?:[^\]\\]|@escapes)*)(\]\([^\)]+\))/, ["string.link", "", "string.link"]],
        [/(!?\[)((?:[^\]\\]|@escapes)*)(\])/, "string.link"],
        { include: "html" }
      ],
      html: [
        [/<(\w+)\/>/, "tag"],
        [
          /<(\w+)(\-|\w)*/,
          {
            cases: {
              "@empty": { token: "tag", next: "@tag.$1" },
              "@default": { token: "tag", next: "@tag.$1" }
            }
          }
        ],
        [/<\/(\w+)(\-|\w)*\s*>/, { token: "tag" }],
        [/<!--/, "comment", "@comment"]
      ],
      comment: [
        [/[^<\-]+/, "comment.content"],
        [/-->/, "comment", "@pop"],
        [/<!--/, "comment.content.invalid"],
        [/[<\-]/, "comment.content"]
      ],
      tag: [
        [/[ \t\r\n]+/, "white"],
        [
          /(type)(\s*=\s*)(")([^"]+)(")/,
          [
            "attribute.name.html",
            "delimiter.html",
            "string.html",
            { token: "string.html", switchTo: "@tag.$S2.$4" },
            "string.html"
          ]
        ],
        [
          /(type)(\s*=\s*)(')([^']+)(')/,
          [
            "attribute.name.html",
            "delimiter.html",
            "string.html",
            { token: "string.html", switchTo: "@tag.$S2.$4" },
            "string.html"
          ]
        ],
        [/(\w+)(\s*=\s*)("[^"]*"|'[^']*')/, ["attribute.name.html", "delimiter.html", "string.html"]],
        [/\w+/, "attribute.name.html"],
        [/\/>/, "tag", "@pop"],
        [
          />/,
          {
            cases: {
              "$S2==style": {
                token: "tag",
                switchTo: "embeddedStyle",
                nextEmbedded: "text/css"
              },
              "$S2==script": {
                cases: {
                  $S3: {
                    token: "tag",
                    switchTo: "embeddedScript",
                    nextEmbedded: "$S3"
                  },
                  "@default": {
                    token: "tag",
                    switchTo: "embeddedScript",
                    nextEmbedded: "text/javascript"
                  }
                }
              },
              "@default": { token: "tag", next: "@pop" }
            }
          }
        ]
      ],
      embeddedStyle: [
        [/[^<]+/, ""],
        [/<\/style\s*>/, { token: "@rematch", next: "@pop", nextEmbedded: "@pop" }],
        [/</, ""]
      ],
      embeddedScript: [
        [/[^<]+/, ""],
        [/<\/script\s*>/, { token: "@rematch", next: "@pop", nextEmbedded: "@pop" }],
        [/</, ""]
      ]
    }
  };
  return __toCommonJS(markdown_exports);
})();
return moduleExports;
});
