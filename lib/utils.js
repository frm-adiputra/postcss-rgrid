var appendToSelectors = function (selector, selectorToAppend) {
    var appendedSelectors = [];

    selector.split(',').forEach(function (item) {
        appendedSelectors.push(item + selectorToAppend);
    });

    return appendedSelectors.join(',');
};

module.exports = {
    appendToSelectors: appendToSelectors
};
