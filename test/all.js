var requirejs = require("requirejs");

requirejs.config({
    baseUrl: 'out',
        paths: {
        'vs/language/typescript': __dirname + '/../out'
    },
    nodeRequire: require
});

 requirejs([
     'vs/language/typescript/test/tokenization.test'
], function() {
    run(); // We can launch the tests!
});