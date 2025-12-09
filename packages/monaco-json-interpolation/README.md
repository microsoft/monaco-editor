# monaco-json-interpolation

A Monaco Editor add-on that provides JSON language support with `${...}` variable interpolation.

## Features

- **Syntax Highlighting**: Full JSON syntax highlighting with embedded JavaScript inside `${...}`
- **Variable Completions**: Autocomplete for your custom variables inside interpolations
- **Hover Information**: See variable types, descriptions, and current values on hover
- **JSONC Support**: Comments (`//`, `/* */`) and trailing commas are allowed
- **Folding**: Code folding for objects and arrays

## Installation

```bash
npm install monaco-json-interpolation
```

## Usage

### Basic Setup

```typescript
import * as monaco from 'monaco-editor';
import { register, getDefaults } from 'monaco-json-interpolation';

// Register the language (call once at startup)
register();

// Create an editor with the new language
const editor = monaco.editor.create(document.getElementById('container'), {
  value: '{\n  "message": "Hello, ${name}!"\n}',
  language: 'json-interpolation'
});
```

### Providing Variables

```typescript
import { getDefaults } from 'monaco-json-interpolation';

// Set up variable context for completions and hover
getDefaults().setVariableContext({
  getVariables: () => [
    {
      name: 'name',
      type: 'string',
      value: 'World',
      description: 'The name to greet'
    },
    {
      name: 'env',
      type: 'string',
      value: 'production',
      description: 'Current environment'
    },
    {
      name: 'config',
      type: 'object',
      value: { debug: false, port: 3000 },
      description: 'Application configuration'
    }
  ]
});
```

### Dynamic Variables

You can also provide variables asynchronously:

```typescript
getDefaults().setVariableContext({
  getVariables: async () => {
    const response = await fetch('/api/variables');
    return response.json();
  }
});
```

## API Reference

### `register(): LanguageServiceDefaults`

Registers the `json-interpolation` language with Monaco Editor. Should be called once before creating editors. Returns the language service defaults for configuration.

### `getDefaults(): LanguageServiceDefaults`

Gets the language service defaults. Automatically registers the language if not already registered.

### `LanguageServiceDefaults`

```typescript
interface LanguageServiceDefaults {
  readonly languageId: string;
  readonly variableContext: VariableContextProvider | null;

  setVariableContext(provider: VariableContextProvider | null): void;
  setDiagnosticsOptions(options: DiagnosticsOptions): void;
  setModeConfiguration(modeConfiguration: ModeConfiguration): void;
}
```

### `VariableDefinition`

```typescript
interface VariableDefinition {
  name: string;           // Variable name (without $)
  type?: string;          // Type for display (e.g., 'string', 'number')
  value?: unknown;        // Current value (shown in hover)
  description?: string;   // Description for hover/completion
  detail?: string;        // Additional detail text
}
```

### `VariableContextProvider`

```typescript
interface VariableContextProvider {
  getVariables(): VariableDefinition[] | Promise<VariableDefinition[]>;
  resolveVariable?(name: string): unknown | Promise<unknown>;
}
```

## Example

```typescript
import * as monaco from 'monaco-editor';
import jsonInterpolation from 'monaco-json-interpolation';

// Register and configure
const defaults = jsonInterpolation.register();

defaults.setVariableContext({
  getVariables: () => [
    { name: 'API_URL', type: 'string', value: 'https://api.example.com' },
    { name: 'VERSION', type: 'string', value: '1.0.0' },
    { name: 'DEBUG', type: 'boolean', value: false }
  ]
});

// Create editor
const editor = monaco.editor.create(document.getElementById('editor'), {
  value: `{
  "endpoint": "\${API_URL}/users",
  "version": "\${VERSION}",
  "settings": {
    "debug": \${DEBUG}
  }
}`,
  language: 'json-interpolation',
  theme: 'vs-dark'
});
```

## License

MIT
