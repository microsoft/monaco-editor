import { observer } from "mobx-react";
import * as React from "react";
import { hotComponent } from "../../utils/hotComponent";
import { PlaygroundModel } from "./PlaygroundModel";
import { PlaygroundPageContent } from "./PlaygroundPageContent";

@hotComponent(module)
@observer
export class PlaygroundPage extends React.Component {
	private readonly model = new PlaygroundModel();

	componentWillUnmount() {
		this.model.dispose();
	}

	render() {
		return <PlaygroundPageContent model={this.model} />;
	}
}
