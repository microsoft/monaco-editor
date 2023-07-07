"use strict";
/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.40.0(83b3cf23ca80c94cccca7c5b3e48351b220f8e35)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
define("vs/basic-languages/powershell/powershell", ["require"],(require)=>{
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

  // src/basic-languages/powershell/powershell.ts
  var powershell_exports = {};
  __export(powershell_exports, {
    conf: () => conf,
    language: () => language
  });
  var conf = {
    wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#%\^\&\*\(\)\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
    comments: {
      lineComment: "#",
      blockComment: ["<#", "#>"]
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
      { open: '"', close: '"', notIn: ["string"] },
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
        start: new RegExp("^\\s*#region\\b"),
        end: new RegExp("^\\s*#endregion\\b")
      }
    }
  };
  var language = {
    defaultToken: "",
    ignoreCase: true,
    tokenPostfix: ".ps1",
    brackets: [
      { token: "delimiter.curly", open: "{", close: "}" },
      { token: "delimiter.square", open: "[", close: "]" },
      { token: "delimiter.parenthesis", open: "(", close: ")" }
    ],
    keywords: [
      "begin",
      "break",
      "catch",
      "class",
      "continue",
      "data",
      "define",
      "do",
      "dynamicparam",
      "else",
      "elseif",
      "end",
      "exit",
      "filter",
      "finally",
      "for",
      "foreach",
      "from",
      "function",
      "if",
      "in",
      "param",
      "process",
      "return",
      "switch",
      "throw",
      "trap",
      "try",
      "until",
      "using",
      "var",
      "while",
      "workflow",
      "parallel",
      "sequence",
      "inlinescript",
      "configuration"
    ],
    helpKeywords: /SYNOPSIS|DESCRIPTION|PARAMETER|EXAMPLE|INPUTS|OUTPUTS|NOTES|LINK|COMPONENT|ROLE|FUNCTIONALITY|FORWARDHELPTARGETNAME|FORWARDHELPCATEGORY|REMOTEHELPRUNSPACE|EXTERNALHELP/,
    symbols: /[=><!~?&%|+\-*\/\^;\.,]+/,
    escapes: /`(?:[abfnrtv\\"'$]|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    tokenizer: {
      root: [
        [
          /[a-zA-Z_][\w-]*/,
          {
            cases: {
              "@keywords": { token: "keyword.$0" },
              "@default": ""
            }
          }
        ],
        [/[ \t\r\n]+/, ""],
        [/^:\w*/, "metatag"],
        [
          /\$(\{((global|local|private|script|using):)?[\w]+\}|((global|local|private|script|using):)?[\w]+)/,
          "variable"
        ],
        [/<#/, "comment", "@comment"],
        [/#.*$/, "comment"],
        [/[{}()\[\]]/, "@brackets"],
        [/@symbols/, "delimiter"],
        [/\d*\.\d+([eE][\-+]?\d+)?/, "number.float"],
        [/0[xX][0-9a-fA-F_]*[0-9a-fA-F]/, "number.hex"],
        [/\d+?/, "number"],
        [/[;,.]/, "delimiter"],
        [/\@"/, "string", '@herestring."'],
        [/\@'/, "string", "@herestring.'"],
        [
          /"/,
          {
            cases: {
              "@eos": "string",
              "@default": { token: "string", next: '@string."' }
            }
          }
        ],
        [
          /'/,
          {
            cases: {
              "@eos": "string",
              "@default": { token: "string", next: "@string.'" }
            }
          }
        ]
      ],
      string: [
        [
          /[^"'\$`]+/,
          {
            cases: {
              "@eos": { token: "string", next: "@popall" },
              "@default": "string"
            }
          }
        ],
        [
          /@escapes/,
          {
            cases: {
              "@eos": { token: "string.escape", next: "@popall" },
              "@default": "string.escape"
            }
          }
        ],
        [
          /`./,
          {
            cases: {
              "@eos": {
                token: "string.escape.invalid",
                next: "@popall"
              },
              "@default": "string.escape.invalid"
            }
          }
        ],
        [
          /\$[\w]+$/,
          {
            cases: {
              '$S2=="': { token: "variable", next: "@popall" },
              "@default": { token: "string", next: "@popall" }
            }
          }
        ],
        [
          /\$[\w]+/,
          {
            cases: {
              '$S2=="': "variable",
              "@default": "string"
            }
          }
        ],
        [
          /["']/,
          {
            cases: {
              "$#==$S2": { token: "string", next: "@pop" },
              "@default": {
                cases: {
                  "@eos": { token: "string", next: "@popall" },
                  "@default": "string"
                }
              }
            }
          }
        ]
      ],
      herestring: [
        [
          /^\s*(["'])@/,
          {
            cases: {
              "$1==$S2": { token: "string", next: "@pop" },
              "@default": "string"
            }
          }
        ],
        [/[^\$`]+/, "string"],
        [/@escapes/, "string.escape"],
        [/`./, "string.escape.invalid"],
        [
          /\$[\w]+/,
          {
            cases: {
              '$S2=="': "variable",
              "@default": "string"
            }
          }
        ]
      ],
      comment: [
        [/[^#\.]+/, "comment"],
        [/#>/, "comment", "@pop"],
        [/(\.)(@helpKeywords)(?!\w)/, { token: "comment.keyword.$2" }],
        [/[\.#]/, "comment"]
      ]
    }
  };
  return __toCommonJS(powershell_exports);
})();
return moduleExports;
});
