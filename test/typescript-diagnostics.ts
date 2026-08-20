import * as assert from 'node:assert';
import type * as ts from '../src/language/typescript/lib/typescriptServices';
import { sanitizeDiagnostics } from '../src/language/typescript/diagnostics';

const messageText: ts.DiagnosticMessageChain = {
	messageText: 'This file is a CommonJS module.',
	category: 1,
	code: 1479,
	next: [
		{
			messageText: 'Add the field "type": "module" to package.json.',
			category: 3,
			code: 1541
		}
	]
};
Object.assign(messageText, { repopulateInfo: () => true });

const diagnostic: ts.Diagnostic = {
	category: 1,
	code: 1479,
	file: undefined,
	start: 0,
	length: 1,
	messageText
};

const [sanitized] = sanitizeDiagnostics([diagnostic]);
assert.doesNotThrow(() => structuredClone(sanitized));
assert.deepStrictEqual(sanitized.messageText, {
	messageText: 'This file is a CommonJS module.',
	category: 1,
	code: 1479,
	next: [
		{
			messageText: 'Add the field "type": "module" to package.json.',
			category: 3,
			code: 1541,
			next: undefined
		}
	]
});
