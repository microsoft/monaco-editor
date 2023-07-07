"use strict";
/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.40.0(83b3cf23ca80c94cccca7c5b3e48351b220f8e35)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
define("vs/basic-languages/shell/shell", ["require"],(require)=>{
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

  // src/basic-languages/shell/shell.ts
  var shell_exports = {};
  __export(shell_exports, {
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
      { open: '"', close: '"' },
      { open: "'", close: "'" },
      { open: "`", close: "`" }
    ],
    surroundingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
      { open: "`", close: "`" }
    ]
  };
  var language = {
    defaultToken: "",
    ignoreCase: true,
    tokenPostfix: ".shell",
    brackets: [
      { token: "delimiter.bracket", open: "{", close: "}" },
      { token: "delimiter.parenthesis", open: "(", close: ")" },
      { token: "delimiter.square", open: "[", close: "]" }
    ],
    keywords: [
      "if",
      "then",
      "do",
      "else",
      "elif",
      "while",
      "until",
      "for",
      "in",
      "esac",
      "fi",
      "fin",
      "fil",
      "done",
      "exit",
      "set",
      "unset",
      "export",
      "function"
    ],
    builtins: [
      "ab",
      "awk",
      "bash",
      "beep",
      "cat",
      "cc",
      "cd",
      "chown",
      "chmod",
      "chroot",
      "clear",
      "cp",
      "curl",
      "cut",
      "diff",
      "echo",
      "find",
      "gawk",
      "gcc",
      "get",
      "git",
      "grep",
      "hg",
      "kill",
      "killall",
      "ln",
      "ls",
      "make",
      "mkdir",
      "openssl",
      "mv",
      "nc",
      "node",
      "npm",
      "ping",
      "ps",
      "restart",
      "rm",
      "rmdir",
      "sed",
      "service",
      "sh",
      "shopt",
      "shred",
      "source",
      "sort",
      "sleep",
      "ssh",
      "start",
      "stop",
      "su",
      "sudo",
      "svn",
      "tee",
      "telnet",
      "top",
      "touch",
      "vi",
      "vim",
      "wall",
      "wc",
      "wget",
      "who",
      "write",
      "yes",
      "zsh"
    ],
    startingWithDash: /\-+\w+/,
    identifiersWithDashes: /[a-zA-Z]\w+(?:@startingWithDash)+/,
    symbols: /[=><!~?&|+\-*\/\^;\.,]+/,
    tokenizer: {
      root: [
        [/@identifiersWithDashes/, ""],
        [/(\s)((?:@startingWithDash)+)/, ["white", "attribute.name"]],
        [
          /[a-zA-Z]\w*/,
          {
            cases: {
              "@keywords": "keyword",
              "@builtins": "type.identifier",
              "@default": ""
            }
          }
        ],
        { include: "@whitespace" },
        { include: "@strings" },
        { include: "@parameters" },
        { include: "@heredoc" },
        [/[{}\[\]()]/, "@brackets"],
        [/@symbols/, "delimiter"],
        { include: "@numbers" },
        [/[,;]/, "delimiter"]
      ],
      whitespace: [
        [/\s+/, "white"],
        [/(^#!.*$)/, "metatag"],
        [/(^#.*$)/, "comment"]
      ],
      numbers: [
        [/\d*\.\d+([eE][\-+]?\d+)?/, "number.float"],
        [/0[xX][0-9a-fA-F_]*[0-9a-fA-F]/, "number.hex"],
        [/\d+/, "number"]
      ],
      strings: [
        [/'/, "string", "@stringBody"],
        [/"/, "string", "@dblStringBody"]
      ],
      stringBody: [
        [/'/, "string", "@popall"],
        [/./, "string"]
      ],
      dblStringBody: [
        [/"/, "string", "@popall"],
        [/./, "string"]
      ],
      heredoc: [
        [
          /(<<[-<]?)(\s*)(['"`]?)([\w\-]+)(['"`]?)/,
          [
            "constants",
            "white",
            "string.heredoc.delimiter",
            "string.heredoc",
            "string.heredoc.delimiter"
          ]
        ]
      ],
      parameters: [
        [/\$\d+/, "variable.predefined"],
        [/\$\w+/, "variable"],
        [/\$[*@#?\-$!0_]/, "variable"],
        [/\$'/, "variable", "@parameterBodyQuote"],
        [/\$"/, "variable", "@parameterBodyDoubleQuote"],
        [/\$\(/, "variable", "@parameterBodyParen"],
        [/\$\{/, "variable", "@parameterBodyCurlyBrace"]
      ],
      parameterBodyQuote: [
        [/[^#:%*@\-!_']+/, "variable"],
        [/[#:%*@\-!_]/, "delimiter"],
        [/[']/, "variable", "@pop"]
      ],
      parameterBodyDoubleQuote: [
        [/[^#:%*@\-!_"]+/, "variable"],
        [/[#:%*@\-!_]/, "delimiter"],
        [/["]/, "variable", "@pop"]
      ],
      parameterBodyParen: [
        [/[^#:%*@\-!_)]+/, "variable"],
        [/[#:%*@\-!_]/, "delimiter"],
        [/[)]/, "variable", "@pop"]
      ],
      parameterBodyCurlyBrace: [
        [/[^#:%*@\-!_}]+/, "variable"],
        [/[#:%*@\-!_]/, "delimiter"],
        [/[}]/, "variable", "@pop"]
      ]
    }
  };
  return __toCommonJS(shell_exports);
})();
return moduleExports;
});
