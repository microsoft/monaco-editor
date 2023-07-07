/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.40.0(83b3cf23ca80c94cccca7c5b3e48351b220f8e35)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/

// src/basic-languages/csp/csp.contribution.ts
import { registerLanguage } from "../_.contribution.js";
registerLanguage({
  id: "csp",
  extensions: [],
  aliases: ["CSP", "csp"],
  loader: () => {
    if (false) {
      return new Promise((resolve, reject) => {
        __require(["vs/basic-languages/csp/csp"], resolve, reject);
      });
    } else {
      return import("./csp.js");
    }
  }
});
