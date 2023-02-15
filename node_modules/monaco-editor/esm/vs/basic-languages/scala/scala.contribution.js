/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.35.0(71ac097e6155a405f6be52b0b368a04508c31e31)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/

// src/basic-languages/scala/scala.contribution.ts
import { registerLanguage } from "../_.contribution.js";
registerLanguage({
  id: "scala",
  extensions: [".scala", ".sc", ".sbt"],
  aliases: ["Scala", "scala", "SBT", "Sbt", "sbt", "Dotty", "dotty"],
  mimetypes: ["text/x-scala-source", "text/x-scala", "text/x-sbt", "text/x-dotty"],
  loader: () => {
    if (false) {
      return new Promise((resolve, reject) => {
        __require(["vs/basic-languages/scala/scala"], resolve, reject);
      });
    } else {
      return import("./scala.js");
    }
  }
});
