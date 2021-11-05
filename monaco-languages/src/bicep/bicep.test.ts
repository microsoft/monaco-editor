/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* To generate an initial baseline from a .bicep file, uncomment:

import { testTokenization } from '../test/testRunner';
import { readFileSync } from 'fs';

const lines = readFileSync('/Users/ant/Code/bicep/src/monarch/test/baselines/basic.bicep', { encoding: 'utf-8' }).split(/\r?\n/);

testTokenization('bicep', [
  lines.map(line => ({
    line,
    tokens: [],
  }))
]);
*/

import { testTokenization } from '../test/testRunner';

testTokenization('bicep', [
	[
		// https://github.com/Azure/bicep/blob/bc9fc9ce09d1d8da21144d84db01655e042e74bf/src/monarch/test/baselines/comments.bicep
		{
			line: '',
			tokens: []
		},
		{
			line: "resource test 'Microsoft.AAD/domainServices@2021-03-01' = {",
			tokens: [
				{ startIndex: 0, type: 'keyword.bicep' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'identifier.bicep' },
				{ startIndex: 13, type: '' },
				{ startIndex: 14, type: 'string.quote.bicep' },
				{ startIndex: 15, type: 'string.bicep' },
				{ startIndex: 55, type: '' }
			]
		},
		{
			line: "  name: 'asdfsdf'",
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'identifier.bicep' },
				{ startIndex: 6, type: '' },
				{ startIndex: 8, type: 'string.quote.bicep' },
				{ startIndex: 9, type: 'string.bicep' }
			]
		},
		{
			line: '  // this is a comment',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'comment.bicep' }
			]
		},
		{
			line: '  properties: {/*comment*/',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'identifier.bicep' },
				{ startIndex: 12, type: '' },
				{ startIndex: 15, type: 'comment.bicep' }
			]
		},
		{
			line: "    domainConfigurationType/*comment*/:/*comment*/'as//notacomment!d/* also not a comment */fsdf'// test!/*",
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'identifier.bicep' },
				{ startIndex: 27, type: 'comment.bicep' },
				{ startIndex: 38, type: '' },
				{ startIndex: 39, type: 'comment.bicep' },
				{ startIndex: 50, type: 'string.quote.bicep' },
				{ startIndex: 51, type: 'string.bicep' },
				{ startIndex: 97, type: 'comment.bicep' }
			]
		},
		{
			line: '    /* multi',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'comment.bicep' }
			]
		},
		{
			line: '    line',
			tokens: [{ startIndex: 0, type: 'comment.bicep' }]
		},
		{
			line: '    comment */ domainName: /*',
			tokens: [
				{ startIndex: 0, type: 'comment.bicep' },
				{ startIndex: 14, type: '' },
				{ startIndex: 15, type: 'identifier.bicep' },
				{ startIndex: 25, type: '' },
				{ startIndex: 27, type: 'comment.bicep' }
			]
		},
		{
			line: "    asdf*/'test'",
			tokens: [
				{ startIndex: 0, type: 'comment.bicep' },
				{ startIndex: 10, type: 'string.quote.bicep' },
				{ startIndex: 11, type: 'string.bicep' }
			]
		},
		{
			line: '    // comment',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'comment.bicep' }
			]
		},
		{
			line: '  }',
			tokens: [{ startIndex: 0, type: '' }]
		},
		{
			line: '}',
			tokens: [{ startIndex: 0, type: '' }]
		},
		{
			line: '',
			tokens: []
		}
	],
	[
		// https://github.com/Azure/bicep/blob/bc9fc9ce09d1d8da21144d84db01655e042e74bf/src/monarch/test/baselines/basic.bicep
		{
			line: '// test',
			tokens: [{ startIndex: 0, type: 'comment.bicep' }]
		},
		{
			line: '/* test 2 */',
			tokens: [{ startIndex: 0, type: 'comment.bicep' }]
		},
		{
			line: "targetScope = 'resourceGroup'",
			tokens: [
				{ startIndex: 0, type: 'keyword.bicep' },
				{ startIndex: 11, type: '' },
				{ startIndex: 14, type: 'string.quote.bicep' },
				{ startIndex: 15, type: 'string.bicep' }
			]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: "resource avcsdd 'Microsoft.Cache/redis@2020-06-01' = { // line comment",
			tokens: [
				{ startIndex: 0, type: 'keyword.bicep' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'identifier.bicep' },
				{ startIndex: 15, type: '' },
				{ startIndex: 16, type: 'string.quote.bicep' },
				{ startIndex: 17, type: 'string.bicep' },
				{ startIndex: 50, type: '' },
				{ startIndex: 55, type: 'comment.bicep' }
			]
		},
		{
			line: "  name: 'def' /* block",
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'identifier.bicep' },
				{ startIndex: 6, type: '' },
				{ startIndex: 8, type: 'string.quote.bicep' },
				{ startIndex: 9, type: 'string.bicep' },
				{ startIndex: 13, type: '' },
				{ startIndex: 14, type: 'comment.bicep' }
			]
		},
		{
			line: '  comment */',
			tokens: [{ startIndex: 0, type: 'comment.bicep' }]
		},
		{
			line: "  location: 'somewhere'",
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'identifier.bicep' },
				{ startIndex: 10, type: '' },
				{ startIndex: 12, type: 'string.quote.bicep' },
				{ startIndex: 13, type: 'string.bicep' }
			]
		},
		{
			line: '  properties: {',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'identifier.bicep' },
				{ startIndex: 12, type: '' }
			]
		},
		{
			line: '    sku: {',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'identifier.bicep' },
				{ startIndex: 7, type: '' }
			]
		},
		{
			line: '      capacity: 123',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 6, type: 'identifier.bicep' },
				{ startIndex: 14, type: '' },
				{ startIndex: 16, type: 'number.bicep' }
			]
		},
		{
			line: "      family: 'C'",
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 6, type: 'identifier.bicep' },
				{ startIndex: 12, type: '' },
				{ startIndex: 14, type: 'string.quote.bicep' },
				{ startIndex: 15, type: 'string.bicep' }
			]
		},
		{
			line: "      name: 'Basic'",
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 6, type: 'identifier.bicep' },
				{ startIndex: 10, type: '' },
				{ startIndex: 12, type: 'string.quote.bicep' },
				{ startIndex: 13, type: 'string.bicep' }
			]
		},
		{
			line: '    }',
			tokens: [{ startIndex: 0, type: '' }]
		},
		{
			line: '  }',
			tokens: [{ startIndex: 0, type: '' }]
		},
		{
			line: '}',
			tokens: [{ startIndex: 0, type: '' }]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: 'var secretsObject = {',
			tokens: [
				{ startIndex: 0, type: 'keyword.bicep' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.bicep' },
				{ startIndex: 17, type: '' }
			]
		},
		{
			line: '  secrets: [',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'identifier.bicep' },
				{ startIndex: 9, type: '' }
			]
		},
		{
			line: "    'abc'",
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'string.quote.bicep' },
				{ startIndex: 5, type: 'string.bicep' }
			]
		},
		{
			line: "    'def'",
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'string.quote.bicep' },
				{ startIndex: 5, type: 'string.bicep' }
			]
		},
		{
			line: '  ]',
			tokens: [{ startIndex: 0, type: '' }]
		},
		{
			line: '}',
			tokens: [{ startIndex: 0, type: '' }]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: "var parent = 'abc'",
			tokens: [
				{ startIndex: 0, type: 'keyword.bicep' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.bicep' },
				{ startIndex: 10, type: '' },
				{ startIndex: 13, type: 'string.quote.bicep' },
				{ startIndex: 14, type: 'string.bicep' }
			]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: "resource secrets0 'Microsoft.KeyVault/vaults/secrets@2018-02-14' = {",
			tokens: [
				{ startIndex: 0, type: 'keyword.bicep' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'identifier.bicep' },
				{ startIndex: 17, type: '' },
				{ startIndex: 18, type: 'string.quote.bicep' },
				{ startIndex: 19, type: 'string.bicep' },
				{ startIndex: 64, type: '' }
			]
		},
		{
			line: "  name: '${parent}/child'",
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'identifier.bicep' },
				{ startIndex: 6, type: '' },
				{ startIndex: 8, type: 'string.quote.bicep' },
				{ startIndex: 9, type: 'delimiter.bracket.bicep' },
				{ startIndex: 11, type: 'identifier.bicep' },
				{ startIndex: 17, type: 'delimiter.bracket.bicep' },
				{ startIndex: 18, type: 'string.bicep' }
			]
		},
		{
			line: '  properties: {',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'identifier.bicep' },
				{ startIndex: 12, type: '' }
			]
		},
		{
			line: '    attributes:  {',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'identifier.bicep' },
				{ startIndex: 14, type: '' }
			]
		},
		{
			line: '      enabled: true',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 6, type: 'identifier.bicep' },
				{ startIndex: 13, type: '' },
				{ startIndex: 15, type: 'keyword.bicep' }
			]
		},
		{
			line: '    }',
			tokens: [{ startIndex: 0, type: '' }]
		},
		{
			line: '  }',
			tokens: [{ startIndex: 0, type: '' }]
		},
		{
			line: '}',
			tokens: [{ startIndex: 0, type: '' }]
		},
		{
			line: "resource secrets1 'Microsoft.KeyVault/vaults/secrets@2018-02-14' = if (secrets0.id == '') {",
			tokens: [
				{ startIndex: 0, type: 'keyword.bicep' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'identifier.bicep' },
				{ startIndex: 17, type: '' },
				{ startIndex: 18, type: 'string.quote.bicep' },
				{ startIndex: 19, type: 'string.bicep' },
				{ startIndex: 64, type: '' },
				{ startIndex: 67, type: 'keyword.bicep' },
				{ startIndex: 69, type: '' },
				{ startIndex: 71, type: 'identifier.bicep' },
				{ startIndex: 79, type: '' },
				{ startIndex: 80, type: 'identifier.bicep' },
				{ startIndex: 82, type: '' },
				{ startIndex: 86, type: 'string.quote.bicep' },
				{ startIndex: 87, type: 'string.bicep' },
				{ startIndex: 88, type: '' }
			]
		},
		{
			line: "  name: '${parent}/child1'",
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'identifier.bicep' },
				{ startIndex: 6, type: '' },
				{ startIndex: 8, type: 'string.quote.bicep' },
				{ startIndex: 9, type: 'delimiter.bracket.bicep' },
				{ startIndex: 11, type: 'identifier.bicep' },
				{ startIndex: 17, type: 'delimiter.bracket.bicep' },
				{ startIndex: 18, type: 'string.bicep' }
			]
		},
		{
			line: '  properties: {',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'identifier.bicep' },
				{ startIndex: 12, type: '' }
			]
		},
		{
			line: '  }',
			tokens: [{ startIndex: 0, type: '' }]
		},
		{
			line: '}',
			tokens: [{ startIndex: 0, type: '' }]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: "resource secrets2 'Microsoft.KeyVault/vaults/secrets@2018-02-14' = [for secret in secretsObject.secrets: {",
			tokens: [
				{ startIndex: 0, type: 'keyword.bicep' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'identifier.bicep' },
				{ startIndex: 17, type: '' },
				{ startIndex: 18, type: 'string.quote.bicep' },
				{ startIndex: 19, type: 'string.bicep' },
				{ startIndex: 64, type: '' },
				{ startIndex: 68, type: 'keyword.bicep' },
				{ startIndex: 71, type: '' },
				{ startIndex: 72, type: 'identifier.bicep' },
				{ startIndex: 78, type: '' },
				{ startIndex: 79, type: 'keyword.bicep' },
				{ startIndex: 81, type: '' },
				{ startIndex: 82, type: 'identifier.bicep' },
				{ startIndex: 95, type: '' },
				{ startIndex: 96, type: 'identifier.bicep' },
				{ startIndex: 103, type: '' }
			]
		},
		{
			line: "  name: 'asdfsd/forloop'",
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'identifier.bicep' },
				{ startIndex: 6, type: '' },
				{ startIndex: 8, type: 'string.quote.bicep' },
				{ startIndex: 9, type: 'string.bicep' }
			]
		},
		{
			line: '  properties: {}',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'identifier.bicep' },
				{ startIndex: 12, type: '' }
			]
		},
		{
			line: '}]',
			tokens: [{ startIndex: 0, type: '' }]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: "resource secrets3 'Microsoft.KeyVault/vaults/secrets@2018-02-14' = [for secret in secretsObject.secrets: {",
			tokens: [
				{ startIndex: 0, type: 'keyword.bicep' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'identifier.bicep' },
				{ startIndex: 17, type: '' },
				{ startIndex: 18, type: 'string.quote.bicep' },
				{ startIndex: 19, type: 'string.bicep' },
				{ startIndex: 64, type: '' },
				{ startIndex: 68, type: 'keyword.bicep' },
				{ startIndex: 71, type: '' },
				{ startIndex: 72, type: 'identifier.bicep' },
				{ startIndex: 78, type: '' },
				{ startIndex: 79, type: 'keyword.bicep' },
				{ startIndex: 81, type: '' },
				{ startIndex: 82, type: 'identifier.bicep' },
				{ startIndex: 95, type: '' },
				{ startIndex: 96, type: 'identifier.bicep' },
				{ startIndex: 103, type: '' }
			]
		},
		{
			line: "  name: 'jk${true}asdf${23}.\\${SDF${secretsObject['secrets'][1]}'",
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'identifier.bicep' },
				{ startIndex: 6, type: '' },
				{ startIndex: 8, type: 'string.quote.bicep' },
				{ startIndex: 9, type: 'string.bicep' },
				{ startIndex: 11, type: 'delimiter.bracket.bicep' },
				{ startIndex: 13, type: 'keyword.bicep' },
				{ startIndex: 17, type: 'delimiter.bracket.bicep' },
				{ startIndex: 18, type: 'string.bicep' },
				{ startIndex: 22, type: 'delimiter.bracket.bicep' },
				{ startIndex: 24, type: 'number.bicep' },
				{ startIndex: 26, type: 'delimiter.bracket.bicep' },
				{ startIndex: 27, type: 'string.bicep' },
				{ startIndex: 28, type: 'string.escape.bicep' },
				{ startIndex: 31, type: 'string.bicep' },
				{ startIndex: 34, type: 'delimiter.bracket.bicep' },
				{ startIndex: 36, type: 'identifier.bicep' },
				{ startIndex: 49, type: '' },
				{ startIndex: 50, type: 'string.quote.bicep' },
				{ startIndex: 51, type: 'string.bicep' },
				{ startIndex: 59, type: '' },
				{ startIndex: 61, type: 'number.bicep' },
				{ startIndex: 62, type: '' },
				{ startIndex: 63, type: 'delimiter.bracket.bicep' },
				{ startIndex: 64, type: 'string.bicep' }
			]
		},
		{
			line: '  properties: {',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'identifier.bicep' },
				{ startIndex: 12, type: '' }
			]
		},
		{
			line: '  }',
			tokens: [{ startIndex: 0, type: '' }]
		},
		{
			line: '}]',
			tokens: [{ startIndex: 0, type: '' }]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: "resource secrets4 'Microsoft.KeyVault/vaults/secrets@2018-02-14' = [for secret in secretsObject.secrets: if (true) {",
			tokens: [
				{ startIndex: 0, type: 'keyword.bicep' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'identifier.bicep' },
				{ startIndex: 17, type: '' },
				{ startIndex: 18, type: 'string.quote.bicep' },
				{ startIndex: 19, type: 'string.bicep' },
				{ startIndex: 64, type: '' },
				{ startIndex: 68, type: 'keyword.bicep' },
				{ startIndex: 71, type: '' },
				{ startIndex: 72, type: 'identifier.bicep' },
				{ startIndex: 78, type: '' },
				{ startIndex: 79, type: 'keyword.bicep' },
				{ startIndex: 81, type: '' },
				{ startIndex: 82, type: 'identifier.bicep' },
				{ startIndex: 95, type: '' },
				{ startIndex: 96, type: 'identifier.bicep' },
				{ startIndex: 103, type: '' },
				{ startIndex: 105, type: 'keyword.bicep' },
				{ startIndex: 107, type: '' },
				{ startIndex: 109, type: 'keyword.bicep' },
				{ startIndex: 113, type: '' }
			]
		},
		{
			line: "  'name': 'test'",
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'string.quote.bicep' },
				{ startIndex: 3, type: 'string.bicep' },
				{ startIndex: 8, type: '' },
				{ startIndex: 10, type: 'string.quote.bicep' },
				{ startIndex: 11, type: 'string.bicep' }
			]
		},
		{
			line: '  properties:{',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'identifier.bicep' },
				{ startIndex: 12, type: '' }
			]
		},
		{
			line: '  }',
			tokens: [{ startIndex: 0, type: '' }]
		},
		{
			line: '}]',
			tokens: [{ startIndex: 0, type: '' }]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: "resource virtualNetwork 'Microsoft.Network/virtualNetworks@2020-08-01' existing = {",
			tokens: [
				{ startIndex: 0, type: 'keyword.bicep' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'identifier.bicep' },
				{ startIndex: 23, type: '' },
				{ startIndex: 24, type: 'string.quote.bicep' },
				{ startIndex: 25, type: 'string.bicep' },
				{ startIndex: 70, type: '' },
				{ startIndex: 71, type: 'keyword.bicep' },
				{ startIndex: 79, type: '' }
			]
		},
		{
			line: "  name: 'myVnet'",
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'identifier.bicep' },
				{ startIndex: 6, type: '' },
				{ startIndex: 8, type: 'string.quote.bicep' },
				{ startIndex: 9, type: 'string.bicep' }
			]
		},
		{
			line: '}',
			tokens: [{ startIndex: 0, type: '' }]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: "var multi = ''''''",
			tokens: [
				{ startIndex: 0, type: 'keyword.bicep' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.bicep' },
				{ startIndex: 9, type: '' },
				{ startIndex: 12, type: 'string.quote.bicep' }
			]
		},
		{
			line: "var multi2 = '''",
			tokens: [
				{ startIndex: 0, type: 'keyword.bicep' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.bicep' },
				{ startIndex: 10, type: '' },
				{ startIndex: 13, type: 'string.quote.bicep' }
			]
		},
		{
			line: '      hello!',
			tokens: [{ startIndex: 0, type: 'string.bicep' }]
		},
		{
			line: "'''",
			tokens: [{ startIndex: 0, type: 'string.quote.bicep' }]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: 'var func = resourceGroup().location',
			tokens: [
				{ startIndex: 0, type: 'keyword.bicep' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.bicep' },
				{ startIndex: 8, type: '' },
				{ startIndex: 11, type: 'identifier.bicep' },
				{ startIndex: 24, type: '' },
				{ startIndex: 27, type: 'identifier.bicep' }
			]
		},
		{
			line: "var func2 = reference('Microsoft.KeyVault/vaults/secrets', func)",
			tokens: [
				{ startIndex: 0, type: 'keyword.bicep' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.bicep' },
				{ startIndex: 9, type: '' },
				{ startIndex: 12, type: 'identifier.bicep' },
				{ startIndex: 21, type: '' },
				{ startIndex: 22, type: 'string.quote.bicep' },
				{ startIndex: 23, type: 'string.bicep' },
				{ startIndex: 57, type: '' },
				{ startIndex: 59, type: 'identifier.bicep' },
				{ startIndex: 63, type: '' }
			]
		},
		{
			line: 'var func3 = union({',
			tokens: [
				{ startIndex: 0, type: 'keyword.bicep' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.bicep' },
				{ startIndex: 9, type: '' },
				{ startIndex: 12, type: 'identifier.bicep' },
				{ startIndex: 17, type: '' }
			]
		},
		{
			line: "  'abc': resourceGroup().id",
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'string.quote.bicep' },
				{ startIndex: 3, type: 'string.bicep' },
				{ startIndex: 7, type: '' },
				{ startIndex: 9, type: 'identifier.bicep' },
				{ startIndex: 22, type: '' },
				{ startIndex: 25, type: 'identifier.bicep' }
			]
		},
		{
			line: '}, {',
			tokens: [{ startIndex: 0, type: '' }]
		},
		{
			line: "  'def': 'test'",
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'string.quote.bicep' },
				{ startIndex: 3, type: 'string.bicep' },
				{ startIndex: 7, type: '' },
				{ startIndex: 9, type: 'string.quote.bicep' },
				{ startIndex: 10, type: 'string.bicep' }
			]
		},
		{
			line: '})',
			tokens: [{ startIndex: 0, type: '' }]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: '@allowed([',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 1, type: 'identifier.bicep' },
				{ startIndex: 8, type: '' }
			]
		},
		{
			line: "  'hello!'",
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'string.quote.bicep' },
				{ startIndex: 3, type: 'string.bicep' }
			]
		},
		{
			line: "  'hi!'",
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'string.quote.bicep' },
				{ startIndex: 3, type: 'string.bicep' }
			]
		},
		{
			line: '])',
			tokens: [{ startIndex: 0, type: '' }]
		},
		{
			line: '@secure()',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 1, type: 'identifier.bicep' },
				{ startIndex: 7, type: '' }
			]
		},
		{
			line: "param secureParam string = 'hello!'",
			tokens: [
				{ startIndex: 0, type: 'keyword.bicep' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'identifier.bicep' },
				{ startIndex: 17, type: '' },
				{ startIndex: 18, type: 'identifier.bicep' },
				{ startIndex: 24, type: '' },
				{ startIndex: 27, type: 'string.quote.bicep' },
				{ startIndex: 28, type: 'string.bicep' }
			]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: "var emojis = '💪😊😈🍕☕'",
			tokens: [
				{ startIndex: 0, type: 'keyword.bicep' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.bicep' },
				{ startIndex: 10, type: '' },
				{ startIndex: 13, type: 'string.quote.bicep' },
				{ startIndex: 14, type: 'string.bicep' }
			]
		},
		{
			line: "var ninjaCat = '🐱‍👤'",
			tokens: [
				{ startIndex: 0, type: 'keyword.bicep' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.bicep' },
				{ startIndex: 12, type: '' },
				{ startIndex: 15, type: 'string.quote.bicep' },
				{ startIndex: 16, type: 'string.bicep' }
			]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: '/* block */',
			tokens: [{ startIndex: 0, type: 'comment.bicep' }]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: '/*',
			tokens: [{ startIndex: 0, type: 'comment.bicep' }]
		},
		{
			line: '朝辞白帝彩云间',
			tokens: [{ startIndex: 0, type: 'comment.bicep' }]
		},
		{
			line: '千里江陵一日还',
			tokens: [{ startIndex: 0, type: 'comment.bicep' }]
		},
		{
			line: '两岸猿声啼不住',
			tokens: [{ startIndex: 0, type: 'comment.bicep' }]
		},
		{
			line: '轻舟已过万重山',
			tokens: [{ startIndex: 0, type: 'comment.bicep' }]
		},
		{
			line: '*/',
			tokens: [{ startIndex: 0, type: 'comment.bicep' }]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: '// greek letters in comment: Π π Φ φ plus emoji 😎',
			tokens: [{ startIndex: 0, type: 'comment.bicep' }]
		},
		{
			line: 'var variousAlphabets = {',
			tokens: [
				{ startIndex: 0, type: 'keyword.bicep' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.bicep' },
				{ startIndex: 20, type: '' }
			]
		},
		{
			line: "  'α': 'α'",
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'string.quote.bicep' },
				{ startIndex: 3, type: 'string.bicep' },
				{ startIndex: 5, type: '' },
				{ startIndex: 7, type: 'string.quote.bicep' },
				{ startIndex: 8, type: 'string.bicep' }
			]
		},
		{
			line: "  'Ωω': [",
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'string.quote.bicep' },
				{ startIndex: 3, type: 'string.bicep' },
				{ startIndex: 6, type: '' }
			]
		},
		{
			line: "    'Θμ'",
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'string.quote.bicep' },
				{ startIndex: 5, type: 'string.bicep' }
			]
		},
		{
			line: '  ]',
			tokens: [{ startIndex: 0, type: '' }]
		},
		{
			line: "  'ążźćłóę': 'Cześć!'",
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'string.quote.bicep' },
				{ startIndex: 3, type: 'string.bicep' },
				{ startIndex: 11, type: '' },
				{ startIndex: 13, type: 'string.quote.bicep' },
				{ startIndex: 14, type: 'string.bicep' }
			]
		},
		{
			line: "  'áéóúñü': '¡Hola!'",
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'string.quote.bicep' },
				{ startIndex: 3, type: 'string.bicep' },
				{ startIndex: 10, type: '' },
				{ startIndex: 12, type: 'string.quote.bicep' },
				{ startIndex: 13, type: 'string.bicep' }
			]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: "  '二头肌': '二头肌'",
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'string.quote.bicep' },
				{ startIndex: 3, type: 'string.bicep' },
				{ startIndex: 7, type: '' },
				{ startIndex: 9, type: 'string.quote.bicep' },
				{ startIndex: 10, type: 'string.bicep' }
			]
		},
		{
			line: '}',
			tokens: [{ startIndex: 0, type: '' }]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: "output concatUnicodeStrings string = concat('Θμ', '二头肌', 'α')",
			tokens: [
				{ startIndex: 0, type: 'keyword.bicep' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'identifier.bicep' },
				{ startIndex: 27, type: '' },
				{ startIndex: 28, type: 'identifier.bicep' },
				{ startIndex: 34, type: '' },
				{ startIndex: 37, type: 'identifier.bicep' },
				{ startIndex: 43, type: '' },
				{ startIndex: 44, type: 'string.quote.bicep' },
				{ startIndex: 45, type: 'string.bicep' },
				{ startIndex: 48, type: '' },
				{ startIndex: 50, type: 'string.quote.bicep' },
				{ startIndex: 51, type: 'string.bicep' },
				{ startIndex: 55, type: '' },
				{ startIndex: 57, type: 'string.quote.bicep' },
				{ startIndex: 58, type: 'string.bicep' },
				{ startIndex: 60, type: '' }
			]
		},
		{
			line: "output interpolateUnicodeStrings string = 'Θμ二${emojis}头肌${ninjaCat}α'",
			tokens: [
				{ startIndex: 0, type: 'keyword.bicep' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'identifier.bicep' },
				{ startIndex: 32, type: '' },
				{ startIndex: 33, type: 'identifier.bicep' },
				{ startIndex: 39, type: '' },
				{ startIndex: 42, type: 'string.quote.bicep' },
				{ startIndex: 43, type: 'string.bicep' },
				{ startIndex: 46, type: 'delimiter.bracket.bicep' },
				{ startIndex: 48, type: 'identifier.bicep' },
				{ startIndex: 54, type: 'delimiter.bracket.bicep' },
				{ startIndex: 55, type: 'string.bicep' },
				{ startIndex: 57, type: 'delimiter.bracket.bicep' },
				{ startIndex: 59, type: 'identifier.bicep' },
				{ startIndex: 67, type: 'delimiter.bracket.bicep' },
				{ startIndex: 68, type: 'string.bicep' }
			]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: '// all of these should produce the same string',
			tokens: [{ startIndex: 0, type: 'comment.bicep' }]
		},
		{
			line: "var surrogate_char      = '𐐷'",
			tokens: [
				{ startIndex: 0, type: 'keyword.bicep' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.bicep' },
				{ startIndex: 18, type: '' },
				{ startIndex: 26, type: 'string.quote.bicep' },
				{ startIndex: 27, type: 'string.bicep' }
			]
		},
		{
			line: "var surrogate_codepoint = '\\u{10437}'",
			tokens: [
				{ startIndex: 0, type: 'keyword.bicep' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.bicep' },
				{ startIndex: 23, type: '' },
				{ startIndex: 26, type: 'string.quote.bicep' },
				{ startIndex: 27, type: 'string.escape.bicep' },
				{ startIndex: 36, type: 'string.bicep' }
			]
		},
		{
			line: "var surrogate_pairs     = '\\u{D801}\\u{DC37}'",
			tokens: [
				{ startIndex: 0, type: 'keyword.bicep' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.bicep' },
				{ startIndex: 19, type: '' },
				{ startIndex: 26, type: 'string.quote.bicep' },
				{ startIndex: 27, type: 'string.escape.bicep' },
				{ startIndex: 43, type: 'string.bicep' }
			]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: '// ascii escapes',
			tokens: [{ startIndex: 0, type: 'comment.bicep' }]
		},
		{
			line: "var hello = '❆ Hello\\u{20}World\\u{21} ❁'",
			tokens: [
				{ startIndex: 0, type: 'keyword.bicep' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.bicep' },
				{ startIndex: 9, type: '' },
				{ startIndex: 12, type: 'string.quote.bicep' },
				{ startIndex: 13, type: 'string.bicep' },
				{ startIndex: 20, type: 'string.escape.bicep' },
				{ startIndex: 26, type: 'string.bicep' },
				{ startIndex: 31, type: 'string.escape.bicep' },
				{ startIndex: 37, type: 'string.bicep' }
			]
		},
		{
			line: '',
			tokens: []
		}
	]
]);
