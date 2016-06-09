var requirejs = require("requirejs");

requirejs.config({
    baseUrl: 'out',
    nodeRequire: require
});

 requirejs([
     'test/tokenization.test'
], function() {
    run(); // We can launch the tests!
});