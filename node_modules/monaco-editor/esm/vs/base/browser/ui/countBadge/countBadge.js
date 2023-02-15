/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { $, append } from '../../dom.js';
import { format } from '../../../common/strings.js';
import './countBadge.css';
export class CountBadge {
    constructor(container, options, styles) {
        this.options = options;
        this.styles = styles;
        this.count = 0;
        this.element = append(container, $('.monaco-count-badge'));
        this.countFormat = this.options.countFormat || '{0}';
        this.titleFormat = this.options.titleFormat || '';
        this.setCount(this.options.count || 0);
    }
    setCount(count) {
        this.count = count;
        this.render();
    }
    setTitleFormat(titleFormat) {
        this.titleFormat = titleFormat;
        this.render();
    }
    render() {
        var _a, _b;
        this.element.textContent = format(this.countFormat, this.count);
        this.element.title = format(this.titleFormat, this.count);
        this.element.style.backgroundColor = (_a = this.styles.badgeBackground) !== null && _a !== void 0 ? _a : '';
        this.element.style.color = (_b = this.styles.badgeForeground) !== null && _b !== void 0 ? _b : '';
        if (this.styles.badgeBorder) {
            this.element.style.border = `1px solid ${this.styles.badgeBorder}`;
        }
    }
}
