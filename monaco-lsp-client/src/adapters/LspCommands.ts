import * as monaco from 'monaco-editor-core';
import { api, capabilities, Command } from '../../src/types';
import { Disposable } from '../utils';
import { LspCapabilitiesRegistry } from './LspCapabilitiesRegistry';
import { LspCommandPolicy } from './LspCommandPolicy';

let instanceCounter = 0;

/**
 * Converts commands from a language server into Monaco commands that are safe to execute.
 * See {@link LspCommandPolicy}.
 */
export class LspCommands extends Disposable {
    private readonly _policy: LspCommandPolicy;
    private readonly _executeServerCommandId = `_monacoLspClient.executeServerCommand.${instanceCounter++}`;

    constructor(
        private readonly _server: typeof api.TServerInterface,
        capabilitiesRegistry: LspCapabilitiesRegistry,
        allowedLocalCommands: readonly string[] | undefined,
    ) {
        super();

        this._policy = new LspCommandPolicy(allowedLocalCommands);

        this._register(capabilitiesRegistry.addStaticClientCapabilities({
            workspace: {
                executeCommand: {
                    dynamicRegistration: true,
                }
            }
        }));

        this._register(capabilitiesRegistry.registerCapabilityHandler(capabilities.workspaceExecuteCommand, true, capability => {
            return this._policy.addServerCommands(capability.commands);
        }));

        this._register(monaco.editor.registerCommand(this._executeServerCommandId, (_accessor, command: unknown, args: unknown) => {
            return this._executeServerCommand(command, args);
        }));
    }

    private async _executeServerCommand(command: unknown, args: unknown): Promise<void> {
        if (!this._policy.isServerCommand(command)) {
            return;
        }
        await this._server.workspaceExecuteCommand({
            command,
            arguments: Array.isArray(args) ? args : undefined,
        });
    }

    /**
     * Returns undefined if the command must not be executed.
     */
    toMonacoCommand(command: Command | undefined | null): monaco.languages.Command | undefined {
        const resolved = this._policy.resolve(command);
        if (!command || !resolved) {
            return undefined;
        }
        if (resolved.kind === 'server') {
            return {
                id: this._executeServerCommandId,
                title: command.title,
                arguments: [resolved.command, resolved.arguments],
            };
        }
        return {
            id: resolved.id,
            title: command.title,
            arguments: resolved.arguments,
        };
    }
}
