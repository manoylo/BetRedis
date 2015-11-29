"use strict";


function MemoryDBEngine() {
    var data = {};

    this.get = function (key) {
        console.log('engine: get');
        return data[key];
    };

    this.set = function (key, value) {
        data[key] = value;
    };
}


module.exports = new MemoryDBEngine();