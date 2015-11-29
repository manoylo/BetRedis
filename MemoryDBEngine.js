"use strict";

var _ = require('lodash');


function MemoryDBEngine() {
    var data = {};
    var expires = {};
    var expired = {};


    function expireTick() {
        _.each(expires, function (time, key) {
            if (time <= 0) {
                delete data[key];
                delete expires[key];
                expired[key] = 1;
            }
            expires[key]--;
        });
    }


    this.get = function (key) {
        if (typeof data[key] == "object") {
            throw new Error("Wrong data type");
        }
        return data[key];
    };


    this.set = function (key, value) {
        data[key] = value;
        if (expired[key]) {
            delete expired[key];
        }
        return 'OK';
    };


    this.del = function (key) {
        if(data[key]) {
            delete data[key];
            return 1;
        }
        return 0;
    };


    this.expire = function (key, value) {
        expires[key] = value;
    };


    this.ttl = function (key) {
        if (expires[key]) {
            return expires[key];
        }
        if (expired[key]) {
            return -2;
        }
        return -1;
    };


    this.type = function (key) {
        if (!data[key]) {
            return "none";
        }
        if (typeof data[key] == "object") {
            return "hash";
        }
        return "string";
    };


    this.keys = function (keyPattern) {
        // Allowed patterns examples:
        // h?llo matches hello, hallo and hxllo
        // h*llo matches hllo and heeeello
        // h[ae]llo matches hello and hallo, but not hillo
        // h[^e]llo matches hallo, hbllo, ... but not hello
        // h[a-b]llo matches hallo and hbllo

        // replacing key patterns to regexps
        var PATTERNS_TO_REGEXP = {
            "\\?": ".",
            "\\*": ".*"
        };
        _.each(PATTERNS_TO_REGEXP, function (regexpLiteral, patternLiteral) {
            keyPattern = keyPattern.replace(new RegExp(patternLiteral, "g"), regexpLiteral);
        });

        // matching keys using regexp
        return _.filter(_.keys(data), function (key) {
            return key.match(new RegExp("^" + keyPattern + "$"));
        });
    };


    this.append = function (key, value) {
        value = String(value);

        if (data[key]) {
            data[key] += value;
        } else {
            data[key] = value;
        }
        return data[key].length;
    };


    this.strlen = function (key) {
        if (data[key]) {
            return String(data[key]).length;
        }
        return 0;
    };


    this.incrby = function (key, value) {
        value = parseInt(value);

        if (!data[key]) {
            data[key] = value;
            return value;
        }
        if (isNaN(parseInt(data[key]))) {
            throw new Error("Invalid value for INCRBY");
        }
        data[key] = parseInt(data[key]) + value;
        return data[key];
    };


    this.hset = function (key, hashKey, values) {
        var value = _.first(values);
        if (data[key] && typeof data[key] == "object") {
            data[key][hashKey] = value;
            return 0;
        }
        data[key] = {};
        data[key][hashKey] = value;
        return 1;
    };


    this.hget = function (key, hashKey) {
        if (!data[key] || !data[key][hashKey]) {
            return null;
        }
        return data[key][hashKey];
    };


    this.hkeys = function (key) {
        if (!data[key] || typeof data[key] != "object") {
            return null;
        }
        return _.keys(data[key]);
    };


    this.hvals = function (key) {
        if (!data[key] || typeof data[key] != "object") {
            return null;
        }
        return _.values(data[key]);
    };


    this.hdel = function (key, hashKey) {
        if (!data[key] || !data[key][hashKey]) {
            return 0;
        }
        delete data[key][hashKey];
        return 1;
    };


    this.hincrby = function (key, hashKey, values) {
        var value = parseInt(_.first(values));

        if (!data[key]) {
            data[key] = {};
            data[key][hashKey] = value;
            return value;
        }
        if (typeof data[key] != "object") {
            throw new Error("Wrong data type at given key for HINCRBY");
        }
        if (isNaN(parseInt(data[key][hashKey]))) {
            throw new Error("Wrong data type at given hashKey for HINCRBY");
        }
        data[key][hashKey] = parseInt(data[key][hashKey]) + value;
        return data[key][hashKey];
    };


    setInterval(expireTick, 1000);
}


module.exports = new MemoryDBEngine();