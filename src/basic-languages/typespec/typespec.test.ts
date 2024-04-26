/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

// Those test were auto generated from the test in the https://github.com/microsoft/typespec repo
// to keep in sync you can follow the instruction in https://github.com/microsoft/typespec/blob/main/packages/monarch/README.md

testTokenization('typespec', [
	[
		{
			line: 'import "@typespec/http";',
			tokens: [
				{
					startIndex: 0,
					type: 'keyword.tsp'
				},
				{
					startIndex: 6,
					type: ''
				},
				{
					startIndex: 7,
					type: 'string.tsp'
				},
				{
					startIndex: 23,
					type: ''
				}
			]
		}
	],
	[
		{
			line: 'using TypeSpec.Http',
			tokens: [
				{
					startIndex: 0,
					type: 'keyword.tsp'
				},
				{
					startIndex: 5,
					type: ''
				},
				{
					startIndex: 6,
					type: 'identifier.tsp'
				},
				{
					startIndex: 14,
					type: ''
				},
				{
					startIndex: 15,
					type: 'identifier.tsp'
				}
			]
		}
	],
	[
		{
			line: 'namespace Foo {}',
			tokens: [
				{
					startIndex: 0,
					type: 'keyword.tsp'
				},
				{
					startIndex: 9,
					type: ''
				},
				{
					startIndex: 10,
					type: 'identifier.tsp'
				},
				{
					startIndex: 13,
					type: ''
				}
			]
		}
	],
	[
		{
			line: 'namespace Foo {',
			tokens: [
				{
					startIndex: 0,
					type: 'keyword.tsp'
				},
				{
					startIndex: 9,
					type: ''
				},
				{
					startIndex: 10,
					type: 'identifier.tsp'
				},
				{
					startIndex: 13,
					type: ''
				}
			]
		},
		{
			line: '    model Bar {}',
			tokens: [
				{
					startIndex: 0,
					type: ''
				},
				{
					startIndex: 4,
					type: 'keyword.tsp'
				},
				{
					startIndex: 9,
					type: ''
				},
				{
					startIndex: 10,
					type: 'identifier.tsp'
				},
				{
					startIndex: 13,
					type: ''
				}
			]
		},
		{
			line: '  }',
			tokens: [
				{
					startIndex: 0,
					type: ''
				}
			]
		}
	],
	[
		{
			line: 'model Foo {}',
			tokens: [
				{
					startIndex: 0,
					type: 'keyword.tsp'
				},
				{
					startIndex: 5,
					type: ''
				},
				{
					startIndex: 6,
					type: 'identifier.tsp'
				},
				{
					startIndex: 9,
					type: ''
				}
			]
		}
	],
	[
		{
			line: 'model Foo is Bar;',
			tokens: [
				{
					startIndex: 0,
					type: 'keyword.tsp'
				},
				{
					startIndex: 5,
					type: ''
				},
				{
					startIndex: 6,
					type: 'identifier.tsp'
				},
				{
					startIndex: 9,
					type: ''
				},
				{
					startIndex: 10,
					type: 'keyword.tsp'
				},
				{
					startIndex: 12,
					type: ''
				},
				{
					startIndex: 13,
					type: 'identifier.tsp'
				},
				{
					startIndex: 16,
					type: ''
				}
			]
		}
	],
	[
		{
			line: 'model Foo extends Bar;',
			tokens: [
				{
					startIndex: 0,
					type: 'keyword.tsp'
				},
				{
					startIndex: 5,
					type: ''
				},
				{
					startIndex: 6,
					type: 'identifier.tsp'
				},
				{
					startIndex: 9,
					type: ''
				},
				{
					startIndex: 10,
					type: 'keyword.tsp'
				},
				{
					startIndex: 17,
					type: ''
				},
				{
					startIndex: 18,
					type: 'identifier.tsp'
				},
				{
					startIndex: 21,
					type: ''
				}
			]
		}
	],
	[
		{
			line: 'interface Foo {}',
			tokens: [
				{
					startIndex: 0,
					type: 'keyword.tsp'
				},
				{
					startIndex: 9,
					type: ''
				},
				{
					startIndex: 10,
					type: 'identifier.tsp'
				},
				{
					startIndex: 13,
					type: ''
				}
			]
		}
	],
	[
		{
			line: 'union Foo {}',
			tokens: [
				{
					startIndex: 0,
					type: 'keyword.tsp'
				},
				{
					startIndex: 5,
					type: ''
				},
				{
					startIndex: 6,
					type: 'identifier.tsp'
				},
				{
					startIndex: 9,
					type: ''
				}
			]
		}
	],
	[
		{
			line: 'scalar foo extends string;',
			tokens: [
				{
					startIndex: 0,
					type: 'keyword.tsp'
				},
				{
					startIndex: 6,
					type: ''
				},
				{
					startIndex: 7,
					type: 'identifier.tsp'
				},
				{
					startIndex: 10,
					type: ''
				},
				{
					startIndex: 11,
					type: 'keyword.tsp'
				},
				{
					startIndex: 18,
					type: ''
				},
				{
					startIndex: 19,
					type: 'identifier.tsp'
				},
				{
					startIndex: 25,
					type: ''
				}
			]
		}
	],
	[
		{
			line: 'op test(): void;',
			tokens: [
				{
					startIndex: 0,
					type: 'keyword.tsp'
				},
				{
					startIndex: 2,
					type: ''
				},
				{
					startIndex: 3,
					type: 'identifier.tsp'
				},
				{
					startIndex: 7,
					type: ''
				},
				{
					startIndex: 11,
					type: 'keyword.tsp'
				},
				{
					startIndex: 15,
					type: ''
				}
			]
		}
	],
	[
		{
			line: 'enum Direction { up, down }',
			tokens: [
				{
					startIndex: 0,
					type: 'keyword.tsp'
				},
				{
					startIndex: 4,
					type: ''
				},
				{
					startIndex: 5,
					type: 'identifier.tsp'
				},
				{
					startIndex: 14,
					type: ''
				},
				{
					startIndex: 17,
					type: 'identifier.tsp'
				},
				{
					startIndex: 19,
					type: ''
				},
				{
					startIndex: 21,
					type: 'identifier.tsp'
				},
				{
					startIndex: 25,
					type: ''
				}
			]
		}
	],
	[
		{
			line: 'alias Foo = "a" | "b";',
			tokens: [
				{
					startIndex: 0,
					type: 'keyword.tsp'
				},
				{
					startIndex: 5,
					type: ''
				},
				{
					startIndex: 6,
					type: 'identifier.tsp'
				},
				{
					startIndex: 9,
					type: ''
				},
				{
					startIndex: 12,
					type: 'string.tsp'
				},
				{
					startIndex: 15,
					type: ''
				},
				{
					startIndex: 18,
					type: 'string.tsp'
				},
				{
					startIndex: 21,
					type: ''
				}
			]
		}
	],
	[
		{
			line: 'alias T =  """',
			tokens: [
				{
					startIndex: 0,
					type: 'keyword.tsp'
				},
				{
					startIndex: 5,
					type: ''
				},
				{
					startIndex: 6,
					type: 'identifier.tsp'
				},
				{
					startIndex: 7,
					type: ''
				},
				{
					startIndex: 11,
					type: 'string.tsp'
				}
			]
		},
		{
			line: '  this',
			tokens: [
				{
					startIndex: 0,
					type: 'string.tsp'
				}
			]
		},
		{
			line: '  is',
			tokens: [
				{
					startIndex: 0,
					type: 'string.tsp'
				}
			]
		},
		{
			line: '  multiline',
			tokens: [
				{
					startIndex: 0,
					type: 'string.tsp'
				}
			]
		},
		{
			line: '  """',
			tokens: [
				{
					startIndex: 0,
					type: 'string.tsp'
				}
			]
		}
	]
]);
