/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.40.0(83b3cf23ca80c94cccca7c5b3e48351b220f8e35)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/

// src/basic-languages/freemarker2/freemarker2.contribution.ts
import { registerLanguage } from "../_.contribution.js";
registerLanguage({
  id: "freemarker2",
  extensions: [".ftl", ".ftlh", ".ftlx"],
  aliases: ["FreeMarker2", "Apache FreeMarker2"],
  loader: () => {
    if (false) {
      return new Promise((resolve, reject) => {
        __require(["vs/basic-languages/freemarker2/freemarker2"], resolve, reject);
      }).then((m) => m.TagAngleInterpolationDollar);
    } else {
      return import("./freemarker2.js").then((m) => m.TagAutoInterpolationDollar);
    }
  }
});
registerLanguage({
  id: "freemarker2.tag-angle.interpolation-dollar",
  aliases: ["FreeMarker2 (Angle/Dollar)", "Apache FreeMarker2 (Angle/Dollar)"],
  loader: () => {
    if (false) {
      return new Promise((resolve, reject) => {
        __require(["vs/basic-languages/freemarker2/freemarker2"], resolve, reject);
      }).then((m) => m.TagAngleInterpolationDollar);
    } else {
      return import("./freemarker2.js").then((m) => m.TagAngleInterpolationDollar);
    }
  }
});
registerLanguage({
  id: "freemarker2.tag-bracket.interpolation-dollar",
  aliases: ["FreeMarker2 (Bracket/Dollar)", "Apache FreeMarker2 (Bracket/Dollar)"],
  loader: () => {
    if (false) {
      return new Promise((resolve, reject) => {
        __require(["vs/basic-languages/freemarker2/freemarker2"], resolve, reject);
      }).then((m) => m.TagBracketInterpolationDollar);
    } else {
      return import("./freemarker2.js").then((m) => m.TagBracketInterpolationDollar);
    }
  }
});
registerLanguage({
  id: "freemarker2.tag-angle.interpolation-bracket",
  aliases: ["FreeMarker2 (Angle/Bracket)", "Apache FreeMarker2 (Angle/Bracket)"],
  loader: () => {
    if (false) {
      return new Promise((resolve, reject) => {
        __require(["vs/basic-languages/freemarker2/freemarker2"], resolve, reject);
      }).then((m) => m.TagAngleInterpolationBracket);
    } else {
      return import("./freemarker2.js").then((m) => m.TagAngleInterpolationBracket);
    }
  }
});
registerLanguage({
  id: "freemarker2.tag-bracket.interpolation-bracket",
  aliases: ["FreeMarker2 (Bracket/Bracket)", "Apache FreeMarker2 (Bracket/Bracket)"],
  loader: () => {
    if (false) {
      return new Promise((resolve, reject) => {
        __require(["vs/basic-languages/freemarker2/freemarker2"], resolve, reject);
      }).then((m) => m.TagBracketInterpolationBracket);
    } else {
      return import("./freemarker2.js").then((m) => m.TagBracketInterpolationBracket);
    }
  }
});
registerLanguage({
  id: "freemarker2.tag-auto.interpolation-dollar",
  aliases: ["FreeMarker2 (Auto/Dollar)", "Apache FreeMarker2 (Auto/Dollar)"],
  loader: () => {
    if (false) {
      return new Promise((resolve, reject) => {
        __require(["vs/basic-languages/freemarker2/freemarker2"], resolve, reject);
      }).then((m) => m.TagAutoInterpolationDollar);
    } else {
      return import("./freemarker2.js").then((m) => m.TagAutoInterpolationDollar);
    }
  }
});
registerLanguage({
  id: "freemarker2.tag-auto.interpolation-bracket",
  aliases: ["FreeMarker2 (Auto/Bracket)", "Apache FreeMarker2 (Auto/Bracket)"],
  loader: () => {
    if (false) {
      return new Promise((resolve, reject) => {
        __require(["vs/basic-languages/freemarker2/freemarker2"], resolve, reject);
      }).then((m) => m.TagAutoInterpolationBracket);
    } else {
      return import("./freemarker2.js").then((m) => m.TagAutoInterpolationBracket);
    }
  }
});
