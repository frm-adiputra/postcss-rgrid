var GridException = require('./GridException.js');

var store = {};

var put = function (name, opts) {
    if (store[name]) {
        return false;
    }

    store[name] = opts;
    return true;
};

var get = function (name) {
    return store[name];
};

module.exports = {
    put: put,
    get: get
};
