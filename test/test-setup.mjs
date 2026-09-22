/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createRequire } from 'module';
import { JSDOM } from 'jsdom';

// Handle CSS imports from monaco-editor-core in CJS require context
const require = createRequire(import.meta.url);
require.extensions['.css'] = function (module, filename) {
	module.exports = {};
};

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
	url: 'http://localhost',
	pretendToBeVisual: true,
	resources: 'usable'
});

global.window = dom.window;
global.document = dom.window.document;
Object.defineProperty(global, 'navigator', { value: dom.window.navigator, writable: true, configurable: true });
global.HTMLElement = dom.window.HTMLElement;
global.Node = dom.window.Node;
global.Element = dom.window.Element;
global.Event = dom.window.Event;
global.MouseEvent = dom.window.MouseEvent;
global.KeyboardEvent = dom.window.KeyboardEvent;
global.customElements = dom.window.customElements;

global.CSS = {
	escape: (str) => str.replace(/([^\w-])/g, '\\$1'),
	supports: () => false
};

const mockMatchMedia = function () {
	return {
		matches: false,
		addListener: function () { },
		removeListener: function () { },
		addEventListener: function () { },
		removeEventListener: function () { },
		dispatchEvent: function () { return true; }
	};
};
global.matchMedia = mockMatchMedia;
dom.window.matchMedia = mockMatchMedia;

global.requestAnimationFrame = (callback) => setTimeout(callback, 0);
global.cancelAnimationFrame = (id) => clearTimeout(id);
