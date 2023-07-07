/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.40.0(83b3cf23ca80c94cccca7c5b3e48351b220f8e35)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/

// src/basic-languages/java/java.contribution.ts
import { registerLanguage } from "../_.contribution.js";
registerLanguage({
  id: "java",
  extensions: [".java", ".jav"],
  aliases: ["Java", "java"],
  mimetypes: ["text/x-java-source", "text/x-java"],
  loader: () => {
    if (false) {
      return new Promise((resolve, reject) => {
        __require(["vs/basic-languages/java/java"], resolve, reject);
      });
    } else {
      return import("./java.js");
    }
  }
});
