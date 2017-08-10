/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

declare var require: <T>(moduleId: [string], callback: (module: T) => void, error: (err: any) => void) => void;

// Allow for running under nodejs/requirejs in tests
const _monaco: typeof monaco = (typeof monaco === 'undefined' ? (<any>self).monaco : monaco);

interface ILang extends monaco.languages.ILanguageExtensionPoint {
	module: string;
}

interface ILangImpl {
	conf: monaco.languages.LanguageConfiguration;
	language: monaco.languages.IMonarchLanguage;
}

let languageDefinitions: { [languageId: string]: ILang } = {};

function _loadLanguage(languageId: string): monaco.Promise<void> {
	let module = languageDefinitions[languageId].module;
	return new _monaco.Promise<void>((c, e, p) => {
		require<ILangImpl>([module], (mod) => {
			_monaco.languages.setMonarchTokensProvider(languageId, mod.language);
			_monaco.languages.setLanguageConfiguration(languageId, mod.conf);
			c(void 0);
		}, e);
	});
}

let languagePromises: { [languageId: string]: monaco.Promise<void> } = {};

export function loadLanguage(languageId: string): monaco.Promise<void> {
	if (!languagePromises[languageId]) {
		languagePromises[languageId] = _loadLanguage(languageId);
	}
	return languagePromises[languageId];
}

function registerLanguage(def: ILang): void {
	let languageId = def.id;

	languageDefinitions[languageId] = def;
	_monaco.languages.register(def);
	_monaco.languages.onLanguage(languageId, () => {
		loadLanguage(languageId);
	});
}


registerLanguage({
	id: 'bat',
	extensions: ['.bat', '.cmd'],
	aliases: ['Batch', 'bat'],
	module: './bat'
});
registerLanguage({
	id: 'coffeescript',
	extensions: ['.coffee'],
	aliases: ['CoffeeScript', 'coffeescript', 'coffee'],
	mimetypes: ['text/x-coffeescript', 'text/coffeescript'],
	module: './coffee'
});
registerLanguage({
	id: 'c',
	extensions: ['.c', '.h'],
	aliases: ['C', 'c'],
	module: './cpp'
});
registerLanguage({
	id: 'cpp',
	extensions: ['.cpp', '.cc', '.cxx', '.hpp', '.hh', '.hxx'],
	aliases: ['C++', 'Cpp', 'cpp'],
	module: './cpp'
});
registerLanguage({
	id: 'csharp',
	extensions: ['.cs', '.csx'],
	aliases: ['C#', 'csharp'],
	module: './csharp'
});
registerLanguage({
	id: 'dockerfile',
	extensions: ['.dockerfile'],
	filenames: ['Dockerfile'],
	aliases: ['Dockerfile'],
	module: './dockerfile'
});
registerLanguage({
	id: 'fsharp',
	extensions: ['.fs', '.fsi', '.ml', '.mli', '.fsx', '.fsscript'],
	aliases: ['F#', 'FSharp', 'fsharp'],
	module: './fsharp'
});
registerLanguage({
	id: 'go',
	extensions: ['.go'],
	aliases: ['Go'],
	module: './go'
});
registerLanguage({
	id: 'handlebars',
	extensions: ['.handlebars', '.hbs'],
	aliases: ['Handlebars', 'handlebars'],
	mimetypes: ['text/x-handlebars-template'],
	module: './handlebars'
});
registerLanguage({
	id: 'html',
	extensions: ['.html', '.htm', '.shtml', '.xhtml', '.mdoc', '.jsp', '.asp', '.aspx', '.jshtm'],
	aliases: ['HTML', 'htm', 'html', 'xhtml'],
	mimetypes: ['text/html', 'text/x-jshtm', 'text/template', 'text/ng-template'],
	module: './html'
});
registerLanguage({
	id: 'ini',
	extensions: ['.ini', '.properties', '.gitconfig'],
	filenames: ['config', '.gitattributes', '.gitconfig', '.editorconfig'],
	aliases: ['Ini', 'ini'],
	module: './ini'
});
registerLanguage({
	id: 'pug',
	extensions: ['.jade', '.pug'],
	aliases: ['Pug', 'Jade', 'jade'],
	module: './pug'
});
registerLanguage({
	id: 'java',
	extensions: ['.java', '.jav'],
	aliases: ['Java', 'java'],
	mimetypes: ['text/x-java-source', 'text/x-java'],
	module: './java'
});
registerLanguage({
	id: 'lua',
	extensions: ['.lua'],
	aliases: ['Lua', 'lua'],
	module: './lua'
});
registerLanguage({
	id: 'markdown',
	extensions: ['.md', '.markdown', '.mdown', '.mkdn', '.mkd', '.mdwn', '.mdtxt', '.mdtext'],
	aliases: ['Markdown', 'markdown'],
	module: './markdown'
});
registerLanguage({
	id: 'msdax',
	extensions: ['.dax', '.msdax'],
	aliases: ['DAX', 'MSDAX'],
	module: './msdax'
});
registerLanguage({
	id: 'objective-c',
	extensions: ['.m'],
	aliases: ['Objective-C'],
	module: './objective-c'
});
registerLanguage({
	id: 'postiats',
	extensions: ['.dats', '.sats', '.hats'],
	aliases: ['ATS', 'ATS/Postiats'],
	module: './postiats'
});
registerLanguage({
	id: 'php',
	extensions: ['.php', '.php4', '.php5', '.phtml', '.ctp'],
	aliases: ['PHP', 'php'],
	mimetypes: ['application/x-php'],
	module: './php'
});
registerLanguage({
	id: 'powershell',
	extensions: ['.ps1', '.psm1', '.psd1'],
	aliases: ['PowerShell', 'powershell', 'ps', 'ps1'],
	module: './powershell'
});
registerLanguage({
	id: 'python',
	extensions: ['.py', '.rpy', '.pyw', '.cpy', '.gyp', '.gypi'],
	aliases: ['Python', 'py'],
	firstLine: '^#!/.*\\bpython[0-9.-]*\\b',
	module: './python'
});
registerLanguage({
	id: 'r',
	extensions: ['.r', '.rhistory', '.rprofile', '.rt'],
	aliases: ['R', 'r'],
	module: './r'
});
registerLanguage({
	id: 'razor',
	extensions: ['.cshtml'],
	aliases: ['Razor', 'razor'],
	mimetypes: ['text/x-cshtml'],
	module: './razor'
});
registerLanguage({
	id: 'ruby',
	extensions: ['.rb', '.rbx', '.rjs', '.gemspec', '.pp'],
	filenames: ['rakefile'],
	aliases: ['Ruby', 'rb'],
	module: './ruby'
});
registerLanguage({
	id: 'swift',
	aliases: ['Swift', 'swift'],
	extensions: ['.swift'],
	mimetypes: ['text/swift'],
	module: './swift'
});
registerLanguage({
	id: 'sql',
	extensions: ['.sql'],
	aliases: ['SQL'],
	module: './sql'
});
registerLanguage({
	id: 'vb',
	extensions: ['.vb'],
	aliases: ['Visual Basic', 'vb'],
	module: './vb'
});
registerLanguage({
	id: 'xml',
	extensions: ['.xml', '.dtd', '.ascx', '.csproj', '.config', '.wxi', '.wxl', '.wxs', '.xaml', '.svg', '.svgz'],
	firstLine: '(\\<\\?xml.*)|(\\<svg)|(\\<\\!doctype\\s+svg)',
	aliases: ['XML', 'xml'],
	mimetypes: ['text/xml', 'application/xml', 'application/xaml+xml', 'application/xml-dtd'],
	module: './xml'
});
registerLanguage({
	id: 'less',
	extensions: ['.less'],
	aliases: ['Less', 'less'],
	mimetypes: ['text/x-less', 'text/less'],
	module: './less'
});
registerLanguage({
	id: 'scss',
	extensions: ['.scss'],
	aliases: ['Sass', 'sass', 'scss'],
	mimetypes: ['text/x-scss', 'text/scss'],
	module: './scss'
});
registerLanguage({
	id: 'css',
	extensions: ['.css'],
	aliases: ['CSS', 'css'],
	mimetypes: ['text/css'],
	module: './css'
});
registerLanguage({
	id: 'yaml',
	extensions: ['.yaml', '.yml'],
	aliases: ['YAML', 'yaml', 'YML', 'yml'],
	mimetypes: ['application/x-yaml'],
	module: './yaml'
});
registerLanguage({
	id: 'sol',
	extensions: ['.sol'],
	aliases: ['sol', 'solidity', 'Solidity'],
	module: './solidity'
});
registerLanguage({
	id: 'sb',
	extensions: ['.sb'],
	aliases: ['Small Basic', 'sb'],
	module: './sb'
});
