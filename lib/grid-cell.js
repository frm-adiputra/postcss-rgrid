var postcss = require('postcss');
var parseCssDimension = require('parse-css-dimension');
var Cell = require('./Cell.js');
var storage = require('./storage.js');

var validProps = [
    'span',
    'offset-before',
    'offset-after'
];

function propValue(node, prop, value) {
    var v;
    if (prop === 'span' ||
        prop === 'offset-before' ||
        prop === 'offset-after') {

        v = parseCssDimension(value);
        if (v.type !== 'number') {
            throw node.error(
                prop + ' must be unitless',
                { word: value });
        }

        if (v.value <= 0) {
            throw node.error(
                prop + ' must be greater than or equal to 0',
                { word: value });
        }

        return v;
    }

    return null;
}

module.exports = function gridCellAtRule(css) {
    css.walkAtRules('grid-cell', function (atRule) {
        var name = atRule.params.split(' ')[0];
        var grid = storage.get(name);

        if (!grid) {
            throw atRule.error('unknown grid name: ' + name, { word: name });
        }

        var cell = new Cell(grid);
        var cellMediaNodes = {};

        atRule.each(function (node) {
            if (node.type === 'decl') {
                var v = propValue(node, node.prop, node.value);
                if (v) {
                    cell.setProp(node.prop, v);
                }
            }
        });

        atRule.walkAtRules('grid-media', function (mediaAtRule) {
            var mediaName = mediaAtRule.params.split(' ')[0];

            try {
                cell.addMedia(mediaName);
            } catch (e) {
                throw mediaAtRule.error(e.toString());
            }

            var mediaNodes = [];

            mediaAtRule.each(function (node) {
                if (node.type === 'decl') {
                    var v = propValue(node, node.prop, node.value);
                    if (v) {
                        cell.setProp(node.prop, v, mediaName);
                    } else {
                        mediaNodes.push(node);
                    }
                } else {
                    mediaNodes.push(node);
                }
            });

            cellMediaNodes[mediaName] = mediaNodes;
        });

        // Add props

        atRule.parent.insertBefore(atRule, {
            prop: 'width',
            value: cell.width()
        });
        atRule.parent.insertBefore(atRule, {
            prop: 'margin-left',
            value: cell.marginLeft()
        });
        atRule.parent.insertBefore(atRule, {
            prop: 'margin-right',
            value: cell.marginRight()
        });

        // Add props at media breakpoint

        var mediaAtRules = [];

        grid.eachMedia(function (media, query) {
            var a = postcss.atRule({ name: 'media', params: query });
            var b = postcss.rule({ selector: atRule.parent.selector });
            var width = cell.width(media);
            var marginLeft = cell.marginLeft(media);
            var marginRight = cell.marginRight(media);

            if (width || marginLeft || marginRight) {
                a.append(b);
            }

            if (width) {
                b.append({
                    prop: 'width',
                    value: width
                });
            }
            if (marginLeft) {
                b.append({
                    prop: 'margin-left',
                    value: marginLeft
                });
            }
            if (marginRight) {
                b.append({
                    prop: 'margin-right',
                    value: marginRight
                });
            }

            var nodes = cellMediaNodes[media] || [];
            for (var i = 0; i < nodes.length; i++) {
                nodes[i].moveTo(b);
            }
            mediaAtRules.push(a);
        });

        for (var i = mediaAtRules.length - 1; i >= 0; i--) {
            atRule.parent.parent.insertAfter(atRule.parent, mediaAtRules[i]);
        }
        atRule.remove();
    });
};
