var parseCssDimension = require('parse-css-dimension');
var storage = require('./storage.js');
var Grid = require('./Grid.js');

function nameAndMedia(s) {
    var idx = s.indexOf(' ');
    var name = s.substr(0, idx);
    var params = s.substr(idx + 1);
    return [name, params];
}

function propValue(node, prop, value) {
    var v;
    if (prop === 'columns') {
        v = parseCssDimension(value);
        if (v.type !== 'number') {
            throw node.error(
                'columns must be unitless',
                { word: value });
        }

        if (v.value < 1) {
            throw node.error(
                'columns must be positive integer',
                { word: value });
        }

        return v;
    }

    if (prop === 'gutter' || prop === 'margin') {
        v = parseCssDimension(value);

        if (v.value < 0) {
            throw node.error(
                prop + 'must be greater than 0',
                { word: value });
        }

        return v;
    }

    return null;
}

module.exports = function defineGridAtRule(css) {
    css.walkAtRules('define-grid', function (rule) {
        var grid = new Grid();
        var name = rule.params.split(' ')[0];

        rule.each(function (node) {
            if (node.type === 'decl') {
                var v = propValue(node, node.prop, node.value);
                if (v) {
                    grid.setProp(node.prop, v);
                }
            }
        });

        rule.walkAtRules('define-media', function (mediaAtRule) {
            var arr = nameAndMedia(mediaAtRule.params);
            var mediaName = arr[0];
            var query = arr[1];
            if (mediaName === '') {
                throw mediaAtRule.error('invalid parameter');
            }

            if (grid.hasMedia(mediaName)) {
                throw mediaAtRule.error(
                    'grid media redeclaration' + mediaName,
                    { word: mediaName });
            }

            grid.addMedia(mediaName, query);

            mediaAtRule.each(function (node) {
                if (node.type === 'decl') {
                    var v = propValue(node, node.prop, node.value);
                    if (v) {
                        grid.setProp(node.prop, v, mediaName);
                    }
                }
            });
        });

        var ok = storage.put(name, grid);
        if (!ok) {
            throw rule.error('grid redeclaration: ' + name, { word: name });
        }

        rule.remove();
    });
};
