var postcss = require('postcss');
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

module.exports = function gridDecl(css) {
    css.walkDecls('grid', function (decl) {
        var declArr = decl.value.split(' ');
        var name = declArr[0];

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

        // Add props at media breakpoint

        var mediaAtRules = [];

        grid.eachMedia(function (media, query) {
            var a = postcss.atRule({ name: 'media', params: query });
            var b = postcss.rule({ selector: decl.parent.selector });
            var mediaGutter = grid.gutter(media);

            if (mediaGutter) {
                a.append(b);
                b.append({
                    prop: 'padding-left',
                    value: mediaGutter.value.toString() + mediaGutter.unit
                });
                b.append({
                    prop: 'padding-right',
                    value: mediaGutter.value.toString() + mediaGutter.unit
                });
            }

            mediaAtRules.push(a);
        });

        decl.parent.parent.insertAfter(decl.parent, mediaAtRules);

        decl.remove();
    });
};
