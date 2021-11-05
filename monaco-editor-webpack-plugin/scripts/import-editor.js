/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const glob = require('glob');
const path = require('path');
const fs = require('fs');

const customFeatureLabels = {
  'vs/editor/browser/controller/coreCommands': 'coreCommands',
  'vs/editor/contrib/caretOperations/caretOperations': 'caretOperations',
  'vs/editor/contrib/caretOperations/transpose': 'transpose',
  'vs/editor/contrib/colorPicker/colorDetector': 'colorDetector',
  'vs/editor/contrib/rename/onTypeRename': 'onTypeRename',
  'vs/editor/contrib/gotoSymbol/link/goToDefinitionAtPosition': 'gotoSymbol',
  'vs/editor/contrib/snippet/snippetController2': 'snippets',
  'vs/editor/standalone/browser/quickAccess/standaloneGotoLineQuickAccess': 'gotoLine',
  'vs/editor/standalone/browser/quickAccess/standaloneCommandsQuickAccess': 'quickCommand',
  'vs/editor/standalone/browser/quickAccess/standaloneGotoSymbolQuickAccess': 'quickOutline',
  'vs/editor/standalone/browser/quickAccess/standaloneHelpQuickAccess': 'quickHelp',
};

generateLanguages();
generateFeatures();

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

function generateLanguages() {
  return Promise.all([getBasicLanguages(), getAdvancedLanguages()]).then(([basicLanguages, advancedLanguages]) => {
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
// GENERATED USING node scripts/import-editor.js
//
import { IFeatureDefinition } from "./types";

export const languagesArr: IFeatureDefinition[] = ${
      JSON.stringify(result, null, '  ')
        .replace(/"label":/g, 'label:')
        .replace(/"entry":/g, 'entry:')
        .replace(/"worker":/g, 'worker:')
        .replace(/"id":/g, 'id:')
        .replace(/"/g, '\'')
      };

export type EditorLanguage = ${
      result.map(el => `'${el.label}'`).join(' | ')
      };

`
    fs.writeFileSync(path.join(__dirname, '../src/languages.ts'), code.replace(/\r\n/g, '\n'));

    const readmeLanguages = (
      JSON.stringify(result.map(r => r.label))
        .replace(/"/g, '\'')
        .replace(/','/g, '\', \'')
    );
    let readme = fs.readFileSync(path.join(__dirname, '../README.md')).toString();
    readme = readme.replace(/<!-- LANGUAGES_BEGIN -->([^<]+)<!-- LANGUAGES_END -->/, `<!-- LANGUAGES_BEGIN -->\`${readmeLanguages}\`<!-- LANGUAGES_END -->`);
    fs.writeFileSync(path.join(__dirname, '../README.md'), readme);
  });
}

function strcmp(a, b) {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
}

/**
 * @returns { string[] }
 */
function generateFeatures() {
  const skipImports = [
    'vs/editor/browser/widget/codeEditorWidget',
    'vs/editor/browser/widget/diffEditorWidget',
    'vs/editor/browser/widget/diffNavigator',
    'vs/editor/common/standaloneStrings',
    'vs/editor/contrib/tokenization/tokenization',
    'vs/editor/editor.all',
    'vs/base/browser/ui/codicons/codiconStyles',
    'vs/editor/contrib/gotoSymbol/documentSymbols',
  ];

  let features = [];
  const files = (
    fs.readFileSync(path.join(__dirname, '../node_modules/monaco-editor/esm/vs/editor/edcore.main.js')).toString()
    + fs.readFileSync(path.join(__dirname, '../node_modules/monaco-editor/esm/vs/editor/editor.all.js')).toString()
  );
  files.split(/\r\n|\n/).forEach(line => {
    const m = line.match(/import '([^']+)'/);
    if (m) {
      const tmp = path.posix.join('vs/editor', m[1]).replace(/\.js$/, '');
      if (skipImports.indexOf(tmp) === -1) {
        features.push(tmp);
      }
    }
  });

  let result = features.map((feature) => {
    return {
      label: customFeatureLabels[feature] || path.basename(path.dirname(feature)),
      entry: feature
    };
  });

  result.sort((a, b) => {
    const labelCmp = strcmp(a.label, b.label);
    if (labelCmp === 0) {
      return strcmp(a.entry, b.entry);
    }
    return labelCmp;
  });

  for (let i = 0; i < result.length; i++) {
    if (i + 1 < result.length && result[i].label === result[i + 1].label) {
      if (typeof result[i].entry === 'string') {
        result[i].entry = [result[i].entry];
      }
      result[i].entry.push(result[i + 1].entry);
      result.splice(i + 1, 1);
    }
  }

  const code = `//
// THIS IS A GENERATED FILE. PLEASE DO NOT EDIT DIRECTLY.
// GENERATED USING node scripts/import-editor.js
//
import { IFeatureDefinition } from "./types";

export const featuresArr: IFeatureDefinition[] = ${
    JSON.stringify(result, null, '  ')
      .replace(/"label":/g, 'label:')
      .replace(/"entry":/g, 'entry:')
      .replace(/"/g, '\'')
    };

export type EditorFeature = ${
    result.map(el => `'${el.label}'`).join(' | ')
    };

export type NegatedEditorFeature = ${
    result.map(el => `'!${el.label}'`).join(' | ')
    };
`
  fs.writeFileSync(path.join(__dirname, '../src/features.ts'), code.replace(/\r\n/g, '\n'));

  const readmeFeatures = (
    JSON.stringify(result.map(r => r.label))
      .replace(/"/g, '\'')
      .replace(/','/g, '\', \'')
  );
  let readme = fs.readFileSync(path.join(__dirname, '../README.md')).toString();
  readme = readme.replace(/<!-- FEATURES_BEGIN -->([^<]+)<!-- FEATURES_END -->/, `<!-- FEATURES_BEGIN -->\`${readmeFeatures}\`<!-- FEATURES_END -->`);
  fs.writeFileSync(path.join(__dirname, '../README.md'), readme);
}
