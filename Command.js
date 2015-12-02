"use strict";


/**
 * Command
 * @param dbEngine
 * @param type
 * @param key
 * @param value
 * @param otherValues
 * @constructor
 */
function Command(dbEngine, type, key, value, otherValues) {
    this.execute = function() {
        return dbEngine[type].call(null, key, value, otherValues);
    };
}


module.exports = Command;