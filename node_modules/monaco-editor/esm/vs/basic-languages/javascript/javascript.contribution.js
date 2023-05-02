/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.38.0(0e330ae453813de4e6cf272460fb79c7117073d0)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/

// src/basic-languages/javascript/javascript.contribution.ts
import { registerLanguage } from "../_.contribution.js";
registerLanguage({
  id: "javascript",
  extensions: [".js", ".es6", ".jsx", ".mjs", ".cjs"],
  firstLine: "^#!.*\\bnode",
  filenames: ["jakefile"],
  aliases: ["JavaScript", "javascript", "js"],
  mimetypes: ["text/javascript"],
  loader: () => {
    if (false) {
      return new Promise((resolve, reject) => {
        __require(["vs/basic-languages/javascript/javascript"], resolve, reject);
      });
    } else {
      return import("./javascript.js");
    }
  }
});
