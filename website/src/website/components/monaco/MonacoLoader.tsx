import * as React from "react";
import { getMonaco, loadMonaco } from "../../../monaco-loader";

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
				this.setState({
					monaco,
				});
			});
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
