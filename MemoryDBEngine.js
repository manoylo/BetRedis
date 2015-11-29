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
        if(typeof data[key] == "object") {
            throw new Error("Wrong data type");
        }
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


    this.append = function(key, value) {
        value = String(value);

        if(data[key]) {
            data[key] += value;
        } else {
            data[key] = value;
        }
        return data[key].length;
    };


    this.strlen = function(key) {
        if(data[key]) {
            return String(data[key]).length;
        }
        return 0;
    };


    this.incrby = function(key, value) {
        value = parseInt(value);

        if(!data[key]) {
            data[key] = value;
            return value;
        }
        if(isNaN(parseInt(data[key]))) {
            throw new Error("Invalid value for INCRBY");
        }
        data[key] = parseInt(data[key]) + value;
        return data[key];
    };


    this.hset = function(key, hashKey, values) {
        var value = _.first(values);
        if(data[key] && typeof data[key] == "object") {
            data[key][hashKey] = value;
            return 0;
        }
        data[key] = {};
        data[key][hashKey] = value;
        return 1;
    };


    this.hget = function(key, hashKey) {
        if(!data[key] || !data[key][hashKey]) {
            return null;
        }
        return data[key][hashKey];
    };


    setInterval(expireTick, 1000);
}


module.exports = new MemoryDBEngine();