import { IDisposable } from '../utils';

/**
 * Local editor commands that a language server may trigger without further configuration.
 * They only open editor UI and cannot modify the document or reach the host.
 */
export const defaultAllowedLocalCommands: readonly string[] = [
    'editor.action.triggerSuggest',
    'editor.action.triggerParameterHints',
];

export interface LspCommand {
    readonly command: unknown;
    readonly arguments?: unknown;
}

export type ResolvedLspCommand =
    | { readonly kind: 'server'; readonly command: string; readonly arguments: unknown[] | undefined }
    | { readonly kind: 'local'; readonly id: string; readonly arguments: unknown[] | undefined };

/**
 * Decides how commands that come from a language server may be executed.
 *
 * Language server responses are untrusted input. A command is only executed if
 * - the server advertised it (`executeCommandProvider.commands`), in which case it is sent back
 *   to the server via `workspace/executeCommand` and never runs as a local editor command, or
 * - it is an allowed local editor command (see {@link defaultAllowedLocalCommands} and the embedder's allowlist).
 *
 * All other commands are dropped.
 */
export class LspCommandPolicy {
    private readonly _allowedLocalCommands: ReadonlySet<string>;
    private readonly _serverCommands = new Map</* command */ string, /* registration count */ number>();

    constructor(allowedLocalCommands: readonly string[] = []) {
        this._allowedLocalCommands = new Set([...defaultAllowedLocalCommands, ...allowedLocalCommands]);
    }

    addServerCommands(commands: readonly unknown[] | undefined): IDisposable {
        const added = (Array.isArray(commands) ? commands : []).filter((c): c is string => typeof c === 'string');
        for (const c of added) {
            this._serverCommands.set(c, (this._serverCommands.get(c) ?? 0) + 1);
        }
        let disposed = false;
        return {
            dispose: () => {
                if (disposed) {
                    return;
                }
                disposed = true;
                for (const c of added) {
                    const count = (this._serverCommands.get(c) ?? 0) - 1;
                    if (count > 0) {
                        this._serverCommands.set(c, count);
                    } else {
                        this._serverCommands.delete(c);
                    }
                }
            },
        };
    }

    isServerCommand(command: unknown): command is string {
        return typeof command === 'string' && this._serverCommands.has(command);
    }

    resolve(command: LspCommand | undefined | null): ResolvedLspCommand | undefined {
        if (!command || typeof command.command !== 'string' || command.command === '') {
            return undefined;
        }
        const args = Array.isArray(command.arguments) ? command.arguments : undefined;
        if (this.isServerCommand(command.command)) {
            return { kind: 'server', command: command.command, arguments: args };
        }
        if (this._allowedLocalCommands.has(command.command)) {
            return { kind: 'local', id: command.command, arguments: args };
        }
        return undefined;
    }
}

/**
 * `command:` URIs execute local editor commands when opened, so links from a language server must not use them.
 */
export function isCommandUri(target: string): boolean {
    return /^\s*command:/i.test(target);
}
