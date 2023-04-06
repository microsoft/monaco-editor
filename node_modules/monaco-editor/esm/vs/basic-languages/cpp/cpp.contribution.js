/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.37.1(20a8d5a651d057aaed7875ad1c1f2ecf13c4e773)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/

// src/basic-languages/cpp/cpp.contribution.ts
import { registerLanguage } from "../_.contribution.js";
registerLanguage({
  id: "c",
  extensions: [".c", ".h"],
  aliases: ["C", "c"],
  loader: () => {
    if (false) {
      return new Promise((resolve, reject) => {
        __require(["vs/basic-languages/cpp/cpp"], resolve, reject);
      });
    } else {
      return import("./cpp.js");
    }
  }
});
registerLanguage({
  id: "cpp",
  extensions: [".cpp", ".cc", ".cxx", ".hpp", ".hh", ".hxx"],
  aliases: ["C++", "Cpp", "cpp"],
  loader: () => {
    if (false) {
      return new Promise((resolve, reject) => {
        __require(["vs/basic-languages/cpp/cpp"], resolve, reject);
      });
    } else {
      return import("./cpp.js");
    }
  }
});
