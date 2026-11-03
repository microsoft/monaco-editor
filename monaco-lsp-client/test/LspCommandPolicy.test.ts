import assert from 'node:assert/strict';
import { test } from 'node:test';
import { defaultAllowedLocalCommands, isCommandUri, LspCommandPolicy } from '../src/adapters/LspCommandPolicy';

test('drops commands that are neither advertised by the server nor allowed locally', () => {
    const policy = new LspCommandPolicy();
    assert.equal(policy.resolve({ command: 'type', arguments: [{ text: 'injected' }] }), undefined);
    assert.equal(policy.resolve({ command: 'workbench.action.terminal.sendSequence', arguments: [{ text: 'x' }] }), undefined);
    assert.equal(policy.resolve({ command: 'editor.action.clipboardPasteAction' }), undefined);
});

test('drops missing and malformed commands', () => {
    const policy = new LspCommandPolicy();
    policy.addServerCommands(['server.cmd']);
    assert.equal(policy.resolve(undefined), undefined);
    assert.equal(policy.resolve(null), undefined);
    assert.equal(policy.resolve({ command: '' }), undefined);
    assert.equal(policy.resolve({ command: 42 }), undefined);
    assert.equal(policy.resolve({ command: { toString: () => 'server.cmd' } }), undefined);
});

test('routes server-advertised commands to the server', () => {
    const policy = new LspCommandPolicy();
    policy.addServerCommands(['server.applyFix', 'type']);
    assert.deepEqual(policy.resolve({ command: 'server.applyFix', arguments: [1, 'a'] }), {
        kind: 'server',
        command: 'server.applyFix',
        arguments: [1, 'a'],
    });
    // A server command that shares its id with a local editor command still goes to the server.
    assert.deepEqual(policy.resolve({ command: 'type', arguments: [{ text: 'x' }] }), {
        kind: 'server',
        command: 'type',
        arguments: [{ text: 'x' }],
    });
});

test('ignores non-string advertised commands', () => {
    const policy = new LspCommandPolicy();
    policy.addServerCommands([1, null, 'ok']);
    assert.equal(policy.isServerCommand('ok'), true);
    assert.equal(policy.isServerCommand('1'), false);
    policy.addServerCommands(undefined);
});

test('forgets server commands when their registration is disposed', () => {
    const policy = new LspCommandPolicy();
    const a = policy.addServerCommands(['server.cmd']);
    const b = policy.addServerCommands(['server.cmd']);
    a.dispose();
    a.dispose();
    assert.equal(policy.isServerCommand('server.cmd'), true);
    b.dispose();
    assert.equal(policy.isServerCommand('server.cmd'), false);
    assert.equal(policy.resolve({ command: 'server.cmd' }), undefined);
});

test('allows the default local commands', () => {
    const policy = new LspCommandPolicy();
    for (const id of defaultAllowedLocalCommands) {
        assert.deepEqual(policy.resolve({ command: id }), { kind: 'local', id, arguments: undefined });
    }
});

test('allows local commands from the embedder allowlist', () => {
    const policy = new LspCommandPolicy(['host.showReferences']);
    assert.deepEqual(policy.resolve({ command: 'host.showReferences', arguments: ['a'] }), {
        kind: 'local',
        id: 'host.showReferences',
        arguments: ['a'],
    });
    assert.equal(policy.resolve({ command: 'host.other' }), undefined);
});

test('drops non-array arguments', () => {
    const policy = new LspCommandPolicy();
    policy.addServerCommands(['server.cmd']);
    assert.deepEqual(policy.resolve({ command: 'server.cmd', arguments: { length: 1, 0: 'x' } }), {
        kind: 'server',
        command: 'server.cmd',
        arguments: undefined,
    });
});

test('detects command URIs', () => {
    assert.equal(isCommandUri('command:type?%5B%5D'), true);
    assert.equal(isCommandUri('COMMAND:type'), true);
    assert.equal(isCommandUri('  command:type'), true);
    assert.equal(isCommandUri('https://example.com/command:type'), false);
    assert.equal(isCommandUri('file:///a/b.ts'), false);
});
