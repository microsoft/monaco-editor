var requirejs = require("requirejs");
var path = require('path');

requirejs.config({
    baseUrl: 'out',
    paths: {
        'vs/language/typescript': path.join(__dirname, '/../out/amd')
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
