import * as monaco from 'monaco-editor-core';
import { capabilities, HoverRegistrationOptions, MarkupContent, MarkedString, MarkupKind } from '../../../src/types';
import { Disposable } from '../../utils';
import { LspConnection } from '../LspConnection';
import { toMonacoLanguageSelector } from './common';

export class LspHoverFeature extends Disposable {
    constructor(
        private readonly _connection: LspConnection,
    ) {
        super();

        this._register(this._connection.capabilities.addStaticClientCapabilities({
            textDocument: {
                hover: {
                    dynamicRegistration: true,
                    contentFormat: [MarkupKind.Markdown, MarkupKind.PlainText],
                }
            }
        }));

        this._register(this._connection.capabilities.registerCapabilityHandler(capabilities.textDocumentHover, true, capability => {
            return monaco.languages.registerHoverProvider(
                toMonacoLanguageSelector(capability.documentSelector),
                new LspHoverProvider(this._connection, capability),
            );
        }));
    }
}

class LspHoverProvider implements monaco.languages.HoverProvider {
    constructor(
        private readonly _client: LspConnection,
        private readonly _capabilities: HoverRegistrationOptions,
    ) { }

    async provideHover(
        model: monaco.editor.ITextModel,
        position: monaco.Position,
        token: monaco.CancellationToken
    ): Promise<monaco.languages.Hover | null> {
        const translated = this._client.bridge.translate(model, position);

        const result = await this._client.server.textDocumentHover({
            textDocument: translated.textDocument,
            position: translated.position,
        });

        if (!result || !result.contents) {
            return null;
        }

        return {
            contents: toMonacoMarkdownString(result.contents),
            range: result.range ? this._client.bridge.translateBackRange(translated.textDocument, result.range).range : undefined,
        };
    }
}

function toMonacoMarkdownString(
    contents: MarkupContent | MarkedString | MarkedString[]
): monaco.IMarkdownString[] {
    if (Array.isArray(contents)) {
        return contents.map(c => toSingleMarkdownString(c));
    }
    return [toSingleMarkdownString(contents)];
}

function toSingleMarkdownString(content: MarkupContent | MarkedString): monaco.IMarkdownString {
    if (typeof content === 'string') {
        return { value: content, isTrusted: true };
    }
    if ('kind' in content) {
        // MarkupContent
        return { value: content.value, isTrusted: true };
    }
    // MarkedString with language
    return { value: `\`\`\`${content.language}\n${content.value}\n\`\`\``, isTrusted: true };
}
