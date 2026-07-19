import { observer } from "mobx-react";
import * as React from "react";
import { IReference } from "../utils/ref";
import { Form } from "./bootstrap";

interface Group<T> {
	groupTitle: string;
	items: (T | Group<T>)[];
}

@observer
export class Select<T> extends React.Component<{
	value: IReference<T | undefined, T>;
	values: (T | Group<T>)[];
	getLabel: (val: T) => string;
	style?: React.CSSProperties;
}> {
	private readonly map: Map<T, string> = new Map();

	render() {
		const { value, values } = this.props;
		this.map.clear();
		const groups = this.renderGroups(values);
		const currentValue = value.get();

		return (
			<Form.Select
				value={currentValue && this.map.get(currentValue)}
				defaultValue={currentValue ? undefined : ""}
				onChange={(e) => {
					const newValue = e.currentTarget.value;
					const selected = [...this.map.entries()].find(
						([k, v]) => v === newValue
					);
					if (selected) {
						value.set(selected[0]);
					}
				}}
				style={this.props.style}
				size="sm"
			>
				<option value="" disabled hidden>
					Select an example...
				</option>
				{groups}
			</Form.Select>
		);
	}

	private renderGroups(groups: (T | Group<T>)[]): React.ReactNode {
		const { getLabel } = this.props;

		return groups.map((g, idx) => {
			if (typeof g === "object" && g && "groupTitle" in g) {
				return (
					<optgroup label={g.groupTitle} key={idx}>
						{this.renderGroups(g.items)}
					</optgroup>
				);
			} else {
				let id = this.map.get(g);
				if (!id) {
					id = `${this.map.size + 1}`;
					this.map.set(g, id);
				}

				return (
					<option key={idx} value={id}>
						{getLabel(g)}
					</option>
				);
			}
		});
	}
}
