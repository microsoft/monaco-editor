define('vs/nls', [], {
	create: function() {
		return {
			localize: function() {
				return 'NO_LOCALIZATION_FOR_YOU';
			}
		};
	},
	localize: function() {
		return 'NO_LOCALIZATION_FOR_YOU';
	},
	load: function(name, req, load) {
		load({});
	}
});
