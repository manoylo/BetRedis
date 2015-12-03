"use strict";

var Command = require('./Command.js');


/**
 * PubSubCommand
 * @param dbEngine
 * @param type
 * @param key
 * @param value
 * @param {string} clientId
 * @constructor
 */
function PubSubCommand(dbEngine, type, key, value, clientId) {

}

PubSubCommand.prototype = Object.create(Command.prototype);


module.exports = PubSubCommand;