var postcss = require('postcss');
var assign = require('object-assign');

var libs = [
    require('./lib/define-grid'),
    require('./lib/grid'),
    require('./lib/grid-row'),
    require('./lib/grid-cell'),
    require('./lib/grid-media')
    // require('./lib/define-mdgrid'),
    // require('./lib/cell')
];

var defaultOpts = {};

module.exports = postcss.plugin('postcss-mdgrid', function (opts) {
    opts = opts || {};
    opts = assign(defaultOpts, opts || {});


    // Work with options here

    return function (css) {

        libs.forEach(function (lib) {
            lib(css, opts);
        });

    };
});
