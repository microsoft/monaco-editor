import { Diagnostic } from '../../src/types';

/**
 * Per-document cache of the last set of LSP `Diagnostic` objects received
 * from the server (via `publishDiagnostics` or `textDocument/diagnostic`).
 *
 * Monaco's `IMarker` model can't carry the full Diagnostic shape: `data` and
 * `codeDescription` have no corresponding IMarker field, so once a Diagnostic
 * is translated to a marker those values are lost. Features that need to
 * round-trip the original Diagnostic to the server (notably
 * `textDocument/codeAction`, which the spec requires to include `data`) read
 * from this cache to recover the missing fields.
 *
 * Keyed by Monaco URI string (`model.uri.toString()`) so cleanup can be done
 * directly from `monaco.editor.onWillDisposeModel` without needing the
 * text-model bridge.
 */
export class DiagnosticsCache {
    private readonly _byUri = new Map<string, readonly Diagnostic[]>();

    public set(uri: string, diagnostics: readonly Diagnostic[]): void {
        this._byUri.set(uri, diagnostics);
    }

    public get(uri: string): readonly Diagnostic[] | undefined {
        return this._byUri.get(uri);
    }

    public delete(uri: string): void {
        this._byUri.delete(uri);
    }
}
