/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as DOM from './dom.js';
export function renderText(text, options = {}) {
    const element = createElement(options);
    element.textContent = text;
    return element;
}
export function renderFormattedText(formattedText, options = {}) {
    const element = createElement(options);
    _renderFormattedText(element, parseFormattedText(formattedText, !!options.renderCodeSegments), options.actionHandler, options.renderCodeSegments);
    return element;
}
export function createElement(options) {
    const tagName = options.inline ? 'span' : 'div';
    const element = document.createElement(tagName);
    if (options.className) {
        element.className = options.className;
    }
    return element;
}
class StringStream {
    constructor(source) {
        this.source = source;
        this.index = 0;
    }
    eos() {
        return this.index >= this.source.length;
    }
    next() {
        const next = this.peek();
        this.advance();
        return next;
    }
    peek() {
        return this.source[this.index];
    }
    advance() {
        this.index++;
    }
}
function _renderFormattedText(element, treeNode, actionHandler, renderCodeSegments) {
    let child;
    if (treeNode.type === 2 /* FormatType.Text */) {
        child = document.createTextNode(treeNode.content || '');
    }
    else if (treeNode.type === 3 /* FormatType.Bold */) {
        child = document.createElement('b');
    }
    else if (treeNode.type === 4 /* FormatType.Italics */) {
        child = document.createElement('i');
    }
    else if (treeNode.type === 7 /* FormatType.Code */ && renderCodeSegments) {
        child = document.createElement('code');
    }
    else if (treeNode.type === 5 /* FormatType.Action */ && actionHandler) {
        const a = document.createElement('a');
        actionHandler.disposables.add(DOM.addStandardDisposableListener(a, 'click', (event) => {
            actionHandler.callback(String(treeNode.index), event);
        }));
        child = a;
    }
    else if (treeNode.type === 8 /* FormatType.NewLine */) {
        child = document.createElement('br');
    }
    else if (treeNode.type === 1 /* FormatType.Root */) {
        child = element;
    }
    if (child && element !== child) {
        element.appendChild(child);
    }
    if (child && Array.isArray(treeNode.children)) {
        treeNode.children.forEach((nodeChild) => {
            _renderFormattedText(child, nodeChild, actionHandler, renderCodeSegments);
        });
    }
}
function parseFormattedText(content, parseCodeSegments) {
    const root = {
        type: 1 /* FormatType.Root */,
        children: []
    };
    let actionViewItemIndex = 0;
    let current = root;
    const stack = [];
    const stream = new StringStream(content);
    while (!stream.eos()) {
        let next = stream.next();
        const isEscapedFormatType = (next === '\\' && formatTagType(stream.peek(), parseCodeSegments) !== 0 /* FormatType.Invalid */);
        if (isEscapedFormatType) {
            next = stream.next(); // unread the backslash if it escapes a format tag type
        }
        if (!isEscapedFormatType && isFormatTag(next, parseCodeSegments) && next === stream.peek()) {
            stream.advance();
            if (current.type === 2 /* FormatType.Text */) {
                current = stack.pop();
            }
            const type = formatTagType(next, parseCodeSegments);
            if (current.type === type || (current.type === 5 /* FormatType.Action */ && type === 6 /* FormatType.ActionClose */)) {
                current = stack.pop();
            }
            else {
                const newCurrent = {
                    type: type,
                    children: []
                };
                if (type === 5 /* FormatType.Action */) {
                    newCurrent.index = actionViewItemIndex;
                    actionViewItemIndex++;
                }
                current.children.push(newCurrent);
                stack.push(current);
                current = newCurrent;
            }
        }
        else if (next === '\n') {
            if (current.type === 2 /* FormatType.Text */) {
                current = stack.pop();
            }
            current.children.push({
                type: 8 /* FormatType.NewLine */
            });
        }
        else {
            if (current.type !== 2 /* FormatType.Text */) {
                const textCurrent = {
                    type: 2 /* FormatType.Text */,
                    content: next
                };
                current.children.push(textCurrent);
                stack.push(current);
                current = textCurrent;
            }
            else {
                current.content += next;
            }
        }
    }
    if (current.type === 2 /* FormatType.Text */) {
        current = stack.pop();
    }
    if (stack.length) {
        // incorrectly formatted string literal
    }
    return root;
}
function isFormatTag(char, supportCodeSegments) {
    return formatTagType(char, supportCodeSegments) !== 0 /* FormatType.Invalid */;
}
function formatTagType(char, supportCodeSegments) {
    switch (char) {
        case '*':
            return 3 /* FormatType.Bold */;
        case '_':
            return 4 /* FormatType.Italics */;
        case '[':
            return 5 /* FormatType.Action */;
        case ']':
            return 6 /* FormatType.ActionClose */;
        case '`':
            return supportCodeSegments ? 7 /* FormatType.Code */ : 0 /* FormatType.Invalid */;
        default:
            return 0 /* FormatType.Invalid */;
    }
}
