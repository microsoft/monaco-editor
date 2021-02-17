import { Application, registerComponent } from "./typedoc/Application";
import { MenuHighlight } from "./typedoc/components/MenuHighlight";
import { initSearch } from "./typedoc/components/Search";
import { Signature } from "./typedoc/components/Signature";
import { Toggle } from "./typedoc/components/Toggle";
import { Filter } from "./typedoc/components/Filter";

import "../../css/main.sass";

initSearch();

registerComponent(MenuHighlight, ".menu-highlight");
registerComponent(Signature, ".tsd-signatures");
registerComponent(Toggle, "a[data-toggle]");

if (Filter.isSupported()) {
    registerComponent(Filter, "#tsd-filter");
} else {
    document.documentElement.classList.add("no-filter");
}

const app: Application = new Application();

Object.defineProperty(window, "app", { value: app });
