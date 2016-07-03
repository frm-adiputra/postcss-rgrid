var parseCssDimension = require('parse-css-dimension');
var GridException = require('./GridException.js');

function Cell(grid, span, offsetBefore, offsetAfter) {
    this._grid = grid;
    this._span = span;
    this._offsetBefore = offsetBefore;
    this._offsetAfter = offsetAfter;
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
        this._span = v;
    }
};

Cell.prototype.setOffsetBefore = function (v, media) {
    if (media) {
        if (this._media[media]) {
            this._media[media].offsetBefore = v;
        }
    } else {
        this._offsetBefore = v;
    }
};

Cell.prototype.setOffsetAfter = function (v, media) {
    if (media) {
        if (this._media[media]) {
            this._media[media].offsetAfter = v;
        }
    } else {
        this._offsetAfter = v;
    }
};

Cell.prototype.addMedia = function (name, span, offsetBefore, offsetAfter) {
    if (!this._grid.hasMedia(name)) {
        throw new GridException('unknown media: ' + name);
    }

    this._media[name] = {
        span: span || this._span,
        offsetBefore: offsetBefore || this._offsetBefore,
        offsetAfter: offsetAfter || this._offsetAfter
    };
};

Cell.prototype.media = function (media) {
    if (media) {
        if (this._grid.hasMedia(media)) {
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

Cell.prototype.span = function (media) {
    if (media) {
        if (this._grid.hasMedia(media)) {
            if (!this._media[media] || !this._media[media].span) {
                return this._span;
            }
            return this._media[media].span;
        } else {
            return null;
        }
    }
    return this._span;
};

Cell.prototype.offsetBefore = function (media) {
    if (media) {
        if (this._grid.hasMedia(media)) {
            if (!this._media[media]) {
                return this._offsetBefore || parseCssDimension('0');
            }
            return this._media[media].offsetBefore ||
                this._offsetBefore ||
                parseCssDimension('0');
        } else {
            return null;
        }
    }
    return this._offsetBefore || parseCssDimension('0');
};

Cell.prototype.offsetAfter = function (media) {
    if (media) {
        if (this._grid.hasMedia(media)) {
            if (!this._media[media]) {
                return this._offsetAfter || parseCssDimension('0');
            }
            return this._media[media].offsetAfter ||
                this._offsetAfter ||
                parseCssDimension('0');
        } else {
            return null;
        }
    }
    return this._offsetAfter || parseCssDimension('0');
};

Cell.prototype.width = function (media) {
    var span = this.span(media);
    if (!span) {
        return null;
    }

    var columns = this._grid.columns(media);
    var margin = this._grid.margin(media);
    var szPerc = span.value * 100 / columns.value;

    return 'calc(' + szPerc + '% - ' + margin.value + margin.unit + ')';
};

Cell.prototype.marginLeft = function (media) {
    var offsetBefore = this.offsetBefore(media);
    if (!offsetBefore) {
        return null;
    }

    var margin = this._grid.margin(media);
    var defaultMargin = margin.value / 2;

    if (offsetBefore.value === 0) {
        return defaultMargin.toString() + margin.unit;
    }

    var columns = this._grid.columns(media);
    var szPerc = offsetBefore.value * 100 / columns.value;

    return 'calc(' + szPerc + '% + ' + defaultMargin + margin.unit + ')';
};

Cell.prototype.marginRight = function (media) {
    var offsetAfter = this.offsetAfter(media);
    if (!offsetAfter) {
        return null;
    }

    var margin = this._grid.margin(media);
    var defaultMargin = margin.value / 2;

    if (offsetAfter.value === 0) {
        return defaultMargin.toString() + margin.unit;
    }

    var columns = this._grid.columns(media);
    var szPerc = offsetAfter.value * 100 / columns.value;

    return 'calc(' + szPerc + '% + ' + defaultMargin + margin.unit + ')';
};

Cell.prototype.eachMedia = function (fn) {
    for (var m in this._media) {
        fn(m, this._grid.mediaQuery(m));
    }
};

Cell.prototype.mediaQuery = function (media) {
    return this._grid.mediaQuery(media);
};

module.exports = Cell;
