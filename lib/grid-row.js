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

        newBlock(
            decl,
            ' > *',
            {
                'box-sizing': 'border-box',
                'margin-left': gridMargin.value.toString() + gridMargin.unit
            }
        );

        decl.remove();
    });
};
