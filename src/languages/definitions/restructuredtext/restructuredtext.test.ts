/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('restructuredtext', [
	[
		{
			line: 'some property = Text::ProxyLibrary::ProxyInterfaceTest::DeleteProxyInterface();',
			tokens: [{ startIndex: 0, type: '' }]
		}
	],
	[
		{
			line: '#####',
			tokens: [{ startIndex: 0, type: 'keyword.rst' }]
		}
	],
	[
		{
			line: 'strong **strong**',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 7, type: 'strong.rst' }
			]
		},
		{
			line: 'emphasis *emphasis*',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 9, type: 'emphasis.rst' }
			]
		}
	],
	[
		{
			line: '.. [23] This is the footnote',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'string.link.rst' },
				{ startIndex: 6, type: '' }
			]
		},
		{
			line: '.. [#ab] This is the footnote',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'string.link.rst' },
				{ startIndex: 7, type: '' }
			]
		},
		{
			line: '.. [#] This is the footnote',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'string.link.rst' },
				{ startIndex: 5, type: '' }
			]
		},
		{
			line: '.. [*] This is the footnote',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'string.link.rst' },
				{ startIndex: 5, type: '' }
			]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: ' .. [23] This is not the footnote',
			tokens: [{ startIndex: 0, type: '' }]
		}
	],
	[
		{
			line: '[23]_',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 1, type: 'string.link.rst' },
				{ startIndex: 3, type: '' }
			]
		},
		{
			line: '[*]_',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 1, type: 'string.link.rst' },
				{ startIndex: 2, type: '' }
			]
		},
		{
			line: '[#]_',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 1, type: 'string.link.rst' },
				{ startIndex: 2, type: '' }
			]
		},
		{
			line: '[#abc]_ [#]_',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 1, type: 'string.link.rst' },
				{ startIndex: 5, type: '' },
				{ startIndex: 9, type: 'string.link.rst' },
				{ startIndex: 10, type: '' }
			]
		}
	],
	[
		{
			line: '.. [A3] This is the citation',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'string.link.rst' },
				{ startIndex: 6, type: '' }
			]
		}
	],
	[
		{
			line: ' .. [A3] This is not the citation',
			tokens: [{ startIndex: 0, type: '' }]
		}
	],
	[
		{
			line: '.. [A3] This is the citation',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'string.link.rst' },
				{ startIndex: 6, type: '' }
			]
		},
		{
			line: ' first line',
			tokens: [{ startIndex: 0, type: '' }]
		},
		{
			line: ' second line',
			tokens: [{ startIndex: 0, type: '' }]
		},
		{
			line: 'new line starts',
			tokens: [{ startIndex: 0, type: '' }]
		}
	],
	[
		{
			line: '[A3]_',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 1, type: 'string.link.rst' },
				{ startIndex: 3, type: '' }
			]
		}
	],
	[
		{
			line: 'Interpreted Text `text`',
			tokens: [{ startIndex: 0, type: '' }]
		},
		{
			line: ' .. _`text`: paragraph',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 6, type: 'string.link.rst' },
				{ startIndex: 10, type: '' }
			]
		},
		{
			line: 'Interpreted Text :role:`text`',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 18, type: 'keyword.rst' },
				{ startIndex: 22, type: '' }
			]
		},
		{
			line: 'Interpreted Text `text`:role:',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 24, type: 'keyword.rst' },
				{ startIndex: 28, type: '' }
			]
		}
	],
	[
		{
			line: '.. note:: This is a directive',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 3, type: 'keyword.rst' },
				{ startIndex: 7, type: '' }
			]
		}
	],
	[
		{
			line: 'link .. _link: this is not a hyperlink',
			tokens: [{ startIndex: 0, type: '' }]
		},
		{
			line: '.. _link: this is a hyperlink',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'string.link.rst' },
				{ startIndex: 8, type: '' },
				{ startIndex: 10, type: 'string.link.rst' }
			]
		},
		{
			line: '.. _`link`: this is a hyperlink',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'string.link.rst' },
				{ startIndex: 10, type: '' },
				{ startIndex: 12, type: 'string.link.rst' }
			]
		},
		{
			line: '.. __: this is a anonymous hyperlink',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 7, type: 'string.link.rst' }
			]
		},
		{
			line: '__: this is a anonymous hyperlink',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'string.link.rst' }
			]
		}
	],
	[
		{
			line: '...... _`this is a inline internal target`',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 9, type: 'string.link.rst' },
				{ startIndex: 41, type: '' }
			]
		}
	],
	[
		{
			line: '.. |biohazard| image:: biohazard.png',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'string.link.rst' },
				{ startIndex: 13, type: '' },
				{ startIndex: 15, type: 'keyword.rst' },
				{ startIndex: 20, type: '' }
			]
		},
		{
			line: '... |biohazard| ...',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 5, type: 'string.link.rst' },
				{ startIndex: 14, type: '' }
			]
		}
	],
	[
		{
			line: 'ref_ `ref`_ ref__ `ref`__',
			tokens: [
				{ startIndex: 0, type: 'string.link.rst' },
				{ startIndex: 3, type: '' },
				{ startIndex: 5, type: 'string.link.rst' },
				{ startIndex: 10, type: '' },
				{ startIndex: 12, type: 'string.link.rst' },
				{ startIndex: 15, type: '' },
				{ startIndex: 18, type: 'string.link.rst' },
				{ startIndex: 23, type: '' }
			]
		}
	],
	[
		{
			line: '.... `title <http://google.com>`_',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 6, type: 'string.link.rst' },
				{ startIndex: 12, type: '' },
				{ startIndex: 13, type: 'string.link.rst' },
				{ startIndex: 30, type: '' }
			]
		}
	],
	[
		{
			line: '::',
			tokens: [{ startIndex: 0, type: 'keyword.rst' }]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: ' first line',
			tokens: [
				{ startIndex: 0, type: 'keyword.rst' },
				{ startIndex: 1, type: '' }
			]
		},
		{
			line: ' second line',
			tokens: [
				{ startIndex: 0, type: 'keyword.rst' },
				{ startIndex: 1, type: '' }
			]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: ' paragraph',
			tokens: [{ startIndex: 0, type: '' }]
		}
	],
	[
		{
			line: 'desc ::',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'keyword.rst' }
			]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: '>>first line',
			tokens: [
				{ startIndex: 0, type: 'keyword.rst' },
				{ startIndex: 2, type: '' }
			]
		},
		{
			line: '>',
			tokens: [{ startIndex: 0, type: 'keyword.rst' }]
		},
		{
			line: '>second line',
			tokens: [
				{ startIndex: 0, type: 'keyword.rst' },
				{ startIndex: 1, type: '' }
			]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: ' paragraph',
			tokens: [{ startIndex: 0, type: '' }]
		}
	],
	[
		{
			line: '.. comment',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'comment.rst' }
			]
		},
		{
			line: ' firstline',
			tokens: [{ startIndex: 0, type: 'comment.rst' }]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: ' paragraph',
			tokens: [{ startIndex: 0, type: '' }]
		}
	],
	[
		{
			line: '==',
			tokens: [{ startIndex: 0, type: '' }]
		},
		{
			line: '===',
			tokens: [{ startIndex: 0, type: 'keyword.rst' }]
		}
	],
	[
		{
			line: '1. item',
			tokens: [
				{ startIndex: 0, type: 'keyword.rst' },
				{ startIndex: 3, type: '' }
			]
		},
		{
			line: 'a. item',
			tokens: [
				{ startIndex: 0, type: 'keyword.rst' },
				{ startIndex: 3, type: '' }
			]
		},
		{
			line: '* item',
			tokens: [
				{ startIndex: 0, type: 'keyword.rst' },
				{ startIndex: 2, type: '' }
			]
		},
		{
			line: '- item',
			tokens: [
				{ startIndex: 0, type: 'keyword.rst' },
				{ startIndex: 2, type: '' }
			]
		},
		{
			line: '1) item',
			tokens: [
				{ startIndex: 0, type: 'keyword.rst' },
				{ startIndex: 3, type: '' }
			]
		},
		{
			line: '(a) item',
			tokens: [
				{ startIndex: 0, type: 'keyword.rst' },
				{ startIndex: 4, type: '' }
			]
		}
	],
	[
		{
			line: '+------------------------+------------+----------+----------+',
			tokens: [{ startIndex: 0, type: 'keyword.rst' }]
		},
		{
			line: '+========================+============+==========+==========+',
			tokens: [{ startIndex: 0, type: 'keyword.rst' }]
		}
	]
]);
