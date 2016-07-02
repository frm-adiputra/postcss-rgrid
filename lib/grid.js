var newBlock = require('./new-block.js');
var storage = require('./storage.js');

/**
 * md-grid: create grid container.
 *
 * @param {length} [gutter] - The margin on the left and right side of grid
 * container.
 *
 * @param {length} [margin] - The margin between items.
 */

var gridStyles = {
    'align-items': 'stretch',
    'display': 'flex',
    'flex-flow': 'column wrap',
    'margin': '0 auto 0 auto'
};

module.exports = function gridDecl(css, settings) {
    css.walkDecls('grid', function (decl) {
        var declArr = [];
        var name;

        declArr = decl.value.split(' ');
        name = declArr[0];

        var grid = storage.get(name);
        if (!grid) {
            throw decl.error('unknown grid name: ' + name, { word: name });
        }

        var gutter = grid.gutter();

        decl.cloneBefore({
            prop: 'padding-left',
            value: gutter.value.toString() + gutter.unit
        });
        decl.cloneBefore({
            prop: 'padding-right',
            value: gutter.value.toString() + gutter.unit
        });

        for (var p in gridStyles) {
            decl.cloneBefore({
                prop: p,
                value: gridStyles[p].toString()
            });
        }

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
