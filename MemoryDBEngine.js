"use strict";


function MemoryDBEngine() {
    var data = {};

    this.get = function (key) {
        return data[key];
    };

    this.set = function (key, value) {
        data[key] = value;
    };

    this.del = function(key) {
        delete data[key];
    }
}


module.exports = new MemoryDBEngine();