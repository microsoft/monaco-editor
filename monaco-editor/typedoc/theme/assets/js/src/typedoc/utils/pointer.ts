/**
 * Simple point interface.
 */
export interface Point {
    x: number;
    y: number;
}

/**
 * Event name of the pointer down event.
 */
export let pointerDown: string = "mousedown";

/**
 * Event name of the pointer move event.
 */
export let pointerMove: string = "mousemove";

/**
 * Event name of the pointer up event.
 */
export let pointerUp: string = "mouseup";

/**
 * Position the pointer was pressed at.
 */
export const pointerDownPosition: Point = { x: 0, y: 0 };

/**
 * Should the next click on the document be supressed?
 */
export let preventNextClick: boolean = false;

/**
 * Is the pointer down?
 */
export let isPointerDown: boolean = false;

/**
 * Is the pointer a touch point?
 */
export let isPointerTouch: boolean = false;

/**
 * Did the pointer move since the last down event?
 */
export let hasPointerMoved: boolean = false;

/**
 * Is the user agent a mobile agent?
 */
export const isMobile: boolean = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
);
document.documentElement.classList.add(isMobile ? "is-mobile" : "not-mobile");

if (isMobile && "ontouchstart" in document.documentElement) {
    isPointerTouch = true;
    pointerDown = "touchstart";
    pointerMove = "touchmove";
    pointerUp = "touchend";
}

document.addEventListener(pointerDown, (e) => {
    isPointerDown = true;
    hasPointerMoved = false;
    const t =
        pointerDown == "touchstart"
            ? (e as TouchEvent).targetTouches[0]
            : (e as MouseEvent);
    pointerDownPosition.y = t.pageY || 0;
    pointerDownPosition.x = t.pageX || 0;
});

document.addEventListener(pointerMove, (e) => {
    if (!isPointerDown) return;
    if (!hasPointerMoved) {
        const t =
            pointerDown == "touchstart"
                ? (e as TouchEvent).targetTouches[0]
                : (e as MouseEvent);
        const x = pointerDownPosition.x - (t.pageX || 0);
        const y = pointerDownPosition.y - (t.pageY || 0);
        hasPointerMoved = Math.sqrt(x * x + y * y) > 10;
    }
});

document.addEventListener(pointerUp, () => {
    isPointerDown = false;
});

document.addEventListener("click", (e) => {
    if (preventNextClick) {
        e.preventDefault();
        e.stopImmediatePropagation();
        preventNextClick = false;
    }
});
