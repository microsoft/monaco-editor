import { observer } from "mobx-react";
import * as React from "react";
import { hotComponent } from "../../utils/hotComponent";
import { PlaygroundModel } from "./PlaygroundModel";
import { PlaygroundPageContent } from "./PlaygroundPageContent";
import { withLoader } from "../../components/Loader";
import { getNpmVersions } from "./getNpmVersionsSync";

@withLoader(async () => {
	if (
		new URLSearchParams(window.location.search).get("source") ===
		"latest-dev"
	) {
		// So that the source class can resolve that value
		await getNpmVersions();
	}
})
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
