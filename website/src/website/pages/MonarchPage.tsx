import React = require("react");
import { Page } from "../components/Page";

export class MonarchPage extends React.Component<{}, {}> {
	render() {
		return (
			<Page>
				<iframe
					frameBorder={0}
					className="full-iframe"
					src="./monarch-static.html"
				/>
			</Page>
		);
	}
}
