import * as React from "react";
import { getMonaco, loadMonaco } from "../../../monaco-loader";

// Name of the accessible theme for the website
export const VS_LIGHT_ADJUSTED = "vs-accessible";

/**
 * Defines an accessible version of the VS theme with improved color contrast.
 * This theme fixes WCAG 2 AA color contrast issues with the default VS theme.
 * Uses a WeakSet to track Monaco instances to handle hot module reloading.
 */
const monacoInstancesWithTheme = new WeakSet<typeof globalThis.monaco>();

function defineAccessibleTheme(monaco: typeof globalThis.monaco): void {
	if (monacoInstancesWithTheme.has(monaco)) {
		return;
	}
	monacoInstancesWithTheme.add(monaco);

	// Define an accessible VS theme with improved contrast ratios
	// The default VS theme uses #ff0000 for attribute.name which has insufficient
	// contrast (3.99:1) against white backgrounds. WCAG 2 AA requires 4.5:1.
	// #c50f1f provides ~4.71:1 contrast ratio against white.
	monaco.editor.defineTheme(VS_LIGHT_ADJUSTED, {
		base: "vs",
		inherit: true,
		rules: [
			// Fix attribute.name color for WCAG 2 AA compliance
			// #c50f1f on white gives ~4.71:1 contrast ratio (required: 4.5:1)
			{ token: "attribute.name", foreground: "c50f1f" },
		],
		colors: {},
	});

	// Set the accessible theme as the default for the website
	// This ensures editors without an explicit theme use the accessible theme
	monaco.editor.setTheme(VS_LIGHT_ADJUSTED);
}

/**
 * Can be used to render content only when monaco is loaded.
 */
export class MonacoLoader extends React.Component<
	{ children: (m: typeof monaco) => React.ReactChild },
	{ monaco?: typeof monaco }
> {
	constructor(props: any) {
		super(props);
		this.state = { monaco: getMonaco() };
		if (!this.state.monaco) {
			loadMonaco().then((monaco) => {
				defineAccessibleTheme(monaco);
				this.setState({
					monaco,
				});
			});
		} else {
			defineAccessibleTheme(this.state.monaco);
		}
	}
	render() {
		if (!this.state.monaco) {
			return null;
		}
		return this.props.children(this.state.monaco);
	}
}

/**
 * Decorates a component so that it only gets mounted when monaco is loaded.
 */
export function withLoadedMonaco<TProps>(
	Component: React.FunctionComponent<TProps> | React.ComponentClass<TProps>
): any {
	return (props: TProps) => (
		<MonacoLoader>{() => <Component {...props} />}</MonacoLoader>
	);
}
