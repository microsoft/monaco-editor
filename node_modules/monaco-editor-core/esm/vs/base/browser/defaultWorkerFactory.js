/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var _a;
import { logOnceWebWorkerWarning } from '../common/worker/simpleWorker.js';
const ttPolicy = (_a = window.trustedTypes) === null || _a === void 0 ? void 0 : _a.createPolicy('defaultWorkerFactory', { createScriptURL: value => value });
function getWorker(label) {
    const monacoEnvironment = globalThis.MonacoEnvironment;
    if (monacoEnvironment) {
        if (typeof monacoEnvironment.getWorker === 'function') {
            return monacoEnvironment.getWorker('workerMain.js', label);
        }
        if (typeof monacoEnvironment.getWorkerUrl === 'function') {
            const workerUrl = monacoEnvironment.getWorkerUrl('workerMain.js', label);
            return new Worker(ttPolicy ? ttPolicy.createScriptURL(workerUrl) : workerUrl, { name: label });
        }
    }
    // ESM-comment-begin
    // 	if (typeof require === 'function') {
    // 		// check if the JS lives on a different origin
    // 		const workerMain = require.toUrl('vs/base/worker/workerMain.js'); // explicitly using require.toUrl(), see https://github.com/microsoft/vscode/issues/107440#issuecomment-698982321
    // 		const workerUrl = getWorkerBootstrapUrl(workerMain, label);
    // 		return new Worker(ttPolicy ? ttPolicy.createScriptURL(workerUrl) as unknown as string : workerUrl, { name: label });
    // 	}
    // ESM-comment-end
    throw new Error(`You must define a function MonacoEnvironment.getWorkerUrl or MonacoEnvironment.getWorker`);
}
// ESM-comment-begin
// export function getWorkerBootstrapUrl(scriptPath: string, label: string): string {
// 	if (/^((http:)|(https:)|(file:))/.test(scriptPath) && scriptPath.substring(0, globalThis.origin.length) !== globalThis.origin) {
// 		// this is the cross-origin case
// 		// i.e. the webpage is running at a different origin than where the scripts are loaded from
// 		const myPath = 'vs/base/worker/defaultWorkerFactory.js';
// 		const workerBaseUrl = require.toUrl(myPath).slice(0, -myPath.length); // explicitly using require.toUrl(), see https://github.com/microsoft/vscode/issues/107440#issuecomment-698982321
// 		const js = `/*${label}*/globalThis.MonacoEnvironment={baseUrl: '${workerBaseUrl}'};const ttPolicy = globalThis.trustedTypes?.createPolicy('defaultWorkerFactory', { createScriptURL: value => value });importScripts(ttPolicy?.createScriptURL('${scriptPath}') ?? '${scriptPath}');/*${label}*/`;
// 		const blob = new Blob([js], { type: 'application/javascript' });
// 		return URL.createObjectURL(blob);
// 	}
// 
// 	const start = scriptPath.lastIndexOf('?');
// 	const end = scriptPath.lastIndexOf('#', start);
// 	const params = start > 0
// 		? new URLSearchParams(scriptPath.substring(start + 1, ~end ? end : undefined))
// 		: new URLSearchParams();
// 
// 	COI.addSearchParam(params, true, true);
// 	const search = params.toString();
// 
// 	if (!search) {
// 		return `${scriptPath}#${label}`;
// 	} else {
// 		return `${scriptPath}?${params.toString()}#${label}`;
// 	}
// }
// ESM-comment-end
function isPromiseLike(obj) {
    if (typeof obj.then === 'function') {
        return true;
    }
    return false;
}
/**
 * A worker that uses HTML5 web workers so that is has
 * its own global scope and its own thread.
 */
class WebWorker {
    constructor(moduleId, id, label, onMessageCallback, onErrorCallback) {
        this.id = id;
        const workerOrPromise = getWorker(label);
        if (isPromiseLike(workerOrPromise)) {
            this.worker = workerOrPromise;
        }
        else {
            this.worker = Promise.resolve(workerOrPromise);
        }
        this.postMessage(moduleId, []);
        this.worker.then((w) => {
            w.onmessage = function (ev) {
                onMessageCallback(ev.data);
            };
            w.onmessageerror = onErrorCallback;
            if (typeof w.addEventListener === 'function') {
                w.addEventListener('error', onErrorCallback);
            }
        });
    }
    getId() {
        return this.id;
    }
    postMessage(message, transfer) {
        var _a;
        (_a = this.worker) === null || _a === void 0 ? void 0 : _a.then(w => w.postMessage(message, transfer));
    }
    dispose() {
        var _a;
        (_a = this.worker) === null || _a === void 0 ? void 0 : _a.then(w => w.terminate());
        this.worker = null;
    }
}
class DefaultWorkerFactory {
    constructor(label) {
        this._label = label;
        this._webWorkerFailedBeforeError = false;
    }
    create(moduleId, onMessageCallback, onErrorCallback) {
        const workerId = (++DefaultWorkerFactory.LAST_WORKER_ID);
        if (this._webWorkerFailedBeforeError) {
            throw this._webWorkerFailedBeforeError;
        }
        return new WebWorker(moduleId, workerId, this._label || 'anonymous' + workerId, onMessageCallback, (err) => {
            logOnceWebWorkerWarning(err);
            this._webWorkerFailedBeforeError = err;
            onErrorCallback(err);
        });
    }
}
DefaultWorkerFactory.LAST_WORKER_ID = 0;
export { DefaultWorkerFactory };
