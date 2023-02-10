import React = require("react");
import { Page } from "../components/Page";

export class DocsPage extends React.Component {
	render() {
		if (!localStorage.getItem("tsd-theme")) {
			// Set default theme to light, unfortunately there is no config option for this
			localStorage.setItem("tsd-theme", "light");
		}

		return (
			<Page>
				<iframe
					className="full-iframe"
					frameBorder={0}
					src="./typedoc/"
				/>
			</Page>
		);
	}
}
