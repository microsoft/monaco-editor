// The sample below shows how an external library is added
// with exposed global variable of desired type.

monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
	target: monaco.languages.typescript.ScriptTarget.ES6,
	allowNonTsExtensions: true
});

const globalLib = {
    name: 'MyGlobal',
    globals: {MyGlobalVar: 'Aggregator'},
    src: `
export class Aggregator {
    propAggregator1: string;
    aggregates: Derived[];
}

export class Base {
    propBase1: string;
    propBase2: boolean;
}

export class Derived extends Base {
    propDerived1: number;
}`
};

const globalVars = () => {
    let globalDefs = [];
    for (let [key, value] of Object.entries(globalLib.globals)) {
        globalDefs.push(`const ${key}: ${globalLib.name}.${value};`);
    }   
    return globalDefs;
};

monaco.languages.typescript.javascriptDefaults.addExtraLib(globalLib.src, `node_modules/@types/${globalLib.name}/index.d.ts`);
monaco.languages.typescript.javascriptDefaults.addExtraLib(`
   import * as ${globalLib.name} from '${globalLib.name}';
   declare global {
     ${globalVars().join('\n')}
   }
`);

var jsCode = [
	'"use strict";',
	'// Type "MyGlobalVar" below',
    ''
].join('\n');

monaco.editor.create(document.getElementById("container"), {
	value: jsCode,
	language: "javascript"
});
