import * as monaco from './internal/editorWithLanguages';
import './internal/initialize';
import { getGlobalMonaco } from './internal/initialize';

export * from './internal/editorWithLanguages';

// export to the global based API (for backwards compatibility only).
// Warning: We can only write to objects, not modules / namespaces!
// Writing to modules/namespace would confuse bundlers.
const monacoApi = getGlobalMonaco();
monacoApi.languages.css = monaco.css;
monacoApi.languages.html = monaco.html;
monacoApi.languages.typescript = monaco.typescript;
monacoApi.languages.json = monaco.json;
