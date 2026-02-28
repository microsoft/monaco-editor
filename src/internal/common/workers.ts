import { editor } from 'monaco-editor-core';

function createTrustedTypesPolicy<Options extends TrustedTypePolicyOptions>(
	policyName: string,
	policyOptions?: Options
):
	| undefined
	| Pick<
		TrustedTypePolicy<Options>,
		'name' | Extract<keyof Options, keyof TrustedTypePolicyOptions>
	> {
	interface IMonacoEnvironment {
		createTrustedTypesPolicy<Options extends TrustedTypePolicyOptions>(
			policyName: string,
			policyOptions?: Options
		):
			| undefined
			| Pick<
				TrustedTypePolicy<Options>,
				'name' | Extract<keyof Options, keyof TrustedTypePolicyOptions>
			>;
	}
	const monacoEnvironment: IMonacoEnvironment | undefined = (globalThis as any).MonacoEnvironment;

	if (monacoEnvironment?.createTrustedTypesPolicy) {
		try {
			return monacoEnvironment.createTrustedTypesPolicy(policyName, policyOptions);
		} catch (err) {
			console.error(err);
			return undefined;
		}
	}
	try {
		return (globalThis as any).trustedTypes?.createPolicy(policyName, policyOptions);
	} catch (err) {
		console.error(err);
		return undefined;
	}
}

let ttPolicy: ReturnType<typeof createTrustedTypesPolicy>;
if (
	typeof self === 'object' &&
	self.constructor &&
	self.constructor.name === 'DedicatedWorkerGlobalScope' &&
	(globalThis as any).workerttPolicy !== undefined
) {
	ttPolicy = (globalThis as any).workerttPolicy;
} else {
	ttPolicy = createTrustedTypesPolicy('defaultWorkerFactory', {
		createScriptURL: (value) => value
	});
}

function getWorker(descriptor: { label: string; moduleId: string; createWorker?: () => Worker }): Worker | Promise<Worker> {
	const label = descriptor.label;
	// Option for hosts to overwrite the worker script (used in the standalone editor)
	interface IMonacoEnvironment {
		getWorker?(moduleId: string, label: string): Worker | Promise<Worker>;
		getWorkerUrl?(moduleId: string, label: string): string;
	}
	const monacoEnvironment: IMonacoEnvironment | undefined = (globalThis as any).MonacoEnvironment;
	if (monacoEnvironment) {
		if (typeof monacoEnvironment.getWorker === 'function') {
			return monacoEnvironment.getWorker('workerMain.js', label);
		}
		if (typeof monacoEnvironment.getWorkerUrl === 'function') {
			const workerUrl = monacoEnvironment.getWorkerUrl('workerMain.js', label);
			return new Worker(
				ttPolicy ? (ttPolicy.createScriptURL(workerUrl) as unknown as string) : workerUrl,
				{ name: label, type: 'module' }
			);
		}
	}

	if (descriptor.createWorker) {
		return descriptor.createWorker();
	}

	// const esmWorkerLocation = descriptor.esmModuleLocation;
	// if (esmWorkerLocation) {
	// 	const workerUrl = getWorkerBootstrapUrl(label, esmWorkerLocation.toString(true));
	// 	const worker = new Worker(ttPolicy ? ttPolicy.createScriptURL(workerUrl) as unknown as string : workerUrl, { name: label, type: 'module' });
	// 	return whenESMWorkerReady(worker);
	// }

	throw new Error(
		`You must define a function MonacoEnvironment.getWorkerUrl or MonacoEnvironment.getWorker`
	);
}

export function createWebWorker<T extends object>(
	opts: IWebWorkerOptions
): editor.MonacoWebWorker<T> {
	const worker = Promise.resolve(
		getWorker({
			label: opts.label ?? 'monaco-editor-worker',
			moduleId: opts.moduleId,
			createWorker: opts.createWorker,
		})
	).then((w) => {
		w.postMessage('ignore');
		w.postMessage(opts.createData);
		return w;
	});
	return editor.createWebWorker<T>({
		worker,
		host: opts.host,
		keepIdleModels: opts.keepIdleModels
	});
}

export interface IWebWorkerOptions {
	/**
	 * The AMD moduleId to load.
	 * It should export a function `create` that should return the exported proxy.
	 */
	moduleId: string;
	createWorker?: () => Worker,
	/**
	 * The data to send over when calling create on the module.
	 */
	createData?: any;
	/**
	 * A label to be used to identify the web worker for debugging purposes.
	 */
	label?: string;
	/**
	 * An object that can be used by the web worker to make calls back to the main thread.
	 */
	host?: any;
	/**
	 * Keep idle models.
	 * Defaults to false, which means that idle models will stop syncing after a while.
	 */
	keepIdleModels?: boolean;
}
