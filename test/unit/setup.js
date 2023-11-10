define('vs/css', [], {
	load: function (name, req, load) {
		load({});
	}
});

define('vs/nls', [], {
	create: function () {
		return {
			localize: function () {
				return 'NO_LOCALIZATION_FOR_YOU';
			},
			localize2: function () {
				return 'NO_LOCALIZATION_FOR_YOU';
			},
			getConfiguredDefaultLocale: function () {
				return undefined;
			}
		};
	},
	localize: function () {
		return 'NO_LOCALIZATION_FOR_YOU';
	},
	load: function (name, req, load) {
		load({});
	}
});

define(['vs/editor/editor.main'], function (api) {
	global.monaco = api;
});
