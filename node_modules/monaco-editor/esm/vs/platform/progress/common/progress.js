import { createDecorator } from '../../instantiation/common/instantiation.js';
export const IProgressService = createDecorator('progressService');
export const emptyProgressRunner = Object.freeze({
    total() { },
    worked() { },
    done() { }
});
class Progress {
    constructor(callback) {
        this.callback = callback;
    }
    report(item) {
        this._value = item;
        this.callback(this._value);
    }
}
Progress.None = Object.freeze({ report() { } });
export { Progress };
export const IEditorProgressService = createDecorator('editorProgressService');
