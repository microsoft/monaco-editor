/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.35.0(71ac097e6155a405f6be52b0b368a04508c31e31)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/

// src/basic-languages/azcli/azcli.ts
var conf = {
  comments: {
    lineComment: "#"
  }
};
var language = {
  defaultToken: "keyword",
  ignoreCase: true,
  tokenPostfix: ".azcli",
  str: /[^#\s]/,
  tokenizer: {
    root: [
      { include: "@comment" },
      [
        /\s-+@str*\s*/,
        {
          cases: {
            "@eos": { token: "key.identifier", next: "@popall" },
            "@default": { token: "key.identifier", next: "@type" }
          }
        }
      ],
      [
        /^-+@str*\s*/,
        {
          cases: {
            "@eos": { token: "key.identifier", next: "@popall" },
            "@default": { token: "key.identifier", next: "@type" }
          }
        }
      ]
    ],
    type: [
      { include: "@comment" },
      [
        /-+@str*\s*/,
        {
          cases: {
            "@eos": { token: "key.identifier", next: "@popall" },
            "@default": "key.identifier"
          }
        }
      ],
      [
        /@str+\s*/,
        {
          cases: {
            "@eos": { token: "string", next: "@popall" },
            "@default": "string"
          }
        }
      ]
    ],
    comment: [
      [
        /#.*$/,
        {
          cases: {
            "@eos": { token: "comment", next: "@popall" }
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
