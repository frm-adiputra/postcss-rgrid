var GridException = require('./GridException.js');
var parseCssDimension = require('parse-css-dimension');

function Grid(columns, gutter, margin) {
    this._columns = columns || parseCssDimension('12');
    this._gutter = gutter || parseCssDimension('16px');
    this._margin = margin || parseCssDimension('16px');
    this._media = {};
}

Grid.prototype.setProp = function (prop, value, media) {
    if (prop === 'columns') {
        this.setColumns(value, media);
    } else if (prop === 'gutter') {
        this.setGutter(value, media);
    } else if (prop === 'margin') {
        this.setMargin(value, media);
    }
};

Grid.prototype.setColumns = function (v, media) {
    if (media) {
        if (this.hasMedia(media)) {
            this._media[media].columns = v;
        }
    } else {
        this._columns = v;
    }
};

Grid.prototype.setGutter = function (v, media) {
    if (media) {
        if (this.hasMedia(media)) {
            this._media[media].gutter = v;
        }
    } else {
        this._gutter = v;
    }
};

Grid.prototype.setMargin = function (v, media) {
    if (media) {
        if (this.hasMedia(media)) {
            this._media[media].margin = v;
        }
    } else {
        this._margin = v;
    }
};

Grid.prototype.addMedia = function (name, query, columns, gutter, margin) {
    this._media[name] = {
        query: query,
        columns: columns,
        gutter: gutter,
        margin: margin
    };
};

Grid.prototype.hasMedia = function (media) {
    return Boolean(this._media[media]);
};

Grid.prototype.columns = function (media) {
    if (media) {
        if (!this.hasMedia(media)) {
            throw new GridException('unknown media: ' + media);
        }
        return this._media[media].columns || this._columns;
    }

    return this._columns;
};

Grid.prototype.gutter = function (media) {
    if (media) {
        if (!this.hasMedia(media)) {
            throw new GridException('unknown media: ' + media);
        }
        return this._media[media].gutter || this._gutter;
    }

    return this._gutter;
};

Grid.prototype.margin = function (media) {
    if (media) {
        if (!this.hasMedia(media)) {
            throw new GridException('unknown media: ' + media);
        }
        return this._media[media].margin || this._margin;
    }

    return this._margin;
};

Grid.prototype.mediaQuery = function (media) {
    if (media) {
        if (!this.hasMedia(media)) {
            return null;
        }
        return this._media[media].query;
    }

    return null;
};

Grid.prototype.eachMedia = function (fn) {
    for (var m in this._media) {
        fn(m, this.mediaQuery(m));
    }
};

module.exports = Grid;
