/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { MarkdownRendererService } from 'monaco-editor-core/esm/vs/platform/markdown/browser/markdownRenderer';
import { CodeEditorWidget } from 'monaco-editor-core/esm/vs/editor/browser/widget/codeEditor/codeEditorWidget';

/**
 * Value of the `markdownImages.allowedOrigins` editor option:
 * `true` allows all remote images, a list allows images from these origins only.
 */
export type AllowedImageOrigins = true | readonly string[];

/**
 * Remote images in Markdown rendered by the editor (hovers, suggestion details, parameter hints, ...)
 * are blocked unless their origin is allowed by the `markdownImages.allowedOrigins` editor option.
 * The renderer always allows `data:` images.
 */
export function isRemoteImageAllowed(
	url: string,
	allowedOrigins: AllowedImageOrigins | undefined
): boolean {
	if (allowedOrigins === true) {
		return true;
	}
	if (!Array.isArray(allowedOrigins) || allowedOrigins.length === 0) {
		return false;
	}
	const origin = getOrigin(url);
	return origin !== undefined && allowedOrigins.some((allowed) => getOrigin(allowed) === origin);
}

function getOrigin(url: string): string | undefined {
	try {
		const origin = new URL(url).origin;
		return origin === 'null' ? undefined : origin;
	} catch {
		return undefined;
	}
}

function getAllowedOrigins(context: unknown): AllowedImageOrigins | undefined {
	const editor = context as { getRawOptions?: () => any } | undefined;
	if (typeof editor?.getRawOptions !== 'function') {
		return undefined;
	}
	return editor.getRawOptions()?.markdownImages?.allowedOrigins;
}

const patchAppliedKey = '__monacoMarkdownImagesPatchApplied';
const proto = MarkdownRendererService.prototype as any;
const editorProto = CodeEditorWidget.prototype as any;

if (!proto[patchAppliedKey]) {
	const originalRender = proto.render;
	proto.render = function (markdown: unknown, options: any, outElement: unknown) {
		if (options?.sanitizerConfig?.remoteImageIsAllowed) {
			return originalRender.call(this, markdown, options, outElement);
		}
		const allowedOrigins = getAllowedOrigins(options?.context);
		return originalRender.call(
			this,
			markdown,
			{
				...options,
				sanitizerConfig: {
					...options?.sanitizerConfig,
					remoteImageIsAllowed: (uri: { toString(): string }) =>
						isRemoteImageAllowed(uri.toString(), allowedOrigins)
				}
			},
			outElement
		);
	};
	proto[patchAppliedKey] = true;

	// The editor only keeps options it knows on `updateOptions`, so store this one in its raw options.
	const originalUpdateOptions = editorProto.updateOptions;
	editorProto.updateOptions = function (newOptions: any) {
		if (newOptions && Object.prototype.hasOwnProperty.call(newOptions, 'markdownImages')) {
			const rawOptions = this.getRawOptions?.();
			if (rawOptions) {
				rawOptions.markdownImages = { ...rawOptions.markdownImages, ...newOptions.markdownImages };
			}
		}
		return originalUpdateOptions.call(this, newOptions);
	};
}
