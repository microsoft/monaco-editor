/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ModularTypeScriptWorker, ModuleConfig } from '../moduleLoader';
import { MINIMAL_CONFIG, FULL_CONFIG } from '../configs/sampleConfigs';

// Mock worker context and create data for testing
const mockWorkerContext = {
	getMirrorModels: () => [],
	// Add other required methods as needed
} as any;

const mockCreateData = {
	compilerOptions: {},
	extraLibs: {},
	inlayHintsOptions: {}
};

describe('ModularTypeScriptWorker', () => {
	it('should create worker with minimal configuration', () => {
		const worker = new ModularTypeScriptWorker(mockWorkerContext, mockCreateData, MINIMAL_CONFIG);

		expect(worker.hasModule('diagnostics')).toBe(true);
		expect(worker.hasModule('completions')).toBe(true);
		expect(worker.hasModule('navigation')).toBe(false);
		expect(worker.hasModule('formatting')).toBe(false);
		expect(worker.hasModule('refactoring')).toBe(false);
		expect(worker.hasModule('emit')).toBe(false);
		expect(worker.hasModule('inlayHints')).toBe(false);
	});

	it('should create worker with full configuration', () => {
		const worker = new ModularTypeScriptWorker(mockWorkerContext, mockCreateData, FULL_CONFIG);

		expect(worker.hasModule('diagnostics')).toBe(true);
		expect(worker.hasModule('completions')).toBe(true);
		expect(worker.hasModule('navigation')).toBe(true);
		expect(worker.hasModule('formatting')).toBe(true);
		expect(worker.hasModule('refactoring')).toBe(true);
		expect(worker.hasModule('emit')).toBe(true);
		expect(worker.hasModule('inlayHints')).toBe(true);
	});

	it('should return enabled modules list', () => {
		const worker = new ModularTypeScriptWorker(mockWorkerContext, mockCreateData, MINIMAL_CONFIG);
		const enabledModules = worker.getEnabledModules();

		expect(enabledModules).toContain('diagnostics');
		expect(enabledModules).toContain('completions');
		expect(enabledModules).not.toContain('navigation');
		expect(enabledModules).not.toContain('formatting');
	});

	it('should update module configuration', () => {
		const worker = new ModularTypeScriptWorker(mockWorkerContext, mockCreateData, MINIMAL_CONFIG);

		// Initially minimal
		expect(worker.hasModule('navigation')).toBe(false);

		// Update to full configuration
		worker.updateModuleConfig(FULL_CONFIG);

		// Now should have all modules
		expect(worker.hasModule('navigation')).toBe(true);
		expect(worker.hasModule('formatting')).toBe(true);
		expect(worker.hasModule('refactoring')).toBe(true);
	});

	it('should handle disabled module method calls gracefully', async () => {
		const worker = new ModularTypeScriptWorker(mockWorkerContext, mockCreateData, MINIMAL_CONFIG);

		// These should return empty results since modules are disabled
		const diagnostics = await worker.getSyntacticDiagnostics('test.ts');
		const completions = await worker.getCompletionsAtPosition('test.ts', 0);
		const navigation = await worker.getDefinitionAtPosition('test.ts', 0);

		expect(diagnostics).toEqual([]);
		expect(completions).toBeUndefined();
		expect(navigation).toBeUndefined();
	});
});
