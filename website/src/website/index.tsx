import * as React from "react";
import * as ReactDOM from "react-dom";
import "./bootstrap.scss";
import "./style.scss";
import { App } from "./pages/App";

// new MobxConsoleLogger(mobx);

const elem = document.createElement("div");
elem.className = "root";
document.body.append(elem);
ReactDOM.render(<App />, elem);
