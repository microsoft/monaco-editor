import * as React from "react";
import { observer } from "mobx-react";
import { Form } from "./bootstrap";
import { IReference } from "../utils/ref";

@observer
export class Radio<T> extends React.Component<{
	value: IReference<T>;
	current: T;
	id?: string;
}> {
	render() {
		const { value, current } = this.props;
		return (
			<Form.Check
				checked={value.get() === current}
				onChange={() => value.set(current)}
				type="radio"
				id={this.props.id}
			/>
		);
	}
}
