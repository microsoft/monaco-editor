import {testTokenization} from './testRunner';

testTokenization('yaml', [
	// YAML directive
	[{
		line: '%YAML 1.2',
		tokens: [{
			startIndex: 0,
			type: 'meta.directive.yaml'
		}]
	}],

	// Comments
	[{
		line: '#Comment',
		tokens: [{
			startIndex: 0,
			type: 'comment.yaml'
		}]
	}],

	// Document Marker - Directives End
	[{
		line: '---',
		tokens: [{
			startIndex: 0,
			type: 'operators.directivesEnd.yaml'
		}]
	}],

	// Document Marker - Document End
	[{
		line: '...',
		tokens: [{
			startIndex: 0,
			type: 'operators.documentEnd.yaml'
		}]
	}],

	// Tag Handle
	[{
		line: '!<tag:clarkevans.com,2002:invoice>',
		tokens: [{
			startIndex: 0,
			type: 'tag.yaml'
		}]
	}],

	// Key:Value
	[{
		line: 'key: value',
		tokens: [{
			startIndex: 0,
			type: 'type.yaml'
		}, {
			startIndex: 3,
			type: 'operators.yaml'
		}, {
			startIndex: 4,
			type: 'white.yaml'
		}, {
			startIndex: 5,
			type: 'string.yaml'
		}]
	}],

	// Key:Value - Quoted Keys
	[{
		line: '":": value',
		tokens: [{
			startIndex: 0,
			type: 'type.yaml'
		}, {
			startIndex: 3,
			type: 'operators.yaml'
		}, {
			startIndex: 4,
			type: 'white.yaml'
		}, {
			startIndex: 5,
			type: 'string.yaml'
		}]
	}],

	// Flow Sequence - Data types
	[{
		line: '[string,"double",\'single\',1,1.1,2002-04-28]',
		tokens: [{
			startIndex: 0,
			type: 'delimiter.square.yaml'
		}, {
			startIndex: 1,
			type: 'string.yaml'
		}, {
			startIndex: 7,
			type: 'delimiter.comma.yaml'
		}, {
			startIndex: 8,
			type: 'string.yaml'
		}, {
			startIndex: 16,
			type: 'delimiter.comma.yaml'
		}, {
			startIndex: 17,
			type: 'string.yaml'
		}, {
			startIndex: 25,
			type: 'delimiter.comma.yaml'
		}, {
			startIndex: 26,
			type: 'number.yaml'
		}, {
			startIndex: 27,
			type: 'delimiter.comma.yaml'
		}, {
			startIndex: 28,
			type: 'number.float.yaml'
		}, {
			startIndex: 31,
			type: 'delimiter.comma.yaml'
		}, {
			startIndex: 32,
			type: 'number.date.yaml'
		}, {
			startIndex: 42,
			type: 'delimiter.square.yaml'
		}]
	}]
]);
