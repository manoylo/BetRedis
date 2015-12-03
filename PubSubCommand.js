"use strict";

var Command = require('./Command.js');


/**
 * PubSubCommand
 * @param connectionId
 * @param dbEngine
 * @param type
 * @param key
 * @param value
 * @param otherValues
 * @constructor
 */
function PubSubCommand(connectionId, dbEngine, type, key, value, otherValues) {
    Command.call(this, dbEngine, type, key, value, otherValues);
    this.connectionId = connectionId;
}

// inheriting PubSubManager -> CommandManager
PubSubCommand.prototype = Object.create(Command.prototype);


/**
 * execute
 * @returns {*}
 */
PubSubCommand.prototype.execute = function () {
    return this.dbEngine[this.type].call(null, this.connectionId, this.key, this.value, this.otherValues);
};


module.exports = PubSubCommand;