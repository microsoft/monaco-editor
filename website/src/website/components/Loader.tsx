import * as React from "react";
export class Loader<T> extends React.Component<
	{ children: (value: T) => React.ReactChild; loader: () => Promise<T> },
	{ value: T | undefined; hasValue: boolean }
> {
	constructor(props: any) {
		super(props);
		this.state = { value: undefined, hasValue: false };
		if (!this.state.value) {
			this.props.loader().then((value) => {
				this.setState({
					hasValue: true,
					value,
				});
			});
		}
	}

	render() {
		if (!this.state.hasValue) {
			return null;
		}
		return this.props.children(this.state.value!);
	}
}

/**
 * Decorates a component so that it only gets mounted when monaco is loaded.
 */
export function withLoader(
	loader: () => Promise<void>
): <TProps>(
	Component: React.FunctionComponent<TProps> | React.ComponentClass<TProps>
) => any {
	return (Component) => {
		return (props: any) => (
			<Loader loader={loader}>{() => <Component {...props} />}</Loader>
		);
	};
}
