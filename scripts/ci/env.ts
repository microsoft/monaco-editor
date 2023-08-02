interface Env {
	VSCODE_REF: string;
	PRERELEASE_VERSION: string;
}

export function getNightlyEnv(): Env {
	const env: Env = process.env as any;
	if (!env.PRERELEASE_VERSION) {
		throw new Error(`Missing PRERELEASE_VERSION in process.env`);
	}
	if (!env.VSCODE_REF) {
		throw new Error(`Missing VSCODE_REF in process.env`);
	}
	return env;
}
