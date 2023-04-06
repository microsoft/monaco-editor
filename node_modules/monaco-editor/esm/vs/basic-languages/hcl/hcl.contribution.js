/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.37.1(20a8d5a651d057aaed7875ad1c1f2ecf13c4e773)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/

// src/basic-languages/hcl/hcl.contribution.ts
import { registerLanguage } from "../_.contribution.js";
registerLanguage({
  id: "hcl",
  extensions: [".tf", ".tfvars", ".hcl"],
  aliases: ["Terraform", "tf", "HCL", "hcl"],
  loader: () => {
    if (false) {
      return new Promise((resolve, reject) => {
        __require(["vs/basic-languages/hcl/hcl"], resolve, reject);
      });
    } else {
      return import("./hcl.js");
    }
  }
});
