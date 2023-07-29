import { Home } from "./home/Home";
import { PlaygroundPage } from "./playground/PlaygroundPage";
import { docs, home, monarch, playground } from "./routes";
import React = require("react");
import { DocsPage } from "./docs/DocsPage";
import { MonarchPage } from "./monarch/MonarchPage";

export class App extends React.Component {
	render() {
		if (home.isActive) {
			return <Home />;
		} else if (playground.isActive) {
			return <PlaygroundPage />;
		} else if (docs.isActive) {
			return <DocsPage />;
		} else if (monarch.isActive) {
			return <MonarchPage />;
		}
		return <>Page does not exist</>;
	}
}
