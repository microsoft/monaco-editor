declare module 'loader-utils' {
	export function interpolateName(loaderContext: any, name: string, options?: any): string;

	export function stringifyRequest(loaderContext: any, resource: string): string;
}
