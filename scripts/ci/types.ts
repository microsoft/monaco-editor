export interface PackageJson {
	version: string;
	vscodeRef?: string;
	vscodeCommitId?: string;
	devDependencies: Record<string, string>;
}
