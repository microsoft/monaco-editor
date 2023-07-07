/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.40.0(83b3cf23ca80c94cccca7c5b3e48351b220f8e35)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/

// src/basic-languages/pla/pla.ts
var conf = {
  comments: {
    lineComment: "#"
  },
  brackets: [
    ["[", "]"],
    ["<", ">"],
    ["(", ")"]
  ],
  autoClosingPairs: [
    { open: "[", close: "]" },
    { open: "<", close: ">" },
    { open: "(", close: ")" }
  ],
  surroundingPairs: [
    { open: "[", close: "]" },
    { open: "<", close: ">" },
    { open: "(", close: ")" }
  ]
};
var language = {
  defaultToken: "",
  tokenPostfix: ".pla",
  brackets: [
    { open: "[", close: "]", token: "delimiter.square" },
    { open: "<", close: ">", token: "delimiter.angle" },
    { open: "(", close: ")", token: "delimiter.parenthesis" }
  ],
  keywords: [
    ".i",
    ".o",
    ".mv",
    ".ilb",
    ".ob",
    ".label",
    ".type",
    ".phase",
    ".pair",
    ".symbolic",
    ".symbolic-output",
    ".kiss",
    ".p",
    ".e",
    ".end"
  ],
  comment: /#.*$/,
  identifier: /[a-zA-Z]+[a-zA-Z0-9_\-]*/,
  plaContent: /[01\-~\|]+/,
  tokenizer: {
    root: [
      { include: "@whitespace" },
      [/@comment/, "comment"],
      [
        /\.([a-zA-Z_\-]+)/,
        {
          cases: {
            "@eos": { token: "keyword.$1" },
            "@keywords": {
              cases: {
                ".type": { token: "keyword.$1", next: "@type" },
                "@default": { token: "keyword.$1", next: "@keywordArg" }
              }
            },
            "@default": { token: "keyword.$1" }
          }
        }
      ],
      [/@identifier/, "identifier"],
      [/@plaContent/, "string"]
    ],
    whitespace: [[/[ \t\r\n]+/, ""]],
    type: [{ include: "@whitespace" }, [/\w+/, { token: "type", next: "@pop" }]],
    keywordArg: [
      [
        /[ \t\r\n]+/,
        {
          cases: {
            "@eos": { token: "", next: "@pop" },
            "@default": ""
          }
        }
      ],
      [/@comment/, "comment", "@pop"],
      [
        /[<>()\[\]]/,
        {
          cases: {
            "@eos": { token: "@brackets", next: "@pop" },
            "@default": "@brackets"
          }
        }
      ],
      [
        /\-?\d+/,
        {
          cases: {
            "@eos": { token: "number", next: "@pop" },
            "@default": "number"
          }
        }
      ],
      [
        /@identifier/,
        {
          cases: {
            "@eos": { token: "identifier", next: "@pop" },
            "@default": "identifier"
          }
        }
      ],
      [
        /[;=]/,
        {
          cases: {
            "@eos": { token: "delimiter", next: "@pop" },
            "@default": "delimiter"
          }
        }
      ]
    ]
  }
};
export {
  conf,
  language
};
