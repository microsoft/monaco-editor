/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

require.extensions['.css'] = function (module, filename) {
	module.exports = {};
};

const { JSDOM } = require('jsdom');

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
	url: 'http://localhost',
	pretendToBeVisual: true,
	resources: 'usable'
});

global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.HTMLElement = dom.window.HTMLElement;
global.Node = dom.window.Node;
global.Element = dom.window.Element;
global.Event = dom.window.Event;
global.MouseEvent = dom.window.MouseEvent;
global.KeyboardEvent = dom.window.KeyboardEvent;

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
