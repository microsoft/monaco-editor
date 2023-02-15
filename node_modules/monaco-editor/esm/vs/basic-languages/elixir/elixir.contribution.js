/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.35.0(71ac097e6155a405f6be52b0b368a04508c31e31)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/

// src/basic-languages/elixir/elixir.contribution.ts
import { registerLanguage } from "../_.contribution.js";
registerLanguage({
  id: "elixir",
  extensions: [".ex", ".exs"],
  aliases: ["Elixir", "elixir", "ex"],
  loader: () => {
    if (false) {
      return new Promise((resolve, reject) => {
        __require(["vs/basic-languages/elixir/elixir"], resolve, reject);
      });
    } else {
      return import("./elixir.js");
    }
  }
});
