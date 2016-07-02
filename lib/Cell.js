var GridException = require('./GridException.js');

function Cell(grid, span, offsetBefore, offsetAfter) {
    this.grid = grid;
    this.span = span;
    this.offsetBefore = offsetBefore;
    this.offsetAfter = offsetAfter;
    this._media = {};
}

Cell.prototype.setProp = function (prop, value, media) {
    if (prop === 'span') {
        this.setSpan(value, media);
    } else if (prop === 'offset-before') {
        this.setOffsetBefore(value, media);
    } else if (prop === 'offset-after') {
        this.setOffsetAfter(value, media);
    }
};

Cell.prototype.setSpan = function (v, media) {
    if (media) {
        if (this._media[media]) {
            this._media[media].span = v;
        }
    } else {
        this.span = v;
    }
};

Cell.prototype.setOffsetBefore = function (v, media) {
    if (media) {
        if (this._media[media]) {
            this._media[media].offsetBefore = v;
        }
    } else {
        this.offsetBefore = v;
    }
};

Cell.prototype.setOffsetAfter = function (v, media) {
    if (media) {
        if (this._media[media]) {
            this._media[media].offsetAfter = v;
        }
    } else {
        this.offsetAfter = v;
    }
};

Cell.prototype.addMedia = function (name, span, offsetBefore, offsetAfter) {
    if (!this.grid.hasMedia(name)) {
        throw new GridException('unknown media: ' + name);
    }

    this._media[name] = {
        span: span || this.span,
        offsetBefore: offsetBefore || this.offsetBefore,
        offsetAfter: offsetAfter || this.offsetAfter
    };
};

Cell.prototype.media = function (media) {
    if (media) {
        if (this.grid.hasMedia(media)) {
            if (!this._media[media]) {
                return this;
            }
            return this._media[media];
        } else {
            return null;
        }
    }

    return this;
};

Cell.prototype.width = function (media) {
    var c = this.media(media);
    if (!c) {
        throw new GridException('unknown media: ' + media);
    }

    if (!c.span) {
        return null;
    }

    var columns = this.grid.columns(media);
    var margin = this.grid.margin(media);
    var szPerc = c.span.value * 100 / columns.value;

    return 'calc(' + szPerc + '% - ' + margin.value + margin.unit + ')';
};

Cell.prototype.marginLeft = function (media) {
    var c = this.media(media);
    if (!c) {
        throw new GridException('unknown media: ' + media);
    }

    var margin = this.grid.margin(media);
    var defaultMargin = margin.value / 2;

    return defaultMargin.toString() + margin.unit;
};

Cell.prototype.marginRight = function (media) {
    var c = this.media(media);
    if (!c) {
        throw new GridException('unknown media: ' + media);
    }

    var margin = this.grid.margin(media);
    var defaultMargin = margin.value / 2;

    return defaultMargin.toString() + margin.unit;
};

Cell.prototype.eachMedia = function (fn) {
    for (var m in this._media) {
        fn(m, this.grid.mediaQuery(m));
    }
};

Cell.prototype.mediaQuery = function (media) {
    return this.grid.mediaQuery(media);
};

module.exports = Cell;
