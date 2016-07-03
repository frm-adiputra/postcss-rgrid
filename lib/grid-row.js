var postcss = require('postcss');
var newBlock = require('./new-block.js');
var storage = require('./storage.js');

/**
 * md-grid-row: create a row container.
 *
 * @param {string} [name] - The name of grid definition.
 */

var rowStyles = {
    'align-items': 'stretch',
    'display': 'flex',
    'flex-flow': 'row wrap'
};

module.exports = function gridRowDecl(css) {
    css.walkDecls('grid-row', function (decl) {
        var declArr = [];
        var name;

        declArr = decl.value.split(' ');
        name = declArr[0];

        var grid = storage.get(name);
        if (!grid) {
            throw decl.error('unknown grid name: ' + name, { word: name });
        }

        for (var p in rowStyles) {
            decl.cloneBefore({
                prop: p,
                value: rowStyles[p].toString()
            });
        }

        var gridMargin = grid.margin();
        var margin = (gridMargin.value / -2).toString() + gridMargin.unit;

        decl.cloneBefore({
            prop: 'margin-left',
            value: margin
        });
        decl.cloneBefore({
            prop: 'margin-right',
            value: margin
        });

        // Add props at media breakpoint

        var mediaAtRules = [];

        grid.eachMedia(function (media, query) {
            var mediaGridMargin = grid.margin(media);
            var mediaMargin = (mediaGridMargin.value / -2).toString() +
                mediaGridMargin.unit;

            var a = postcss.atRule({ name: 'media', params: query })
                .append(
                    postcss.rule({ selector: decl.parent.selector })
                        .append({
                            prop: 'margin-left',
                            value: mediaMargin
                        })
                        .append({
                            prop: 'margin-right',
                            value: mediaMargin
                        })
                );

            mediaAtRules.push(a);
        });

        decl.parent.parent.insertAfter(decl.parent, mediaAtRules);

        newBlock(
            decl,
            ' > *',
            {
                'box-sizing': 'border-box'
            }
        );

        decl.remove();
    });
};
