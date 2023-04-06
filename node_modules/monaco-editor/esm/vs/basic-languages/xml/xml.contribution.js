/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.37.1(20a8d5a651d057aaed7875ad1c1f2ecf13c4e773)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/

// src/basic-languages/xml/xml.contribution.ts
import { registerLanguage } from "../_.contribution.js";
registerLanguage({
  id: "xml",
  extensions: [
    ".xml",
    ".xsd",
    ".dtd",
    ".ascx",
    ".csproj",
    ".config",
    ".props",
    ".targets",
    ".wxi",
    ".wxl",
    ".wxs",
    ".xaml",
    ".svg",
    ".svgz",
    ".opf",
    ".xslt",
    ".xsl"
  ],
  firstLine: "(\\<\\?xml.*)|(\\<svg)|(\\<\\!doctype\\s+svg)",
  aliases: ["XML", "xml"],
  mimetypes: ["text/xml", "application/xml", "application/xaml+xml", "application/xml-dtd"],
  loader: () => {
    if (false) {
      return new Promise((resolve, reject) => {
        __require(["vs/basic-languages/xml/xml"], resolve, reject);
      });
    } else {
      return import("./xml.js");
    }
  }
});
