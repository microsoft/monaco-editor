/** @type {monaco.languages.SemanticTokensLegend} */
const legend = {
	tokenTypes: [
		'comment',
		'string',
		'keyword',
		'number',
		'regexp',
		'operator',
		'namespace',
		'type',
		'struct',
		'class',
		'interface',
		'enum',
		'typeParameter',
		'function',
		'member',
		'macro',
		'variable',
		'parameter',
		'property',
		'label'
	],
	tokenModifiers: [
		'declaration',
		'documentation',
		'readonly',
		'static',
		'abstract',
		'deprecated',
		'modification',
		'async'
	]
};

/** @type {(type: string)=>number} */
function getType(type) {
	return legend.tokenTypes.indexOf(type);
}

/** @type {(modifier: string[]|string|null)=>number} */
function getModifier(modifiers) {
	if (typeof modifiers === 'string') {
		modifiers = [modifiers];
	}
	if (Array.isArray(modifiers)) {
		let nModifiers = 0;
		for (let modifier of modifiers) {
			const nModifier = legend.tokenModifiers.indexOf(modifier);
			if (nModifier > -1) {
				nModifiers |= (1 << nModifier) >>> 0;
			}
		}
		return nModifiers;
	} else {
		return 0;
	}
}

const tokenPattern = new RegExp('([a-zA-Z]+)((?:\\.[a-zA-Z]+)*)', 'g');

monaco.languages.registerDocumentSemanticTokensProvider('plaintext', {
	getLegend: function () {
		return legend;
	},
	provideDocumentSemanticTokens: function (model, lastResultId, token) {
		const lines = model.getLinesContent();

		/** @type {number[]} */
		const data = [];

		let prevLine = 0;
		let prevChar = 0;

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];

			for (let match = null; (match = tokenPattern.exec(line)); ) {
				// translate token and modifiers to number representations
				let type = getType(match[1]);
				if (type === -1) {
					continue;
				}
				let modifier = match[2].length ? getModifier(match[2].split('.').slice(1)) : 0;

				data.push(
					// translate line to deltaLine
					i - prevLine,
					// for the same line, translate start to deltaStart
					prevLine === i ? match.index - prevChar : match.index,
					match[0].length,
					type,
					modifier
				);

				prevLine = i;
				prevChar = match.index;
			}
		}
		return {
			data: new Uint32Array(data),
			resultId: null
		};
	},
	releaseDocumentSemanticTokens: function (resultId) {}
});

// add some missing tokens
monaco.editor.defineTheme('myCustomTheme', {
	base: 'vs',
	inherit: true,
	colors: {},
	rules: [
		{ token: 'comment', foreground: 'aaaaaa', fontStyle: 'italic' },
		{ token: 'keyword', foreground: 'ce63eb' },
		{ token: 'operator', foreground: '000000' },
		{ token: 'namespace', foreground: '66afce' },

		{ token: 'type', foreground: '1db010' },
		{ token: 'struct', foreground: '0000ff' },
		{ token: 'class', foreground: '0000ff', fontStyle: 'bold' },
		{ token: 'interface', foreground: '007700', fontStyle: 'bold' },
		{ token: 'enum', foreground: '0077ff', fontStyle: 'bold' },
		{ token: 'typeParameter', foreground: '1db010' },
		{ token: 'function', foreground: '94763a' },

		{ token: 'member', foreground: '94763a' },
		{ token: 'macro', foreground: '615a60' },
		{ token: 'variable', foreground: '3e5bbf' },
		{ token: 'parameter', foreground: '3e5bbf' },
		{ token: 'property', foreground: '3e5bbf' },
		{ token: 'label', foreground: '615a60' },

		{ token: 'type.static', fontStyle: 'bold' },
		{ token: 'class.static', foreground: 'ff0000', fontStyle: 'bold' }
	]
});

const editor = monaco.editor.create(document.getElementById('container'), {
	value: [
		'Available token types:',
		'    [comment] [string] [keyword] [number] [regexp] [operator] [namespace]',
		'    [type] [struct] [class] [interface] [enum] [typeParameter] [function]',
		'    [member] [macro] [variable] [parameter] [property] [label]',
		'',
		'Available token modifiers:',
		'    [type.declaration] [type.documentation] [type.member] [type.static]',
		'    [type.abstract] [type.deprecated] [type.modification] [type.async]',
		'',
		'Some examples:',
		'    [class.static.token]     [type.static.abstract]',
		'    [class.static.token]     [type.static]',
		'',
		'    [struct]',
		'',
		'    [function.private]',
		'',
		'An error case:',
		'    [notInLegend]'
	].join('\n'),
	language: 'plaintext',
	theme: 'myCustomTheme',
	// semantic tokens provider is disabled by default
	'semanticHighlighting.enabled': true
});
