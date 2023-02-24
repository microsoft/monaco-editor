import * as React from "react";
import { observer } from "mobx-react";
import { Form } from "./bootstrap";
import { IReference } from "../utils/ref";

@observer
export class TextBox extends React.Component<{
	value: IReference<string>;
	style?: React.CSSProperties;
}> {
	render() {
		const { value } = this.props;
		return (
			<Form.Control
				value={value.get()}
				onChange={(v) => value.set(v.currentTarget.value)}
				style={this.props.style}
			/>
		);
	}
}
