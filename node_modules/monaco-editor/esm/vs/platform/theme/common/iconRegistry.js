/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { RunOnceScheduler } from '../../../base/common/async.js';
import { Codicon, getCodiconFontCharacters } from '../../../base/common/codicons.js';
import { ThemeIcon } from '../../../base/common/themables.js';
import { Emitter } from '../../../base/common/event.js';
import { isString } from '../../../base/common/types.js';
import { URI } from '../../../base/common/uri.js';
import { localize } from '../../../nls.js';
import { Extensions as JSONExtensions } from '../../jsonschemas/common/jsonContributionRegistry.js';
import * as platform from '../../registry/common/platform.js';
//  ------ API types
// icon registry
export const Extensions = {
    IconContribution: 'base.contributions.icons'
};
export var IconContribution;
(function (IconContribution) {
    function getDefinition(contribution, registry) {
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
    IconContribution.getDefinition = getDefinition;
})(IconContribution || (IconContribution = {}));
export var IconFontDefinition;
(function (IconFontDefinition) {
    function toJSONObject(iconFont) {
        return {
            weight: iconFont.weight,
            style: iconFont.style,
            src: iconFont.src.map(s => ({ format: s.format, location: s.location.toString() }))
        };
    }
    IconFontDefinition.toJSONObject = toJSONObject;
    function fromJSONObject(json) {
        const stringOrUndef = (s) => isString(s) ? s : undefined;
        if (json && Array.isArray(json.src) && json.src.every((s) => isString(s.format) && isString(s.location))) {
            return {
                weight: stringOrUndef(json.weight),
                style: stringOrUndef(json.style),
                src: json.src.map((s) => ({ format: s.format, location: URI.parse(s.location) }))
            };
        }
        return undefined;
    }
    IconFontDefinition.fromJSONObject = fromJSONObject;
})(IconFontDefinition || (IconFontDefinition = {}));
class IconRegistry {
    constructor() {
        this._onDidChange = new Emitter();
        this.onDidChange = this._onDidChange.event;
        this.iconSchema = {
            definitions: {
                icons: {
                    type: 'object',
                    properties: {
                        fontId: { type: 'string', description: localize('iconDefinition.fontId', 'The id of the font to use. If not set, the font that is defined first is used.') },
                        fontCharacter: { type: 'string', description: localize('iconDefinition.fontCharacter', 'The font character associated with the icon definition.') }
                    },
                    additionalProperties: false,
                    defaultSnippets: [{ body: { fontCharacter: '\\\\e030' } }]
                }
            },
            type: 'object',
            properties: {}
        };
        this.iconReferenceSchema = { type: 'string', pattern: `^${ThemeIcon.iconNameExpression}$`, enum: [], enumDescriptions: [] };
        this.iconsById = {};
        this.iconFontsById = {};
    }
    registerIcon(id, defaults, description, deprecationMessage) {
        const existing = this.iconsById[id];
        if (existing) {
            if (description && !existing.description) {
                existing.description = description;
                this.iconSchema.properties[id].markdownDescription = `${description} $(${id})`;
                const enumIndex = this.iconReferenceSchema.enum.indexOf(id);
                if (enumIndex !== -1) {
                    this.iconReferenceSchema.enumDescriptions[enumIndex] = description;
                }
                this._onDidChange.fire();
            }
            return existing;
        }
        const iconContribution = { id, description, defaults, deprecationMessage };
        this.iconsById[id] = iconContribution;
        const propertySchema = { $ref: '#/definitions/icons' };
        if (deprecationMessage) {
            propertySchema.deprecationMessage = deprecationMessage;
        }
        if (description) {
            propertySchema.markdownDescription = `${description}: $(${id})`;
        }
        this.iconSchema.properties[id] = propertySchema;
        this.iconReferenceSchema.enum.push(id);
        this.iconReferenceSchema.enumDescriptions.push(description || '');
        this._onDidChange.fire();
        return { id };
    }
    getIcons() {
        return Object.keys(this.iconsById).map(id => this.iconsById[id]);
    }
    getIcon(id) {
        return this.iconsById[id];
    }
    getIconSchema() {
        return this.iconSchema;
    }
    toString() {
        const sorter = (i1, i2) => {
            return i1.id.localeCompare(i2.id);
        };
        const classNames = (i) => {
            while (ThemeIcon.isThemeIcon(i.defaults)) {
                i = this.iconsById[i.defaults.id];
            }
            return `codicon codicon-${i ? i.id : ''}`;
        };
        const reference = [];
        reference.push(`| preview     | identifier                        | default codicon ID                | description`);
        reference.push(`| ----------- | --------------------------------- | --------------------------------- | --------------------------------- |`);
        const contributions = Object.keys(this.iconsById).map(key => this.iconsById[key]);
        for (const i of contributions.filter(i => !!i.description).sort(sorter)) {
            reference.push(`|<i class="${classNames(i)}"></i>|${i.id}|${ThemeIcon.isThemeIcon(i.defaults) ? i.defaults.id : i.id}|${i.description || ''}|`);
        }
        reference.push(`| preview     | identifier                        `);
        reference.push(`| ----------- | --------------------------------- |`);
        for (const i of contributions.filter(i => !ThemeIcon.isThemeIcon(i.defaults)).sort(sorter)) {
            reference.push(`|<i class="${classNames(i)}"></i>|${i.id}|`);
        }
        return reference.join('\n');
    }
}
const iconRegistry = new IconRegistry();
platform.Registry.add(Extensions.IconContribution, iconRegistry);
export function registerIcon(id, defaults, description, deprecationMessage) {
    return iconRegistry.registerIcon(id, defaults, description, deprecationMessage);
}
export function getIconRegistry() {
    return iconRegistry;
}
function initialize() {
    const codiconFontCharacters = getCodiconFontCharacters();
    for (const icon in codiconFontCharacters) {
        const fontCharacter = '\\' + codiconFontCharacters[icon].toString(16);
        iconRegistry.registerIcon(icon, { fontCharacter });
    }
}
initialize();
export const iconsSchemaId = 'vscode://schemas/icons';
const schemaRegistry = platform.Registry.as(JSONExtensions.JSONContribution);
schemaRegistry.registerSchema(iconsSchemaId, iconRegistry.getIconSchema());
const delayer = new RunOnceScheduler(() => schemaRegistry.notifySchemaChanged(iconsSchemaId), 200);
iconRegistry.onDidChange(() => {
    if (!delayer.isScheduled()) {
        delayer.schedule();
    }
});
//setTimeout(_ => console.log(iconRegistry.toString()), 5000);
// common icons
export const widgetClose = registerIcon('widget-close', Codicon.close, localize('widgetClose', 'Icon for the close action in widgets.'));
export const gotoPreviousLocation = registerIcon('goto-previous-location', Codicon.arrowUp, localize('previousChangeIcon', 'Icon for goto previous editor location.'));
export const gotoNextLocation = registerIcon('goto-next-location', Codicon.arrowDown, localize('nextChangeIcon', 'Icon for goto next editor location.'));
export const syncing = ThemeIcon.modify(Codicon.sync, 'spin');
export const spinningLoading = ThemeIcon.modify(Codicon.loading, 'spin');
