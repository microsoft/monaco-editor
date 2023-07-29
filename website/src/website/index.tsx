import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./pages/App";

const elem = document.createElement("div");
elem.className = "root";
document.body.append(elem);
ReactDOM.render(<App />, elem);
