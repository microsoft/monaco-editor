import * as React from "react";
import * as ReactDOM from "react-dom";
import "./bootstrap.scss";
import "./style.scss";
import { App } from "./pages/App";

const elem = document.createElement("div");
elem.className = "root";
document.body.append(elem);
ReactDOM.render(<App />, elem);

if ("serviceWorker" in navigator) {
	window.addEventListener("load", () => {
		navigator.serviceWorker.register("/sw.js").catch(() => {});
	});
}
