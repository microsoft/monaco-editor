/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as dom from '../../dom.js';
import { ThemeIcon } from '../../../common/themables.js';
const labelWithIconsRegex = new RegExp(`(\\\\)?\\$\\((${ThemeIcon.iconNameExpression}(?:${ThemeIcon.iconModifierExpression})?)\\)`, 'g');
export function renderLabelWithIcons(text) {
    const elements = new Array();
    let match;
    let textStart = 0, textStop = 0;
    while ((match = labelWithIconsRegex.exec(text)) !== null) {
        textStop = match.index || 0;
        if (textStart < textStop) {
            elements.push(text.substring(textStart, textStop));
        }
        textStart = (match.index || 0) + match[0].length;
        const [, escaped, codicon] = match;
        elements.push(escaped ? `$(${codicon})` : renderIcon({ id: codicon }));
    }
    if (textStart < text.length) {
        elements.push(text.substring(textStart));
    }
    return elements;
}
export function renderIcon(icon) {
    const node = dom.$(`span`);
    node.classList.add(...ThemeIcon.asClassNameArray(icon));
    return node;
}
