/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const glob = require('glob');
const path = require('path');
const fs = require('fs');

/**
 * @returns { Promise<{ label: string; entry: string; }[]> }
 */
function getBasicLanguages() {
  return new Promise((resolve, reject) => {
    glob('./node_modules/monaco-editor/esm/vs/basic-languages/*/*.contribution.js', { cwd: path.dirname(__dirname) }, (err, files) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(files.map((file) => {
        const entry = file.substring('./node_modules/monaco-editor/esm/'.length).replace(/\.js$/, '');
        const label = path.basename(file).replace(/\.contribution\.js$/, '');
        return {
          label: label,
          entry: entry
        };
      }));
    });
  });
}

/**
 * @returns { Promise<string[]> }
 */
function readAdvancedLanguages() {
  return new Promise((resolve, reject) => {
    glob('./node_modules/monaco-editor/esm/vs/language/*/monaco.contribution.js', { cwd: path.dirname(__dirname) }, (err, files) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(
        files
        .map(file => file.substring('./node_modules/monaco-editor/esm/vs/language/'.length))
        .map(file => file.substring(0, file.length - '/monaco.contribution.js'.length))
      );
    });
  });
}

/**
 * @returns { Promise<{ label: string; entry: string; worker: { id: string; entry: string; }; }[]> }
 */
function getAdvancedLanguages() {
  return readAdvancedLanguages().then((languages) => {
    let result = [];
    for (const lang of languages) {
      let shortLang = (lang === 'typescript' ? 'ts' : lang);
      const entry = `vs/language/${lang}/monaco.contribution`;
      checkFileExists(entry);
      const workerId = `vs/language/${lang}/${shortLang}Worker`;
      checkFileExists(workerId);
      const workerEntry = `vs/language/${lang}/${shortLang}.worker`;
      checkFileExists(workerEntry);
      result.push({
        label: lang,
        entry: entry,
        worker: {
          id: workerId,
          entry: workerEntry
        }
      });
    }
    return result;
  });

  function checkFileExists(moduleName) {
    const filePath = path.join(__dirname, '..', 'node_modules/monaco-editor/esm', `${moduleName}.js`);
    if (!fs.existsSync(filePath)) {
      console.error(`Could not find ${filePath}.`);
      process.exit(1);
    }
  }
}

Promise.all([getBasicLanguages(), getAdvancedLanguages()]).then(([basicLanguages, advancedLanguages]) => {
  basicLanguages.sort(strcmp);
  advancedLanguages.sort(strcmp);

  let i = 0, len = basicLanguages.length;
  let j = 0, lenJ = advancedLanguages.length;
  let result = [];
  while (i < len || j < lenJ) {
    if (i < len && j < lenJ) {
      if (basicLanguages[i].label === advancedLanguages[j].label) {
        let entry = [];
        entry.push(basicLanguages[i].entry);
        entry.push(advancedLanguages[j].entry);
        result.push({
          label: basicLanguages[i].label,
          entry: entry,
          worker: advancedLanguages[j].worker
        });
        i++;
        j++;
      } else if (basicLanguages[i].label < advancedLanguages[j].label) {
        result.push(basicLanguages[i]);
        i++;
      } else {
        result.push(advancedLanguages[j]);
        j++;
      }
    } else if (i < len) {
      result.push(basicLanguages[i]);
      i++;
    } else {
      result.push(advancedLanguages[j]);
      j++;
    }
  }

  const code = `//
// THIS IS A GENERATED FILE. PLEASE DO NOT EDIT DIRECTLY.
// node scripts/import-editor.js
//
import { IFeatureDefinition } from "./types";

const languagesArr: IFeatureDefinition[] = ${
  JSON.stringify(result, null, '  ')
  .replace(/"label":/g, 'label:')
  .replace(/"entry":/g, 'entry:')
  .replace(/"worker":/g, 'worker:')
  .replace(/"id":/g, 'id:')
  .replace(/"/g, '\'')
};

export const languagesById: { [language: string]: IFeatureDefinition; } = {};
languagesArr.forEach(language => languagesById[language.label] = language);
`
  fs.writeFileSync(path.join(__dirname, '../src/languages.ts'), code);
});

function strcmp(a, b) {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
}

// getBasicLanguages().then((basicLanguages) => {
//   console.log(basicLanguages);
// });
// getAdvancedLanguages().then(r => console.log(r));
