import {Application, registerComponent} from "./typedoc/Application";
import {Search} from "./typedoc/components/Search";
import {MenuHighlight} from "./typedoc/components/MenuHighlight";
import {Signature} from "./typedoc/components/Signature";
import {Toggle} from "./typedoc/components/Toggle";
import {Filter} from "./typedoc/components/Filter";

import '../../css/main.sass'

registerComponent(Search, '#tsd-search');

registerComponent(MenuHighlight, '.menu-highlight');
registerComponent(Signature, '.tsd-signatures');
registerComponent(Toggle, 'a[data-toggle]');

if (Filter.isSupported()) {
    registerComponent(Filter, '#tsd-filter');
} else {
    document.documentElement.classList.add('no-filter');
}

const app: Application = new Application();

Object.defineProperty(window, 'app', {value: app});
