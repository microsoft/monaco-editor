var requirejs = require("requirejs");
var path = require('path');

requirejs.config({
    baseUrl: 'release/dev',
    paths: {
        'vs/language/typescript': path.join(__dirname, '/../release/dev')
    },
    nodeRequire: require
});

// Workaround for TypeScript
process.browser = true;

requirejs([
    'vs/language/typescript/test/tokenization.test'
], function () {
    run(); // We can launch the tests!
});
