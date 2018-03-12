/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

// Allow for running under nodejs/requirejs in tests
const _monaco: typeof monaco = (typeof monaco === 'undefined' ? (<any>self).monaco : monaco);

interface ILang extends monaco.languages.ILanguageExtensionPoint {
	loader: () => monaco.Promise<ILangImpl>;
}

interface ILangImpl {
	conf: monaco.languages.LanguageConfiguration;
	language: monaco.languages.IMonarchLanguage;
}

let languageDefinitions: { [languageId: string]: ILang } = {};

function _loadLanguage(languageId: string): monaco.Promise<void> {
	const loader = languageDefinitions[languageId].loader;
	return loader().then((mod) => {
		_monaco.languages.setMonarchTokensProvider(languageId, mod.language);
		_monaco.languages.setLanguageConfiguration(languageId, mod.conf);
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
	loader: () => _monaco.Promise.wrap(import('./bat'))
});
registerLanguage({
	id: 'coffeescript',
	extensions: ['.coffee'],
	aliases: ['CoffeeScript', 'coffeescript', 'coffee'],
	mimetypes: ['text/x-coffeescript', 'text/coffeescript'],
	loader: () => _monaco.Promise.wrap(import('./coffee'))
});
registerLanguage({
	id: 'c',
	extensions: ['.c', '.h'],
	aliases: ['C', 'c'],
	loader: () => _monaco.Promise.wrap(import('./cpp'))
});
registerLanguage({
	id: 'cpp',
	extensions: ['.cpp', '.cc', '.cxx', '.hpp', '.hh', '.hxx'],
	aliases: ['C++', 'Cpp', 'cpp'],
	loader: () => _monaco.Promise.wrap(import('./cpp'))
});
registerLanguage({
	id: 'csharp',
	extensions: ['.cs', '.csx'],
	aliases: ['C#', 'csharp'],
	loader: () => _monaco.Promise.wrap(import('./csharp'))
});
registerLanguage({
	id: 'dockerfile',
	extensions: ['.dockerfile'],
	filenames: ['Dockerfile'],
	aliases: ['Dockerfile'],
	loader: () => _monaco.Promise.wrap(import('./dockerfile'))
});
registerLanguage({
	id: 'fsharp',
	extensions: ['.fs', '.fsi', '.ml', '.mli', '.fsx', '.fsscript'],
	aliases: ['F#', 'FSharp', 'fsharp'],
	loader: () => _monaco.Promise.wrap(import('./fsharp'))
});
registerLanguage({
	id: 'go',
	extensions: ['.go'],
	aliases: ['Go'],
	loader: () => _monaco.Promise.wrap(import('./go'))
});
registerLanguage({
	id: 'handlebars',
	extensions: ['.handlebars', '.hbs'],
	aliases: ['Handlebars', 'handlebars'],
	mimetypes: ['text/x-handlebars-template'],
	loader: () => _monaco.Promise.wrap(import('./handlebars'))
});
registerLanguage({
	id: 'html',
	extensions: ['.html', '.htm', '.shtml', '.xhtml', '.mdoc', '.jsp', '.asp', '.aspx', '.jshtm'],
	aliases: ['HTML', 'htm', 'html', 'xhtml'],
	mimetypes: ['text/html', 'text/x-jshtm', 'text/template', 'text/ng-template'],
	loader: () => _monaco.Promise.wrap(import('./html'))
});
registerLanguage({
	id: 'ini',
	extensions: ['.ini', '.properties', '.gitconfig'],
	filenames: ['config', '.gitattributes', '.gitconfig', '.editorconfig'],
	aliases: ['Ini', 'ini'],
	loader: () => _monaco.Promise.wrap(import('./ini'))
});
registerLanguage({
	id: 'pug',
	extensions: ['.jade', '.pug'],
	aliases: ['Pug', 'Jade', 'jade'],
	loader: () => _monaco.Promise.wrap(import('./pug'))
});
registerLanguage({
	id: 'java',
	extensions: ['.java', '.jav'],
	aliases: ['Java', 'java'],
	mimetypes: ['text/x-java-source', 'text/x-java'],
	loader: () => _monaco.Promise.wrap(import('./java'))
});
registerLanguage({
	id: 'lua',
	extensions: ['.lua'],
	aliases: ['Lua', 'lua'],
	loader: () => _monaco.Promise.wrap(import('./lua'))
});
registerLanguage({
	id: 'markdown',
	extensions: ['.md', '.markdown', '.mdown', '.mkdn', '.mkd', '.mdwn', '.mdtxt', '.mdtext'],
	aliases: ['Markdown', 'markdown'],
	loader: () => _monaco.Promise.wrap(import('./markdown'))
});
registerLanguage({
	id: 'msdax',
	extensions: ['.dax', '.msdax'],
	aliases: ['DAX', 'MSDAX'],
	loader: () => _monaco.Promise.wrap(import('./msdax'))
});
registerLanguage({
	id: 'objective-c',
	extensions: ['.m'],
	aliases: ['Objective-C'],
	loader: () => _monaco.Promise.wrap(import('./objective-c'))
});
registerLanguage({
	id: 'postiats',
	extensions: ['.dats', '.sats', '.hats'],
	aliases: ['ATS', 'ATS/Postiats'],
	loader: () => _monaco.Promise.wrap(import('./postiats'))
});
registerLanguage({
	id: 'php',
	extensions: ['.php', '.php4', '.php5', '.phtml', '.ctp'],
	aliases: ['PHP', 'php'],
	mimetypes: ['application/x-php'],
	loader: () => _monaco.Promise.wrap(import('./php'))
});
registerLanguage({
	id: 'powershell',
	extensions: ['.ps1', '.psm1', '.psd1'],
	aliases: ['PowerShell', 'powershell', 'ps', 'ps1'],
	loader: () => _monaco.Promise.wrap(import('./powershell'))
});
registerLanguage({
	id: 'python',
	extensions: ['.py', '.rpy', '.pyw', '.cpy', '.gyp', '.gypi'],
	aliases: ['Python', 'py'],
	firstLine: '^#!/.*\\bpython[0-9.-]*\\b',
	loader: () => _monaco.Promise.wrap(import('./python'))
});
registerLanguage({
	id: 'r',
	extensions: ['.r', '.rhistory', '.rprofile', '.rt'],
	aliases: ['R', 'r'],
	loader: () => _monaco.Promise.wrap(import('./r'))
});
registerLanguage({
	id: 'razor',
	extensions: ['.cshtml'],
	aliases: ['Razor', 'razor'],
	mimetypes: ['text/x-cshtml'],
	loader: () => _monaco.Promise.wrap(import('./razor'))
});
registerLanguage({
	id: 'ruby',
	extensions: ['.rb', '.rbx', '.rjs', '.gemspec', '.pp'],
	filenames: ['rakefile'],
	aliases: ['Ruby', 'rb'],
	loader: () => _monaco.Promise.wrap(import('./ruby'))
});
registerLanguage({
	id: 'swift',
	aliases: ['Swift', 'swift'],
	extensions: ['.swift'],
	mimetypes: ['text/swift'],
	loader: () => _monaco.Promise.wrap(import('./swift'))
});
registerLanguage({
	id: 'sql',
	extensions: ['.sql'],
	aliases: ['SQL'],
	loader: () => _monaco.Promise.wrap(import('./sql'))
});
registerLanguage({
	id: 'vb',
	extensions: ['.vb'],
	aliases: ['Visual Basic', 'vb'],
	loader: () => _monaco.Promise.wrap(import('./vb'))
});
registerLanguage({
	id: 'xml',
	extensions: ['.xml', '.dtd', '.ascx', '.csproj', '.config', '.wxi', '.wxl', '.wxs', '.xaml', '.svg', '.svgz'],
	firstLine: '(\\<\\?xml.*)|(\\<svg)|(\\<\\!doctype\\s+svg)',
	aliases: ['XML', 'xml'],
	mimetypes: ['text/xml', 'application/xml', 'application/xaml+xml', 'application/xml-dtd'],
	loader: () => _monaco.Promise.wrap(import('./xml'))
});
registerLanguage({
	id: 'less',
	extensions: ['.less'],
	aliases: ['Less', 'less'],
	mimetypes: ['text/x-less', 'text/less'],
	loader: () => _monaco.Promise.wrap(import('./less'))
});
registerLanguage({
	id: 'scss',
	extensions: ['.scss'],
	aliases: ['Sass', 'sass', 'scss'],
	mimetypes: ['text/x-scss', 'text/scss'],
	loader: () => _monaco.Promise.wrap(import('./scss'))
});
registerLanguage({
	id: 'css',
	extensions: ['.css'],
	aliases: ['CSS', 'css'],
	mimetypes: ['text/css'],
	loader: () => _monaco.Promise.wrap(import('./css'))
});
registerLanguage({
	id: 'yaml',
	extensions: ['.yaml', '.yml'],
	aliases: ['YAML', 'yaml', 'YML', 'yml'],
	mimetypes: ['application/x-yaml'],
	loader: () => _monaco.Promise.wrap(import('./yaml'))
});
registerLanguage({
	id: 'sol',
	extensions: ['.sol'],
	aliases: ['sol', 'solidity', 'Solidity'],
	loader: () => _monaco.Promise.wrap(import('./solidity'))
});
registerLanguage({
	id: 'sb',
	extensions: ['.sb'],
	aliases: ['Small Basic', 'sb'],
	loader: () => _monaco.Promise.wrap(import('./sb'))
});

registerLanguage({
	id: 'mysql',
	extensions: [],
	aliases: ['MySQL', 'mysql'],
	loader: () => _monaco.Promise.wrap(import('./mysql'))
});

registerLanguage({
	id: 'pgsql',
	extensions: [],
	aliases: ['PostgreSQL', 'postgres', 'pg', 'postgre'],
	loader: () => _monaco.Promise.wrap(import('./pgsql'))
});

registerLanguage({
	id: 'redshift',
	extensions: [],
	aliases: ['Redshift', 'redshift'],
	loader: () => _monaco.Promise.wrap(import('./redshift'))
});

registerLanguage({
	id: 'redis',
	extensions: ['.redis'],
	aliases: ['redis'],
	loader: () => _monaco.Promise.wrap(import('./redis'))
});

registerLanguage({
	id: 'csp',
	extensions: [],
	aliases: ['CSP', 'csp'],
	loader: () => _monaco.Promise.wrap(import('./csp'))
});
