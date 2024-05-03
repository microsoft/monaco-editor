import { IPlaygroundProject } from "../../../shared";

export function findLastIndex<T>(
	array: T[],
	predicate: (value: T) => boolean
): number {
	for (let i = array.length - 1; i >= 0; i--) {
		if (predicate(array[i])) {
			return i;
		}
	}
	return -1;
}
export function projectEquals(
	project1: IPlaygroundProject,
	project2: IPlaygroundProject
): boolean {
	return (
		normalizeLineEnding(project1.css) ===
			normalizeLineEnding(project2.css) &&
		normalizeLineEnding(project1.html) ===
			normalizeLineEnding(project2.html) &&
		normalizeLineEnding(project1.js) === normalizeLineEnding(project2.js)
	);
}
export function normalizeLineEnding(str: string): string {
	return str.replace(/\r\n/g, "\n");
}
