import { Component, IComponentOptions } from "../Component";
import { pointerDown, pointerUp } from "../utils/pointer";

abstract class FilterItem<T> {
    protected key: string;

    protected value: T;

    protected defaultValue: T;

    constructor(key: string, value: T) {
        this.key = key;
        this.value = value;
        this.defaultValue = value;

        this.initialize();

        if (window.localStorage[this.key]) {
            this.setValue(this.fromLocalStorage(window.localStorage[this.key]));
        }
    }

    protected initialize() {}

    protected abstract handleValueChange(oldValue: T, newValue: T): void;

    protected abstract fromLocalStorage(value: string): T;

    protected abstract toLocalStorage(value: T): string;

    protected setValue(value: T) {
        if (this.value == value) return;

        const oldValue = this.value;
        this.value = value;
        window.localStorage[this.key] = this.toLocalStorage(value);

        this.handleValueChange(oldValue, value);
    }
}

class FilterItemCheckbox extends FilterItem<boolean> {
    private checkbox!: HTMLInputElement;

    protected initialize() {
        const checkbox = document.querySelector<HTMLInputElement>(
            "#tsd-filter-" + this.key
        );
        if (!checkbox) return;

        this.checkbox = checkbox;
        this.checkbox.addEventListener("change", () => {
            this.setValue(this.checkbox.checked);
        });
    }

    protected handleValueChange(oldValue: boolean, newValue: boolean) {
        if (!this.checkbox) return;
        this.checkbox.checked = this.value;
        document.documentElement.classList.toggle(
            "toggle-" + this.key,
            this.value != this.defaultValue
        );
    }

    protected fromLocalStorage(value: string): boolean {
        return value == "true";
    }

    protected toLocalStorage(value: boolean): string {
        return value ? "true" : "false";
    }
}

class FilterItemSelect extends FilterItem<string> {
    private select!: HTMLElement;

    protected initialize() {
        document.documentElement.classList.add(
            "toggle-" + this.key + this.value
        );

        const select = document.querySelector<HTMLElement>(
            "#tsd-filter-" + this.key
        );
        if (!select) return;

        this.select = select;
        const onActivate = () => {
            this.select.classList.add("active");
        };
        const onDeactivate = () => {
            this.select.classList.remove("active");
        };

        this.select.addEventListener(pointerDown, onActivate);
        this.select.addEventListener("mouseover", onActivate);
        this.select.addEventListener("mouseleave", onDeactivate);

        this.select.querySelectorAll("li").forEach((el) => {
            el.addEventListener(pointerUp, (e) => {
                select.classList.remove("active");
                this.setValue((e.target as HTMLElement).dataset.value || "");
            });
        });

        document.addEventListener(pointerDown, (e) => {
            if (this.select.contains(e.target as HTMLElement)) return;

            this.select.classList.remove("active");
        });
    }

    protected handleValueChange(oldValue: string, newValue: string) {
        this.select.querySelectorAll("li.selected").forEach((el) => {
            el.classList.remove("selected");
        });

        const selected = this.select.querySelector<HTMLElement>(
            'li[data-value="' + newValue + '"]'
        );
        const label = this.select.querySelector<HTMLElement>(
            ".tsd-select-label"
        );

        if (selected && label) {
            selected.classList.add("selected");
            label.textContent = selected.textContent;
        }

        document.documentElement.classList.remove("toggle-" + oldValue);
        document.documentElement.classList.add("toggle-" + newValue);
    }

    protected fromLocalStorage(value: string): string {
        return value;
    }

    protected toLocalStorage(value: string): string {
        return value;
    }
}

export class Filter extends Component {
    private optionVisibility: FilterItemSelect;

    private optionInherited: FilterItemCheckbox;

    private optionExternals: FilterItemCheckbox;

    constructor(options: IComponentOptions) {
        super(options);

        this.optionVisibility = new FilterItemSelect("visibility", "private");
        this.optionInherited = new FilterItemCheckbox("inherited", true);
        this.optionExternals = new FilterItemCheckbox("externals", true);
    }

    static isSupported(): boolean {
        try {
            return typeof window.localStorage != "undefined";
        } catch (e) {
            return false;
        }
    }
}
