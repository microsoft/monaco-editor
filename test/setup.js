
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

define(['require'], function (require) {
	requirejs([
		'vs/editor/editor.main'
	], function () {
		requirejs([
			'release/dev/test/bat.test',
			'release/dev/test/css.test',
			'release/dev/test/coffee.test',
			'release/dev/test/cpp.test',
			'release/dev/test/csharp.test',
			'release/dev/test/dockerfile.test',
			'release/dev/test/fsharp.test',
			'release/dev/test/go.test',
			'release/dev/test/handlebars.test',
			'release/dev/test/html.test',
			'release/dev/test/pug.test',
			'release/dev/test/java.test',
			'release/dev/test/less.test',
			'release/dev/test/lua.test',
			'release/dev/test/markdown.test',
			'release/dev/test/msdax.test',
			'release/dev/test/objective-c.test',
			'release/dev/test/php.test',
			'release/dev/test/postiats.test',
			'release/dev/test/powershell.test',
			'release/dev/test/python.test',
			'release/dev/test/r.test',
			'release/dev/test/razor.test',
			'release/dev/test/ruby.test',
			'release/dev/test/scss.test',
			'release/dev/test/swift.test',
			'release/dev/test/sql.test',
			'release/dev/test/vb.test',
			'release/dev/test/xml.test',
			'release/dev/test/yaml.test',
			'release/dev/test/solidity.test',
			'release/dev/test/sb.test',
			'release/dev/test/mysql.test',
			'release/dev/test/pgsql.test',
			'release/dev/test/redshift.test',
			'release/dev/test/redis.test',
			'release/dev/test/csp.test',
		], function () {
			run(); // We can launch the tests!
		}, function (err) {
			console.log(err);
		});
	}, function (err) {
		console.log(err);
	});
});
