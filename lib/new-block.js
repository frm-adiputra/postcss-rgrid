module.exports = function newBlock(decl, selector, props, values) {
    var appendToSelectors, completeSelector, block;

    appendToSelectors = function (selector, selectorToAppend) {
        var appendedSelectors = [];

        selector.split(',').forEach(function(item) {
            appendedSelectors.push(item + selectorToAppend);
        });

        return appendedSelectors.join(',');
    };

    completeSelector = appendToSelectors(decl.parent.selector, selector);

    block = decl.parent.cloneAfter({
          selector: completeSelector
        }),
        props = props || {},
        values = values || [];

    block.walkDecls(function (decl) {
        decl.remove();
    });

    for (var p in props) {
        var rule = decl.clone({
            prop: p,
            value: props[p].toString()
        });
        rule.moveTo(block);
    }
};
