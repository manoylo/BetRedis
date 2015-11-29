"use strict";

var _ = require('lodash');


function MemoryDBEngine() {
    var data = {};
    var expires = {};
    var expired = {};


    function expireTick() {
        _.each(expires, function(time, key) {
            if(time <= 0) {
                delete data[key];
                delete expires[key];
                expired[key] = 1;
            }
            expires[key]--;
        });
    }


    this.get = function (key) {
        return data[key];
    };

    this.set = function (key, value) {
        data[key] = value;
        if(expired[key]) {
            delete expired[key];
        }
        return 1;
    };

    this.del = function (key) {
        delete data[key];
    };

    this.expire = function (key, value) {
        expires[key] = value;
    };

    this.ttl = function (key) {
        if(expires[key]) {
            return expires[key];
        }
        if(expired[key]) {
            return -2;
        }
        return -1;
    };


    setInterval(expireTick, 1000);
}


module.exports = new MemoryDBEngine();