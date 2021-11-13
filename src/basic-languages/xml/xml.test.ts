/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('xml', [
	// Complete Start Tag with Whitespace
	[
		{
			line: '<person>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.xml' },
				{ startIndex: 1, type: 'tag.xml' },
				{ startIndex: 7, type: 'delimiter.xml' }
			]
		}
	],

	[
		{
			line: '<person/>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.xml' },
				{ startIndex: 1, type: 'tag.xml' },
				{ startIndex: 8, type: 'delimiter.xml' }
			]
		}
	],

	[
		{
			line: '<person >',
			tokens: [
				{ startIndex: 0, type: 'delimiter.xml' },
				{ startIndex: 1, type: 'tag.xml' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'delimiter.xml' }
			]
		}
	],

	[
		{
			line: '<person />',
			tokens: [
				{ startIndex: 0, type: 'delimiter.xml' },
				{ startIndex: 1, type: 'tag.xml' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'tag.xml' },
				{ startIndex: 9, type: 'delimiter.xml' }
			]
		}
	],

	// Incomplete Start Tag
	[
		{
			line: '<',
			tokens: [{ startIndex: 0, type: '' }]
		}
	],

	[
		{
			line: '<person',
			tokens: [
				{ startIndex: 0, type: 'delimiter.xml' },
				{ startIndex: 1, type: 'tag.xml' }
			]
		}
	],

	[
		{
			line: '<input',
			tokens: [
				{ startIndex: 0, type: 'delimiter.xml' },
				{ startIndex: 1, type: 'tag.xml' }
			]
		}
	],

	// Invalid Open Start Tag
	[
		{
			line: '< person',
			tokens: [{ startIndex: 0, type: '' }]
		}
	],

	[
		{
			line: '< person>',
			tokens: [{ startIndex: 0, type: '' }]
		}
	],

	[
		{
			line: 'i <person;',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'delimiter.xml' },
				{ startIndex: 3, type: 'tag.xml' },
				{ startIndex: 9, type: '' }
			]
		}
	],

	// Tag with Attribute
	[
		{
			line: '<tool name="">',
			tokens: [
				{ startIndex: 0, type: 'delimiter.xml' },
				{ startIndex: 1, type: 'tag.xml' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'attribute.name.xml' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'attribute.value.xml' },
				{ startIndex: 13, type: 'delimiter.xml' }
			]
		}
	],

	[
		{
			line: '<tool name="Monaco">',
			tokens: [
				{ startIndex: 0, type: 'delimiter.xml' },
				{ startIndex: 1, type: 'tag.xml' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'attribute.name.xml' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'attribute.value.xml' },
				{ startIndex: 19, type: 'delimiter.xml' }
			]
		}
	],

	[
		{
			line: "<tool name='Monaco'>",
			tokens: [
				{ startIndex: 0, type: 'delimiter.xml' },
				{ startIndex: 1, type: 'tag.xml' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'attribute.name.xml' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'attribute.value.xml' },
				{ startIndex: 19, type: 'delimiter.xml' }
			]
		}
	],

	// Tag with Attributes
	[
		{
			line: '<tool name="Monaco" version="1.0">',
			tokens: [
				{ startIndex: 0, type: 'delimiter.xml' },
				{ startIndex: 1, type: 'tag.xml' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'attribute.name.xml' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'attribute.value.xml' },
				{ startIndex: 19, type: '' },
				{ startIndex: 20, type: 'attribute.name.xml' },
				{ startIndex: 27, type: '' },
				{ startIndex: 28, type: 'attribute.value.xml' },
				{ startIndex: 33, type: 'delimiter.xml' }
			]
		}
	],

	// Tag with Name-Only-Attribute
	[
		{
			line: '<tool name>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.xml' },
				{ startIndex: 1, type: 'tag.xml' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'attribute.name.xml' },
				{ startIndex: 10, type: 'delimiter.xml' }
			]
		}
	],

	[
		{
			line: '<tool name version>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.xml' },
				{ startIndex: 1, type: 'tag.xml' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'attribute.name.xml' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'attribute.name.xml' },
				{ startIndex: 18, type: 'delimiter.xml' }
			]
		}
	],

	// Tag with Attribute And Whitespace
	[
		{
			line: '<tool name=  "monaco">',
			tokens: [
				{ startIndex: 0, type: 'delimiter.xml' },
				{ startIndex: 1, type: 'tag.xml' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'attribute.name.xml' },
				{ startIndex: 10, type: '' },
				{ startIndex: 13, type: 'attribute.value.xml' },
				{ startIndex: 21, type: 'delimiter.xml' }
			]
		}
	],

	[
		{
			line: '<tool name = "monaco">',
			tokens: [
				{ startIndex: 0, type: 'delimiter.xml' },
				{ startIndex: 1, type: 'tag.xml' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'attribute.name.xml' },
				{ startIndex: 10, type: '' },
				{ startIndex: 13, type: 'attribute.value.xml' },
				{ startIndex: 21, type: 'delimiter.xml' }
			]
		}
	],

	// Tag with Invalid Attribute Name
	[
		{
			line: '<tool name!@#="bar">',
			tokens: [
				{ startIndex: 0, type: 'delimiter.xml' },
				{ startIndex: 1, type: 'tag.xml' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'attribute.name.xml' },
				{ startIndex: 10, type: '' },
				{ startIndex: 15, type: 'attribute.name.xml' },
				{ startIndex: 18, type: '' },
				{ startIndex: 19, type: 'delimiter.xml' }
			]
		}
	],

	// Tag with Invalid Attribute Value
	[
		{
			line: '<tool name=">',
			tokens: [
				{ startIndex: 0, type: 'delimiter.xml' },
				{ startIndex: 1, type: 'tag.xml' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'attribute.name.xml' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'attribute.value.xml' },
				{ startIndex: 12, type: 'delimiter.xml' }
			]
		}
	],

	// Complete End Tag
	[
		{
			line: '</person>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.xml' },
				{ startIndex: 2, type: 'tag.xml' },
				{ startIndex: 8, type: 'delimiter.xml' }
			]
		}
	],

	// Complete End Tag with Whitespace
	[
		{
			line: '</person  >',
			tokens: [
				{ startIndex: 0, type: 'delimiter.xml' },
				{ startIndex: 2, type: 'tag.xml' },
				{ startIndex: 8, type: '' },
				{ startIndex: 10, type: 'delimiter.xml' }
			]
		}
	],

	// Incomplete End Tag
	[
		{
			line: '</person',
			tokens: [{ startIndex: 0, type: '' }]
		}
	],

	// Comments
	[
		{
			line: '<!-- -->',
			tokens: [
				{ startIndex: 0, type: 'comment.xml' },
				{ startIndex: 4, type: 'comment.content.xml' },
				{ startIndex: 5, type: 'comment.xml' }
			]
		}
	],

	[
		{
			line: '<!--a>monaco</a -->',
			tokens: [
				{ startIndex: 0, type: 'comment.xml' },
				{ startIndex: 4, type: 'comment.content.xml' },
				{ startIndex: 16, type: 'comment.xml' }
			]
		}
	],

	[
		{
			line: '<!--a>',
			tokens: [
				{ startIndex: 0, type: 'comment.xml' },
				{ startIndex: 4, type: 'comment.content.xml' }
			]
		},
		{
			line: 'monaco ',
			tokens: [{ startIndex: 0, type: 'comment.content.xml' }]
		},
		{
			line: 'tools</a -->',
			tokens: [
				{ startIndex: 0, type: 'comment.content.xml' },
				{ startIndex: 9, type: 'comment.xml' }
			]
		}
	],

	// CDATA
	[
		{
			line: '<tools><![CDATA[<person/>]]></tools>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.xml' },
				{ startIndex: 1, type: 'tag.xml' },
				{ startIndex: 6, type: 'delimiter.xml' },
				{ startIndex: 7, type: 'delimiter.cdata.xml' },
				{ startIndex: 16, type: '' },
				{ startIndex: 25, type: 'delimiter.cdata.xml' },
				{ startIndex: 28, type: 'delimiter.xml' },
				{ startIndex: 30, type: 'tag.xml' },
				{ startIndex: 35, type: 'delimiter.xml' }
			]
		}
	],

	[
		{
			line: '<tools>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.xml' },
				{ startIndex: 1, type: 'tag.xml' },
				{ startIndex: 6, type: 'delimiter.xml' }
			]
		},
		{
			line: '\t<![CDATA[',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 1, type: 'delimiter.cdata.xml' }
			]
		},
		{
			line: '\t\t<person/>',
			tokens: [{ startIndex: 0, type: '' }]
		},
		{
			line: '\t]]>',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 1, type: 'delimiter.cdata.xml' }
			]
		},
		{
			line: '</tools>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.xml' },
				{ startIndex: 2, type: 'tag.xml' },
				{ startIndex: 7, type: 'delimiter.xml' }
			]
		}
	],

	// Generated from sample
	[
		{
			line: '<?xml version="1.0"?>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.xml' },
				{ startIndex: 2, type: 'metatag.xml' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'attribute.name.xml' },
				{ startIndex: 13, type: '' },
				{ startIndex: 14, type: 'attribute.value.xml' },
				{ startIndex: 19, type: 'delimiter.xml' }
			]
		},
		{
			line: '<configuration xmlns:xdt="http://schemas.microsoft.com/XML-Document-Transform">',
			tokens: [
				{ startIndex: 0, type: 'delimiter.xml' },
				{ startIndex: 1, type: 'tag.xml' },
				{ startIndex: 14, type: '' },
				{ startIndex: 15, type: 'attribute.name.xml' },
				{ startIndex: 24, type: '' },
				{ startIndex: 25, type: 'attribute.value.xml' },
				{ startIndex: 78, type: 'delimiter.xml' }
			]
		},
		{
			line: '  <connectionStrings>',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'delimiter.xml' },
				{ startIndex: 3, type: 'tag.xml' },
				{ startIndex: 20, type: 'delimiter.xml' }
			]
		},
		{
			line: '    <add name="MyDB" ',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'delimiter.xml' },
				{ startIndex: 5, type: 'tag.xml' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'attribute.name.xml' },
				{ startIndex: 13, type: '' },
				{ startIndex: 14, type: 'attribute.value.xml' },
				{ startIndex: 20, type: '' }
			]
		},
		{
			line: '      connectionString="value for the deployed Web.config file" ',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 6, type: 'attribute.name.xml' },
				{ startIndex: 22, type: '' },
				{ startIndex: 23, type: 'attribute.value.xml' },
				{ startIndex: 63, type: '' }
			]
		},
		{
			line: '      xdt:Transform="SetAttributes" xdt:Locator="Match(name)"/>',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 6, type: 'attribute.name.xml' },
				{ startIndex: 19, type: '' },
				{ startIndex: 20, type: 'attribute.value.xml' },
				{ startIndex: 35, type: '' },
				{ startIndex: 36, type: 'attribute.name.xml' },
				{ startIndex: 47, type: '' },
				{ startIndex: 48, type: 'attribute.value.xml' },
				{ startIndex: 61, type: 'tag.xml' },
				{ startIndex: 62, type: 'delimiter.xml' }
			]
		},
		{
			line: '  </connectionStrings>',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'delimiter.xml' },
				{ startIndex: 4, type: 'tag.xml' },
				{ startIndex: 21, type: 'delimiter.xml' }
			]
		},
		{
			line: '  <system.web>',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'delimiter.xml' },
				{ startIndex: 3, type: 'tag.xml' },
				{ startIndex: 13, type: 'delimiter.xml' }
			]
		},
		{
			line: '    <customErrors defaultRedirect="GenericError.htm"',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'delimiter.xml' },
				{ startIndex: 5, type: 'tag.xml' },
				{ startIndex: 17, type: '' },
				{ startIndex: 18, type: 'attribute.name.xml' },
				{ startIndex: 33, type: '' },
				{ startIndex: 34, type: 'attribute.value.xml' }
			]
		},
		{
			line: '      mode="RemoteOnly" xdt:Transform="Replace">',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 6, type: 'attribute.name.xml' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'attribute.value.xml' },
				{ startIndex: 23, type: '' },
				{ startIndex: 24, type: 'attribute.name.xml' },
				{ startIndex: 37, type: '' },
				{ startIndex: 38, type: 'attribute.value.xml' },
				{ startIndex: 47, type: 'delimiter.xml' }
			]
		},
		{
			line: '      <error statusCode="500" redirect="InternalError.htm"/>',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 6, type: 'delimiter.xml' },
				{ startIndex: 7, type: 'tag.xml' },
				{ startIndex: 12, type: '' },
				{ startIndex: 13, type: 'attribute.name.xml' },
				{ startIndex: 23, type: '' },
				{ startIndex: 24, type: 'attribute.value.xml' },
				{ startIndex: 29, type: '' },
				{ startIndex: 30, type: 'attribute.name.xml' },
				{ startIndex: 38, type: '' },
				{ startIndex: 39, type: 'attribute.value.xml' },
				{ startIndex: 58, type: 'tag.xml' },
				{ startIndex: 59, type: 'delimiter.xml' }
			]
		},
		{
			line: '    </customErrors>',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'delimiter.xml' },
				{ startIndex: 6, type: 'tag.xml' },
				{ startIndex: 18, type: 'delimiter.xml' }
			]
		},
		{
			line: '  </system.web>',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'delimiter.xml' },
				{ startIndex: 4, type: 'tag.xml' },
				{ startIndex: 14, type: 'delimiter.xml' }
			]
		},
		{
			line: '	',
			tokens: [{ startIndex: 0, type: '' }]
		},
		{
			line: '	<!-- The stuff below was added for extra tokenizer testing -->',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 1, type: 'comment.xml' },
				{ startIndex: 5, type: 'comment.content.xml' },
				{ startIndex: 60, type: 'comment.xml' }
			]
		},
		{
			line: '	<!-- A multi-line comment <with> </with>',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 1, type: 'comment.xml' },
				{ startIndex: 5, type: 'comment.content.xml' }
			]
		},
		{
			line: '       <tags>',
			tokens: [{ startIndex: 0, type: 'comment.content.xml' }]
		},
		{
			line: '				 -->',
			tokens: [
				{ startIndex: 0, type: 'comment.content.xml' },
				{ startIndex: 5, type: 'comment.xml' }
			]
		},
		{
			line: '	<!DOCTYPE another meta tag>',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 1, type: 'delimiter.xml' },
				{ startIndex: 3, type: 'metatag.xml' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'attribute.name.xml' },
				{ startIndex: 18, type: '' },
				{ startIndex: 19, type: 'attribute.name.xml' },
				{ startIndex: 23, type: '' },
				{ startIndex: 24, type: 'attribute.name.xml' },
				{ startIndex: 27, type: 'delimiter.xml' }
			]
		},
		{
			line: '	<tools><![CDATA[Some text and tags <person/>]]></tools>',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 1, type: 'delimiter.xml' },
				{ startIndex: 2, type: 'tag.xml' },
				{ startIndex: 7, type: 'delimiter.xml' },
				{ startIndex: 8, type: 'delimiter.cdata.xml' },
				{ startIndex: 17, type: '' },
				{ startIndex: 45, type: 'delimiter.cdata.xml' },
				{ startIndex: 48, type: 'delimiter.xml' },
				{ startIndex: 50, type: 'tag.xml' },
				{ startIndex: 55, type: 'delimiter.xml' }
			]
		},
		{
			line: '	<aSelfClosingTag with="attribute" />',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 1, type: 'delimiter.xml' },
				{ startIndex: 2, type: 'tag.xml' },
				{ startIndex: 17, type: '' },
				{ startIndex: 18, type: 'attribute.name.xml' },
				{ startIndex: 22, type: '' },
				{ startIndex: 23, type: 'attribute.value.xml' },
				{ startIndex: 34, type: '' },
				{ startIndex: 35, type: 'tag.xml' },
				{ startIndex: 36, type: 'delimiter.xml' }
			]
		},
		{
			line: '	<aSelfClosingTag with="attribute"/>',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 1, type: 'delimiter.xml' },
				{ startIndex: 2, type: 'tag.xml' },
				{ startIndex: 17, type: '' },
				{ startIndex: 18, type: 'attribute.name.xml' },
				{ startIndex: 22, type: '' },
				{ startIndex: 23, type: 'attribute.value.xml' },
				{ startIndex: 34, type: 'tag.xml' },
				{ startIndex: 35, type: 'delimiter.xml' }
			]
		},
		{
			line: '	<namespace:aSelfClosingTag otherspace:with="attribute"/>',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 1, type: 'delimiter.xml' },
				{ startIndex: 2, type: 'tag.xml' },
				{ startIndex: 27, type: '' },
				{ startIndex: 28, type: 'attribute.name.xml' },
				{ startIndex: 43, type: '' },
				{ startIndex: 44, type: 'attribute.value.xml' },
				{ startIndex: 55, type: 'tag.xml' },
				{ startIndex: 56, type: 'delimiter.xml' }
			]
		},
		{
			line: "	<valid-name also_valid this.one='too is valid'/>",
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 1, type: 'delimiter.xml' },
				{ startIndex: 2, type: 'tag.xml' },
				{ startIndex: 12, type: '' },
				{ startIndex: 13, type: 'attribute.name.xml' },
				{ startIndex: 23, type: '' },
				{ startIndex: 24, type: 'attribute.name.xml' },
				{ startIndex: 32, type: '' },
				{ startIndex: 33, type: 'attribute.value.xml' },
				{ startIndex: 47, type: 'tag.xml' },
				{ startIndex: 48, type: 'delimiter.xml' }
			]
		},
		{
			line: '	<aSimpleSelfClosingTag />',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 1, type: 'delimiter.xml' },
				{ startIndex: 2, type: 'tag.xml' },
				{ startIndex: 23, type: '' },
				{ startIndex: 24, type: 'tag.xml' },
				{ startIndex: 25, type: 'delimiter.xml' }
			]
		},
		{
			line: '	<aSimpleSelfClosingTag/>',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 1, type: 'delimiter.xml' },
				{ startIndex: 2, type: 'tag.xml' },
				{ startIndex: 24, type: 'delimiter.xml' }
			]
		},
		{
			line: '</configuration>',
			tokens: [
				{ startIndex: 0, type: 'delimiter.xml' },
				{ startIndex: 2, type: 'tag.xml' },
				{ startIndex: 15, type: 'delimiter.xml' }
			]
		}
	]
]);
