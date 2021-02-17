import { Component, IComponentOptions } from "../Component";
import { hasPointerMoved, pointerDown, pointerUp } from "../utils/pointer";

export class Toggle extends Component {
    active?: boolean;

    className: string;

    constructor(options: IComponentOptions) {
        super(options);

        this.className = this.el.dataset.toggle || "";
        this.el.addEventListener(pointerUp, (e) => this.onPointerUp(e));
        this.el.addEventListener("click", (e) => e.preventDefault());
        document.addEventListener(pointerDown, (e) =>
            this.onDocumentPointerDown(e)
        );
        document.addEventListener(pointerUp, (e) =>
            this.onDocumentPointerUp(e)
        );
    }

    setActive(value: boolean) {
        if (this.active == value) return;
        this.active = value;

        document.documentElement.classList.toggle(
            "has-" + this.className,
            value
        );
        this.el.classList.toggle("active", value);

        const transition =
            (this.active ? "to-has-" : "from-has-") + this.className;
        document.documentElement.classList.add(transition);
        setTimeout(
            () => document.documentElement.classList.remove(transition),
            500
        );
    }

    onPointerUp(event: Event) {
        if (hasPointerMoved) return;
        this.setActive(true);
        event.preventDefault();
    }

    onDocumentPointerDown(e: Event) {
        if (this.active) {
            if (
                (e.target as HTMLElement).closest(
                    ".col-menu, .tsd-filter-group"
                )
            ) {
                return;
            }

            this.setActive(false);
        }
    }

    onDocumentPointerUp(e: Event) {
        if (hasPointerMoved) return;
        if (this.active) {
            if ((e.target as HTMLElement).closest(".col-menu")) {
                const link = (e.target as HTMLElement).closest("a");
                if (link) {
                    let href = window.location.href;
                    if (href.indexOf("#") != -1) {
                        href = href.substr(0, href.indexOf("#"));
                    }
                    if (link.href.substr(0, href.length) == href) {
                        setTimeout(() => this.setActive(false), 250);
                    }
                }
            }
        }
    }
}
