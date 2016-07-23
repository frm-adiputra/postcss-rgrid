var postcss = require('postcss');
var assign = require('object-assign');
var storage = require('./lib/storage.js');

var libs = [
    require('./lib/define-grid'),
    require('./lib/grid'),
    require('./lib/grid-row'),
    require('./lib/grid-cell'),
    require('./lib/grid-media')
];

var defaultOpts = {};

module.exports = postcss.plugin('postcss-rgrid', function (opts) {
    opts = opts || {};
    opts = assign(defaultOpts, opts || {});


    // Work with options here

    return function (css) {

        storage.reset();

        libs.forEach(function (lib) {
            lib(css, opts);
        });

    };
});
