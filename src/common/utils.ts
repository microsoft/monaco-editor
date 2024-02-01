const VARIABLE_REGEX =
	/\{\{\s(([_a-zA-Z0-9][_a-zA-Z0-9 ]*[_a-zA-Z0-9])|[_a-zA-Z0-9])\s\}\}(?=(?:(?:[^"]*"){2})*[^"]*$)/g;
const PLACEHOLDER_REGEX =
	/\[\[\s(([_a-zA-Z0-9][_a-zA-Z0-9 ]*[_a-zA-Z0-9])|[_a-zA-Z0-9])\s\]\](?=(?:(?:[^"]*"){2})*[^"]*$)/g;
const MARKER_REGEX = /VR_([^\s]+)_VR/g;

export const CIRCLE_BRACKET_DIAGNOSTIC_OFFSET = 1;
export const INLINE_CSS_ID = '#inline-styles-configuration';

// TASK-2524: Replace CodeMirror with Monaco editor.
// Converts variables definitions to valid identifiers {{ Window Height }} to VR_Window_Height_VR
// Note: identifier length should match variable's length. In opposite case diagnostic markers will have incorrect positions.
export const replaceVariablesWithMarkers = (text: string) =>
	text.replace(VARIABLE_REGEX, (_, variable) => `VR_${variable.trim().replace(/\s/g, '_')}_VR`);

// TASK-2524: Replace CodeMirror with Monaco editor.
// Wraps placeholders and variables with quotes, e.g., {{ var1 }} becomes "{ var1 }" and [[ placeholder1 ]] becomes "[ placeholder1 ]"
// Note: The length of wrapped placeholders and variables should match the initial length of placeholders and variables.
// Cut the first "[" and last "]" of placeholder definitions because quotes take their positions while diagnostics performing. The same applies to variables; cut the first "{" and last "}".
// In opposite case diagnostic markers will have incorrect positions.
export const wrapPlaceholdersAndVariablesWithQuotes = (text: string) =>
	text.replace(
		new RegExp(`${PLACEHOLDER_REGEX.source}|${VARIABLE_REGEX.source}`, 'g'),
		(target) => `"${target.slice(1, target.length - 1)}"`
	);

// Converts valid identifiers to variables definitions VR_Window_Height_VR to {{ Window Height }}
export const replaceMarkersWithVariables = (text: string) =>
	text.replace(MARKER_REGEX, (_, marker) => `{{ ${marker.replaceAll('_', ' ')} }}`);

// Checks if code block starts with "{"
export const isInlineConfig = (text: string) => /^\s*{/.test(text);

// Checks if code block starts with "{" or "function() {..."
export const shouldWrapWithCircleBrackets = (text: string) => /^\s*({|function\s*())/.test(text);
