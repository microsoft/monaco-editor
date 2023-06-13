export function getEnv(): {
	VSCODE_REF: string | undefined;
	PRERELEASE_VERSION: string | undefined;
} {
	return process.env as any;
}
