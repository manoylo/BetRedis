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
    this.dbEngine = dbEngine;
    this.type = type;
    this.key = key;
    this.value = value;
    this.otherValues = otherValues;
}

Command.prototype.execute = function () {
    return this.dbEngine[this.type].call(null, this.key, this.value, this.otherValues);
};


module.exports = Command;