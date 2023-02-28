"use strict";
/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.36.1(6c56744c3419458f0dd48864520b759d1a3a1ca8)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
define("vs/basic-languages/dockerfile/dockerfile", ["require"],(require)=>{
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

  // src/basic-languages/dockerfile/dockerfile.ts
  var dockerfile_exports = {};
  __export(dockerfile_exports, {
    conf: () => conf,
    language: () => language
  });
  var conf = {
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
    tokenPostfix: ".dockerfile",
    variable: /\${?[\w]+}?/,
    tokenizer: {
      root: [
        { include: "@whitespace" },
        { include: "@comment" },
        [/(ONBUILD)(\s+)/, ["keyword", ""]],
        [/(ENV)(\s+)([\w]+)/, ["keyword", "", { token: "variable", next: "@arguments" }]],
        [
          /(FROM|MAINTAINER|RUN|EXPOSE|ENV|ADD|ARG|VOLUME|LABEL|USER|WORKDIR|COPY|CMD|STOPSIGNAL|SHELL|HEALTHCHECK|ENTRYPOINT)/,
          { token: "keyword", next: "@arguments" }
        ]
      ],
      arguments: [
        { include: "@whitespace" },
        { include: "@strings" },
        [
          /(@variable)/,
          {
            cases: {
              "@eos": { token: "variable", next: "@popall" },
              "@default": "variable"
            }
          }
        ],
        [
          /\\/,
          {
            cases: {
              "@eos": "",
              "@default": ""
            }
          }
        ],
        [
          /./,
          {
            cases: {
              "@eos": { token: "", next: "@popall" },
              "@default": ""
            }
          }
        ]
      ],
      whitespace: [
        [
          /\s+/,
          {
            cases: {
              "@eos": { token: "", next: "@popall" },
              "@default": ""
            }
          }
        ]
      ],
      comment: [[/(^#.*$)/, "comment", "@popall"]],
      strings: [
        [/\\'$/, "", "@popall"],
        [/\\'/, ""],
        [/'$/, "string", "@popall"],
        [/'/, "string", "@stringBody"],
        [/"$/, "string", "@popall"],
        [/"/, "string", "@dblStringBody"]
      ],
      stringBody: [
        [
          /[^\\\$']/,
          {
            cases: {
              "@eos": { token: "string", next: "@popall" },
              "@default": "string"
            }
          }
        ],
        [/\\./, "string.escape"],
        [/'$/, "string", "@popall"],
        [/'/, "string", "@pop"],
        [/(@variable)/, "variable"],
        [/\\$/, "string"],
        [/$/, "string", "@popall"]
      ],
      dblStringBody: [
        [
          /[^\\\$"]/,
          {
            cases: {
              "@eos": { token: "string", next: "@popall" },
              "@default": "string"
            }
          }
        ],
        [/\\./, "string.escape"],
        [/"$/, "string", "@popall"],
        [/"/, "string", "@pop"],
        [/(@variable)/, "variable"],
        [/\\$/, "string"],
        [/$/, "string", "@popall"]
      ]
    }
  };
  return __toCommonJS(dockerfile_exports);
})();
return moduleExports;
});
