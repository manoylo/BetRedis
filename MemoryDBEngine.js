"use strict";

var _ = require('lodash');


/**
 * MemoryDBEngine
 * Implements DB functionality
 * @constructor
 */
function MemoryDBEngine() {
    /**
     * Main data store
     */
    var data = {};
    /**
     * Keys that are expiring
     */
    var expires = {};
    /**
     * Expired keys
     */
    var expired = {};


    /**
     * expireTick
     * Expiring functionality
     */
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


    /**
     * get
     * @param key
     * @returns {*}
     */
    this.get = function (key) {
        if (typeof data[key] == "object") {
            throw new Error("Wrong data type");
        }
        if(!data[key]) {
            return null;
        }
        return data[key];
    };


    /**
     * set
     * @param key
     * @param value
     * @returns {string}
     */
    this.set = function (key, value) {
        data[key] = value;
        if (expired[key]) {
            delete expired[key];
        }
        return 'OK';
    };


    /**
     * del
     * @param key
     * @returns {number}
     */
    this.del = function (key) {
        if(data[key]) {
            delete data[key];
            return 1;
        }
        return 0;
    };


    /**
     * expire
     * @param key
     * @param value
     * @returns {number}
     */
    this.expire = function (key, value) {
        expires[key] = value;
        return 1;
    };


    /**
     * ttl
     * @param key
     * @returns {*}
     */
    this.ttl = function (key) {
        if (expires[key]) {
            return expires[key];
        }
        if (expired[key]) {
            return -2;
        }
        return -1;
    };


    /**
     * type
     * @param key
     * @returns {*}
     */
    this.type = function (key) {
        if (!data[key]) {
            return "none";
        }
        if (typeof data[key] == "object") {
            return "hash";
        }
        return "string";
    };


    /**
     * keys
     * @param keyPattern
     * @returns {*}
     */
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


    /**
     * append
     * @param key
     * @param value
     * @returns {*}
     */
    this.append = function (key, value) {
        value = String(value);

        if (data[key]) {
            data[key] += value;
        } else {
            data[key] = value;
        }
        return data[key].length;
    };


    /**
     * strlen
     * @param key
     * @returns {*}
     */
    this.strlen = function (key) {
        if (data[key]) {
            return String(data[key]).length;
        }
        return 0;
    };


    /**
     * incrby
     * @param key
     * @param value
     * @returns {*}
     */
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


    /**
     * hset
     * @param key
     * @param hashKey
     * @param values
     * @returns {number}
     */
    this.hset = function (key, hashKey, values) {
        var value = _.first(values);
        if (data[key] && typeof data[key] == "object") {
            var returnValue = 1;
            if(data[key][hashKey]) {
                returnValue = 0;
            }
            data[key][hashKey] = value;
            return returnValue;
        }
        data[key] = {};
        data[key][hashKey] = value;
        return 1;
    };


    /**
     * hget
     * @param key
     * @param hashKey
     * @returns {*}
     */
    this.hget = function (key, hashKey) {
        if (!data[key] || !data[key][hashKey]) {
            return null;
        }
        return data[key][hashKey];
    };


    /**
     * hkeys
     * @param key
     * @returns {*}
     */
    this.hkeys = function (key) {
        if (!data[key] || typeof data[key] != "object") {
            return null;
        }
        return _.keys(data[key]);
    };


    /**
     * hvals
     * @param key
     * @returns {*}
     */
    this.hvals = function (key) {
        if (!data[key] || typeof data[key] != "object") {
            return null;
        }
        return _.values(data[key]);
    };


    /**
     * hdel
     * @param key
     * @param hashKey
     * @returns {number}
     */
    this.hdel = function (key, hashKey) {
        if (!data[key] || !data[key][hashKey]) {
            return 0;
        }
        delete data[key][hashKey];
        return 1;
    };


    /**
     * hincrby
     * @param key
     * @param hashKey
     * @param values
     * @returns {*}
     */
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

    // starting expiring mechanism
    setInterval(expireTick, 1000);
}


module.exports = new MemoryDBEngine();