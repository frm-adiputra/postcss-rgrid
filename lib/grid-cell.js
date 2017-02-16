var postcss = require('postcss');
var parseCssDimension = require('parse-css-dimension');
var Cell = require('./Cell.js');
var storage = require('./storage.js');

function colSpanValues(node, prop, value) {
    if (prop !== 'grid-cell-span-columns') {
        return null;
    }

    var arr = postcss.list.space(value);

    if (arr.length < 1 || arr.length > 3) {
        throw node.error(
            'grid-cell-span-columns invalid number of property values');
    }

    var v = {
        span: parseCssDimension(arr[0]),
        offsetBefore: parseCssDimension(arr[1] || '0'),
        offsetAfter: parseCssDimension(arr[2] || '0')
    };

    if (v.span.type !== 'number' ||
        v.offsetBefore.type !== 'number' ||
        v.offsetAfter.type !== 'number') {
        throw node.error(
            'grid-cell-span-columns property values must be unitless');
    }

    return v;
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
                var v = colSpanValues(node, node.prop, node.value);
                if (v) {
                    cell.setProp('span', v.span);
                    cell.setProp('offset-before', v.offsetBefore);
                    cell.setProp('offset-after', v.offsetAfter);
                }
            }
        });

        atRule.walkAtRules('grid-cell-media', function (mediaAtRule) {
            var mediaName = mediaAtRule.params.split(' ')[0];

            try {
                cell.addMedia(mediaName);
            } catch (e) {
                throw mediaAtRule.error(e.toString());
            }

            var mediaNodes = [];

            mediaAtRule.each(function (node) {
                if (node.type === 'decl') {
                    var v = colSpanValues(node, node.prop, node.value);
                    if (v) {
                        cell.setProp('span', v.span, mediaName);
                        cell.setProp('offset-before',
                            v.offsetBefore, mediaName);
                        cell.setProp('offset-after', v.offsetAfter, mediaName);
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

        var nodes = [];
        var cellWidth = cell.width()
        var cellMarginLeft = cell.marginLeft()
        var cellMarginRight = cell.marginRight()

        if (cellWidth) {
          nodes.push(postcss.decl({
              prop: 'width',
              value: cell.width()
          }));
        }

        if (cellMarginLeft) {
          nodes.push(postcss.decl({
              prop: 'margin-left',
              value: cell.marginLeft()
          }));
        }

        if (cellMarginRight) {
          nodes.push(postcss.decl({
              prop: 'margin-right',
              value: cell.marginRight()
          }));
        }

        if (nodes.length > 0) {
            atRule.parent.insertBefore(atRule, nodes);
        }

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

            var mediaNodes = cellMediaNodes[media] || [];
            for (var i = 0; i < mediaNodes.length; i++) {
                mediaNodes[i].moveTo(b);
            }
            mediaAtRules.push(a);
        });

        atRule.parent.parent.insertAfter(atRule.parent, mediaAtRules);

        atRule.remove();
    });
};
