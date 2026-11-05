import * as monaco from 'monaco-editor-core';
import { capabilities, CodeLensRegistrationOptions, CodeLens, Command } from '../../../src/types';
import { Disposable } from '../../utils';
import { LspConnection } from '../LspConnection';
import { toMonacoLanguageSelector } from './common';
import { assertTargetTextModel } from '../ITextModelBridge';

export class LspCodeLensFeature extends Disposable {
    constructor(
        private readonly _connection: LspConnection,
    ) {
        super();

        this._register(this._connection.capabilities.addStaticClientCapabilities({
            textDocument: {
                codeLens: {
                    dynamicRegistration: true,
                }
            }
        }));

        this._register(this._connection.capabilities.registerCapabilityHandler(capabilities.textDocumentCodeLens, true, capability => {
            return monaco.languages.registerCodeLensProvider(
                toMonacoLanguageSelector(capability.documentSelector),
                new LspCodeLensProvider(this._connection, capability),
            );
        }));
    }
}

interface ExtendedCodeLens extends monaco.languages.CodeLens {
    _lspCodeLens?: CodeLens;
}

class LspCodeLensProvider implements monaco.languages.CodeLensProvider {
    constructor(
        private readonly _client: LspConnection,
        private readonly _capabilities: CodeLensRegistrationOptions,
    ) { }

    async provideCodeLenses(
        model: monaco.editor.ITextModel,
        token: monaco.CancellationToken
    ): Promise<monaco.languages.CodeLensList | null> {
        const translated = this._client.bridge.translate(model, new monaco.Position(1, 1));

        const result = await this._client.server.textDocumentCodeLens({
            textDocument: translated.textDocument,
        });

        if (!result) {
            return null;
        }

        return {
            lenses: result.map(lens => {
                const monacoLens: ExtendedCodeLens = {
                    range: assertTargetTextModel(this._client.bridge.translateBackRange(translated.textDocument, lens.range), model).range,
                    command: toMonacoCodeLensCommand(lens.command, this._client),
                    _lspCodeLens: lens,
                };
                return monacoLens;
            }),
            dispose: () => { },
        };
    }

    async resolveCodeLens(
        model: monaco.editor.ITextModel,
        codeLens: ExtendedCodeLens,
        token: monaco.CancellationToken
    ): Promise<monaco.languages.CodeLens> {
        if (!this._capabilities.resolveProvider || !codeLens._lspCodeLens) {
            return codeLens;
        }

        const resolved = await this._client.server.codeLensResolve(codeLens._lspCodeLens);

        if (resolved.command) {
            codeLens.command = toMonacoCodeLensCommand(resolved.command, this._client);
        }

        return codeLens;
    }
}

/**
 * Keeps the title of commands that must not be executed, so that the code lens is still shown (but is not clickable).
 */
function toMonacoCodeLensCommand(command: Command | undefined, client: LspConnection): monaco.languages.Command | undefined {
    if (!command) {
        return undefined;
    }
    return client.commands.toMonacoCommand(command) ?? { id: '', title: command.title };
}
