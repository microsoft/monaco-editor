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

define(['require'], function () {
	requirejs([
		'vs/editor/editor.main'
	], function () {
		requirejs([
			'release/dev/apex/apex.test',
			'release/dev/azcli/azcli.test',
			'release/dev/bat/bat.test',
			'release/dev/clojure/clojure.test',
			'release/dev/coffee/coffee.test',
			'release/dev/cpp/cpp.test',
			'release/dev/csharp/csharp.test',
			'release/dev/csp/csp.test',
			'release/dev/css/css.test',
			'release/dev/dockerfile/dockerfile.test',
			'release/dev/fsharp/fsharp.test',
			'release/dev/go/go.test',
			'release/dev/graphql/graphql.test',
			'release/dev/handlebars/handlebars.test',
			'release/dev/html/html.test',
			'release/dev/java/java.test',
			'release/dev/javascript/javascript.test',
			'release/dev/kotlin/kotlin.test',
			'release/dev/less/less.test',
			'release/dev/lua/lua.test',
			'release/dev/markdown/markdown.test',
			'release/dev/mips/mips.test',
			'release/dev/msdax/msdax.test',
			'release/dev/mysql/mysql.test',
			'release/dev/objective-c/objective-c.test',
			'release/dev/pascal/pascal.test',
			'release/dev/perl/perl.test',
			'release/dev/pgsql/pgsql.test',
			'release/dev/php/php.test',
			'release/dev/postiats/postiats.test',
			'release/dev/powerquery/powerquery.test',
			'release/dev/powershell/powershell.test',
			'release/dev/pug/pug.test',
			'release/dev/python/python.test',
			'release/dev/r/r.test',
			'release/dev/razor/razor.test',
			'release/dev/redis/redis.test',
			'release/dev/redshift/redshift.test',
			'release/dev/ruby/ruby.test',
			'release/dev/rust/rust.test',
			'release/dev/sb/sb.test',
			'release/dev/scheme/scheme.test',
			'release/dev/scss/scss.test',
			'release/dev/shell/shell.test',
			'release/dev/sophia/sophia.test',
			'release/dev/solidity/solidity.test',
			'release/dev/sql/sql.test',
			'release/dev/st/st.test',
			'release/dev/swift/swift.test',
			'release/dev/tcl/tcl.test',
			'release/dev/typescript/typescript.test',
			'release/dev/vb/vb.test',
			'release/dev/xml/xml.test',
			'release/dev/yaml/yaml.test'
		], function () {
			run(); // We can launch the tests!
		}, function (err) {
			console.log(err);
		});
	}, function (err) {
		console.log(err);
	});
});
