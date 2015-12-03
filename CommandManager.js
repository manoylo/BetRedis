"use strict";

var _ = require('lodash');
var Command = require('./Command.js');


/**
 * CommandManager
 * Responsible for creating and executing Commands
 * Another name: Invoker
 * @constructor
 */
function CommandManager() {
    /**
     * Implemented commands
     */
    this.COMMANDS = [
        'get', 'set', 'del', 'expire', 'ttl', 'type', 'keys',
        'append', 'strlen', 'incrby',
        'hset', 'hget', 'hkeys', 'hvals', 'hdel', 'hincrby'
    ];
}


/**
 * parseTextCommand
 * Splits command text into arguments
 * @param text
 * @returns {{type: string, key: string}}
 */
CommandManager.prototype.parseTextCommand = function (text) {
    if (!text) {
        throw new Error('Empty command');
    }

    // command regex
    var matches = text.match(/([a-z]+) "([^"]+)"(.*)/i);

    if (!matches) {
        throw new Error('Syntax error.');
    }

    if (!_.includes(this.COMMANDS, matches[1])) {
        throw new Error('Unknown command.');
    }

    if (!matches[2]) {
        throw new Error('Missing a KEY.');
    }

    var result = {
        type: matches[1],
        key: matches[2]
    };

    // checking for values
    if (matches[3]) {
        var values = matches[3].split('" "').map(function (value) {
            return value.trim().replace(/"/g, "");
        });
        result['value'] = values[0];

        if (values.length > 1) {
            result['otherValues'] = values.slice(1);
        }
    }
    return result;
};


/**
 * validateCommandData
 * Checks commands syntax: arguments number and type
 * @param commandData
 */
CommandManager.prototype.validateCommandData = function (commandData) {
    switch (commandData['type']) {
        case 'set':
        case 'append':
            if (!commandData['value']) {
                throw new Error('Syntax error: Missing value');
            }
            break;
        case 'expire':
        case 'incrby':
            if (!commandData['value']) {
                throw new Error('Syntax error: Missing value');
            }
            if (isNaN(parseInt(commandData['value']))) {
                throw new Error('Syntax error: value should be an integer');
            }
            break;
        case 'hset':
            if (!commandData['value']) {
                throw new Error('Syntax error: Missing Hash key');
            }
            if (commandData['otherValues'].length < 1) {
                throw new Error('Syntax error: Missing value');
            }
            break;
        case 'hget':
        case 'hdel':
            if (!commandData['value']) {
                throw new Error('Syntax error: Missing Hash key');
            }
            break;
        case 'hincrby':
            if (!commandData['value']) {
                throw new Error('Syntax error: Missing Hash key');
            }
            if (commandData['otherValues'].length < 1) {
                throw new Error('Syntax error: Missing value');
            }
            if (isNaN(parseInt(commandData['otherValues'][0]))) {
                throw new Error('Syntax error: value should be an integer');
            }
            break;
    }
};


/**
 * createCommand
 * @param engine
 * @param text
 * @returns {Command}
 */
CommandManager.prototype.createCommand = function (engine, text) {
    var commandData = this.parseTextCommand(text);
    this.validateCommandData(commandData);
    return new Command(engine, commandData['type'], commandData['key'], commandData['value'], commandData['otherValues']);
};


/**
 * run
 * Runs a Command
 * @param command
 */
CommandManager.prototype.run = function (command) {
    return command.execute();
};


module.exports = CommandManager;