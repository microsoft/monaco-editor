import Module = require("module");
import { observer } from "mobx-react";
import * as React from "react";
import { observable, runInAction } from "mobx";

type ReactComponent<P = any> =
	| React.ComponentClass<P>
	| React.FunctionComponent<P>;

const allComponents = new Map<string, { component: ReactComponent }>();

export function hotComponent(
	module: Module
): <T extends ReactComponent>(Component: T) => T {
	return <T extends ReactComponent>(component: T): T => {
		const key = JSON.stringify({ id: module.id, name: component.name });

		let result = allComponents.get(key);
		if (!result) {
			result = observable({ component: component });
			allComponents.set(key, result);
		} else {
			setTimeout(() => {
				runInAction(`Update Component ${component.name}`, () => {
					result!.component = component;
				});
			}, 0);
		}

		const m = module as {
			hot?: {
				accept: ((
					componentName: string,
					callback: () => void
				) => void) &
					((callback: () => void) => void);
			};
		};

		if (m.hot) {
			m.hot.accept(() => {});
		}

		return observer((props: any) => {
			const C = result!.component;
			return <C {...props} />;
		}) as any;
	};
}
