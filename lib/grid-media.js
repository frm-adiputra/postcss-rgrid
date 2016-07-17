var postcss = require('postcss');
var parseCssDimension = require('parse-css-dimension');
var Cell = require('./Cell.js');
var storage = require('./storage.js');

module.exports = function gridMediaAtRule(css) {
    css.walkAtRules('grid-media', function (atRule) {
        var params = postcss.list.space(atRule.params);

        if (params.length !== 2) {
            throw atRule.error('invalid parameters');
        }
        var gridName = params[0];
        var mediaName = params[1];
        var grid = storage.get(gridName);

        if (!grid) {
            throw atRule.error(
                'unknown grid name: ' + gridName,
                { word: gridName });
        }

        var mediaQuery = grid.mediaQuery(mediaName);
        if (!mediaQuery) {
            throw atRule.error(
                'unknown media name: ' + mediaName,
                { word: mediaName });
        }

        var node = postcss.atRule({ name: 'media', params: mediaQuery })
            .append(
                postcss.rule({ selector: atRule.parent.selector })
                    .append(atRule.nodes)
            );

        atRule.parent.parent.insertAfter(atRule.parent, node);
        atRule.remove();
    });
};
