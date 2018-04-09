
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
			'release/dev/bat/bat.test',
			'release/dev/css/css.test',
			'release/dev/coffee/coffee.test',
			'release/dev/cpp/cpp.test',
			'release/dev/csharp/csharp.test',
			'release/dev/dockerfile/dockerfile.test',
			'release/dev/fsharp/fsharp.test',
			'release/dev/go/go.test',
			'release/dev/handlebars/handlebars.test',
			'release/dev/html/html.test',
			'release/dev/pug/pug.test',
			'release/dev/java/java.test',
			'release/dev/less/less.test',
			'release/dev/lua/lua.test',
			'release/dev/markdown/markdown.test',
			'release/dev/msdax/msdax.test',
			'release/dev/objective-c/objective-c.test',
			'release/dev/php/php.test',
			'release/dev/postiats/postiats.test',
			'release/dev/powershell/powershell.test',
			'release/dev/python/python.test',
			'release/dev/r/r.test',
			'release/dev/razor/razor.test',
			'release/dev/ruby/ruby.test',
			'release/dev/rust/rust.test',
			'release/dev/scss/scss.test',
			'release/dev/swift/swift.test',
			'release/dev/sql/sql.test',
			'release/dev/vb/vb.test',
			'release/dev/xml/xml.test',
			'release/dev/yaml/yaml.test',
			'release/dev/solidity/solidity.test',
			'release/dev/sb/sb.test',
			'release/dev/mysql/mysql.test',
			'release/dev/pgsql/pgsql.test',
			'release/dev/redshift/redshift.test',
			'release/dev/redis/redis.test',
			'release/dev/csp/csp.test',
		], function () {
			run(); // We can launch the tests!
		}, function (err) {
			console.log(err);
		});
	}, function (err) {
		console.log(err);
	});
});
