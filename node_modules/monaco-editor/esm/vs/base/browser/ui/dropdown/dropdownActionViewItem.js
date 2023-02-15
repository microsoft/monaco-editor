import { $, append } from '../../dom.js';
import { BaseActionViewItem } from '../actionbar/actionViewItems.js';
import { DropdownMenu } from './dropdown.js';
import { Emitter } from '../../../common/event.js';
import './dropdown.css';
export class DropdownMenuActionViewItem extends BaseActionViewItem {
    constructor(action, menuActionsOrProvider, contextMenuProvider, options = Object.create(null)) {
        super(null, action, options);
        this.actionItem = null;
        this._onDidChangeVisibility = this._register(new Emitter());
        this.onDidChangeVisibility = this._onDidChangeVisibility.event;
        this.menuActionsOrProvider = menuActionsOrProvider;
        this.contextMenuProvider = contextMenuProvider;
        this.options = options;
        if (this.options.actionRunner) {
            this.actionRunner = this.options.actionRunner;
        }
    }
    render(container) {
        this.actionItem = container;
        const labelRenderer = (el) => {
            this.element = append(el, $('a.action-label'));
            let classNames = [];
            if (typeof this.options.classNames === 'string') {
                classNames = this.options.classNames.split(/\s+/g).filter(s => !!s);
            }
            else if (this.options.classNames) {
                classNames = this.options.classNames;
            }
            // todo@aeschli: remove codicon, should come through `this.options.classNames`
            if (!classNames.find(c => c === 'icon')) {
                classNames.push('codicon');
            }
            this.element.classList.add(...classNames);
            this.element.setAttribute('role', 'button');
            this.element.setAttribute('aria-haspopup', 'true');
            this.element.setAttribute('aria-expanded', 'false');
            this.element.title = this._action.label || '';
            this.element.ariaLabel = this._action.label || '';
            return null;
        };
        const isActionsArray = Array.isArray(this.menuActionsOrProvider);
        const options = {
            contextMenuProvider: this.contextMenuProvider,
            labelRenderer: labelRenderer,
            menuAsChild: this.options.menuAsChild,
            actions: isActionsArray ? this.menuActionsOrProvider : undefined,
            actionProvider: isActionsArray ? undefined : this.menuActionsOrProvider
        };
        this.dropdownMenu = this._register(new DropdownMenu(container, options));
        this._register(this.dropdownMenu.onDidChangeVisibility(visible => {
            var _a;
            (_a = this.element) === null || _a === void 0 ? void 0 : _a.setAttribute('aria-expanded', `${visible}`);
            this._onDidChangeVisibility.fire(visible);
        }));
        this.dropdownMenu.menuOptions = {
            actionViewItemProvider: this.options.actionViewItemProvider,
            actionRunner: this.actionRunner,
            getKeyBinding: this.options.keybindingProvider,
            context: this._context
        };
        if (this.options.anchorAlignmentProvider) {
            const that = this;
            this.dropdownMenu.menuOptions = Object.assign(Object.assign({}, this.dropdownMenu.menuOptions), { get anchorAlignment() {
                    return that.options.anchorAlignmentProvider();
                } });
        }
        this.updateTooltip();
        this.updateEnabled();
    }
    getTooltip() {
        let title = null;
        if (this.action.tooltip) {
            title = this.action.tooltip;
        }
        else if (this.action.label) {
            title = this.action.label;
        }
        return title !== null && title !== void 0 ? title : undefined;
    }
    setActionContext(newContext) {
        super.setActionContext(newContext);
        if (this.dropdownMenu) {
            if (this.dropdownMenu.menuOptions) {
                this.dropdownMenu.menuOptions.context = newContext;
            }
            else {
                this.dropdownMenu.menuOptions = { context: newContext };
            }
        }
    }
    show() {
        var _a;
        (_a = this.dropdownMenu) === null || _a === void 0 ? void 0 : _a.show();
    }
    updateEnabled() {
        var _a, _b;
        const disabled = !this.action.enabled;
        (_a = this.actionItem) === null || _a === void 0 ? void 0 : _a.classList.toggle('disabled', disabled);
        (_b = this.element) === null || _b === void 0 ? void 0 : _b.classList.toggle('disabled', disabled);
    }
}
