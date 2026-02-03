// @ts-check
// Mock browser globals for Node.js test environment

if (typeof globalThis.customElements === 'undefined') {
	const registry = new Map();
	globalThis.customElements = {
		define(name, constructor, options) {
			registry.set(name, { constructor, options });
		},
		get(name) {
			const entry = registry.get(name);
			return entry?.constructor;
		},
		upgrade(_root) { },
		whenDefined(name) {
			return registry.has(name) ? Promise.resolve(registry.get(name).constructor) : new Promise(() => { });
		}
	};
}
