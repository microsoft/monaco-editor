# Modular TypeScript Worker

This directory contains a modular implementation of the TypeScript service worker, allowing you to enable or disable specific language features based on your needs.

## Overview

The modular TypeScript worker splits the monolithic `TypeScriptWorker` class into focused modules:

- **ScriptHost**: Manages TypeScript language service host functionality
- **DiagnosticsModule**: Handles syntax, semantic, and suggestion diagnostics
- **CompletionsModule**: Provides code completion and signature help
- **NavigationModule**: Handles go-to-definition, references, and navigation
- **FormattingModule**: Provides code formatting capabilities
- **RefactoringModule**: Handles rename operations and code fixes
- **EmitModule**: Manages TypeScript compilation and emit
- **InlayHintsModule**: Provides inlay hints functionality

## Usage

### Basic Usage

```typescript
import { ModularTypeScriptWorker, ModuleConfig } from './worker/moduleLoader';

// Create a worker with all modules enabled (default)
const worker = new ModularTypeScriptWorker(ctx, createData);

// Create a worker with custom module configuration
const config: ModuleConfig = {
    enableDiagnostics: true,
    enableCompletions: true,
    enableNavigation: false,
    enableFormatting: false,
    enableRefactoring: false,
    enableEmit: false,
    enableInlayHints: false
};

const minimalWorker = new ModularTypeScriptWorker(ctx, createData, config);
```

### Using Predefined Configurations

```typescript
import { MINIMAL_CONFIG, EDITING_CONFIG, FULL_CONFIG } from './worker/configs/sampleConfigs';

// Use predefined configurations
const minimalWorker = new ModularTypeScriptWorker(ctx, createData, MINIMAL_CONFIG);
const editingWorker = new ModularTypeScriptWorker(ctx, createData, EDITING_CONFIG);
const fullWorker = new ModularTypeScriptWorker(ctx, createData, FULL_CONFIG);
```

### Using the Modular Worker Manager

```typescript
import { ModularWorkerManager } from './workerManager.modular';

// Create a worker manager with modular worker enabled
const manager = new ModularWorkerManager(modeId, defaults, {
    useModularWorker: true,
    moduleConfig: EDITING_CONFIG
});

// Get the worker
const worker = await manager.getLanguageServiceWorker(...resources);

// Update module configuration at runtime
manager.updateModuleConfig(PERFORMANCE_CONFIG);
```

### Module Configuration Options

| Option | Description | Default |
|--------|-------------|---------|
| `enableDiagnostics` | Enable syntax, semantic, and suggestion diagnostics | `true` |
| `enableCompletions` | Enable code completion and signature help | `true` |
| `enableNavigation` | Enable go-to-definition, references, and navigation | `true` |
| `enableFormatting` | Enable code formatting capabilities | `true` |
| `enableRefactoring` | Enable rename operations and code fixes | `true` |
| `enableEmit` | Enable TypeScript compilation and emit | `true` |
| `enableInlayHints` | Enable inlay hints functionality | `true` |

## Benefits

1. **Performance**: Disable unused features to reduce memory usage and improve performance
2. **Flexibility**: Customize the worker based on your specific use case
3. **Maintainability**: Each module is focused on a specific responsibility
4. **Backward Compatibility**: The original `TypeScriptWorker` remains unchanged

## Migration

To migrate from the traditional worker to the modular worker:

1. Replace `TypeScriptWorker` with `ModularTypeScriptWorker`
2. Configure modules based on your needs
3. Update worker creation code to use the new factory functions

The modular worker maintains the same API as the traditional worker, so existing code should work without changes.
