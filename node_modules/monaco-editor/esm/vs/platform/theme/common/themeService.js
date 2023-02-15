import { Emitter } from '../../../base/common/event.js';
import { Disposable, toDisposable } from '../../../base/common/lifecycle.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import * as platform from '../../registry/common/platform.js';
import { ColorScheme } from './theme.js';
export const IThemeService = createDecorator('themeService');
export function themeColorFromId(id) {
    return { id };
}
export function getThemeTypeSelector(type) {
    switch (type) {
        case ColorScheme.DARK: return 'vs-dark';
        case ColorScheme.HIGH_CONTRAST_DARK: return 'hc-black';
        case ColorScheme.HIGH_CONTRAST_LIGHT: return 'hc-light';
        default: return 'vs';
    }
}
// static theming participant
export const Extensions = {
    ThemingContribution: 'base.contributions.theming'
};
class ThemingRegistry {
    constructor() {
        this.themingParticipants = [];
        this.themingParticipants = [];
        this.onThemingParticipantAddedEmitter = new Emitter();
    }
    onColorThemeChange(participant) {
        this.themingParticipants.push(participant);
        this.onThemingParticipantAddedEmitter.fire(participant);
        return toDisposable(() => {
            const idx = this.themingParticipants.indexOf(participant);
            this.themingParticipants.splice(idx, 1);
        });
    }
    getThemingParticipants() {
        return this.themingParticipants;
    }
}
const themingRegistry = new ThemingRegistry();
platform.Registry.add(Extensions.ThemingContribution, themingRegistry);
export function registerThemingParticipant(participant) {
    return themingRegistry.onColorThemeChange(participant);
}
/**
 * Utility base class for all themable components.
 */
export class Themable extends Disposable {
    constructor(themeService) {
        super();
        this.themeService = themeService;
        this.theme = themeService.getColorTheme();
        // Hook up to theme changes
        this._register(this.themeService.onDidColorThemeChange(theme => this.onThemeChange(theme)));
    }
    onThemeChange(theme) {
        this.theme = theme;
        this.updateStyles();
    }
    updateStyles() {
        // Subclasses to override
    }
}
