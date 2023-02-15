/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { asCSSPropertyValue, asCSSUrl } from '../../../base/browser/dom.js';
import { Emitter } from '../../../base/common/event.js';
import { ThemeIcon } from '../../../base/common/themables.js';
import { getIconRegistry } from '../common/iconRegistry.js';
export function getIconsStyleSheet(themeService) {
    const onDidChangeEmmiter = new Emitter();
    const iconRegistry = getIconRegistry();
    iconRegistry.onDidChange(() => onDidChangeEmmiter.fire());
    themeService === null || themeService === void 0 ? void 0 : themeService.onDidProductIconThemeChange(() => onDidChangeEmmiter.fire());
    return {
        onDidChange: onDidChangeEmmiter.event,
        getCSS() {
            const productIconTheme = themeService ? themeService.getProductIconTheme() : new UnthemedProductIconTheme();
            const usedFontIds = {};
            const formatIconRule = (contribution) => {
                const definition = productIconTheme.getIcon(contribution);
                if (!definition) {
                    return undefined;
                }
                const fontContribution = definition.font;
                if (fontContribution) {
                    usedFontIds[fontContribution.id] = fontContribution.definition;
                    return `.codicon-${contribution.id}:before { content: '${definition.fontCharacter}'; font-family: ${asCSSPropertyValue(fontContribution.id)}; }`;
                }
                // default font (codicon)
                return `.codicon-${contribution.id}:before { content: '${definition.fontCharacter}'; }`;
            };
            const rules = [];
            for (const contribution of iconRegistry.getIcons()) {
                const rule = formatIconRule(contribution);
                if (rule) {
                    rules.push(rule);
                }
            }
            for (const id in usedFontIds) {
                const definition = usedFontIds[id];
                const fontWeight = definition.weight ? `font-weight: ${definition.weight};` : '';
                const fontStyle = definition.style ? `font-style: ${definition.style};` : '';
                const src = definition.src.map(l => `${asCSSUrl(l.location)} format('${l.format}')`).join(', ');
                rules.push(`@font-face { src: ${src}; font-family: ${asCSSPropertyValue(id)};${fontWeight}${fontStyle} font-display: block; }`);
            }
            return rules.join('\n');
        }
    };
}
export class UnthemedProductIconTheme {
    getIcon(contribution) {
        const iconRegistry = getIconRegistry();
        let definition = contribution.defaults;
        while (ThemeIcon.isThemeIcon(definition)) {
            const c = iconRegistry.getIcon(definition.id);
            if (!c) {
                return undefined;
            }
            definition = c.defaults;
        }
        return definition;
    }
}
