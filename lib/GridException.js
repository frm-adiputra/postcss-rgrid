function GridException(message) {
    this.message = message;
    this.name = 'GridException';
}

GridException.prototype.toString = function () {
    return this.message;
};

module.exports = GridException;
