/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.38.0(0e330ae453813de4e6cf272460fb79c7117073d0)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/

// src/basic-languages/coffee/coffee.contribution.ts
import { registerLanguage } from "../_.contribution.js";
registerLanguage({
  id: "coffeescript",
  extensions: [".coffee"],
  aliases: ["CoffeeScript", "coffeescript", "coffee"],
  mimetypes: ["text/x-coffeescript", "text/coffeescript"],
  loader: () => {
    if (false) {
      return new Promise((resolve, reject) => {
        __require(["vs/basic-languages/coffee/coffee"], resolve, reject);
      });
    } else {
      return import("./coffee.js");
    }
  }
});
