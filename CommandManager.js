"use strict";

var _ = require('lodash');
var Command = require('./Command.js');


function CommandManager() {

    var COMMANDS = [
        'get', 'set', 'del', 'expire', 'ttl', 'type', 'keys',
        'append', 'strlen', 'incrby',
        'hset', 'hget', 'hkeys', 'hvals', 'hdel', 'hincrby'
    ];


    function parseTextCommand(text) {
        if (!text) {
            throw new Error('Empty command');
        }

        var tokens = text.split(" ");

        if (!_.includes(COMMANDS, tokens[0])) {
            throw new Error('Unknown command.');
        }

        if (tokens.length == 1) {
            throw new Error('Missing a KEY.');
        }

        return {
            type: tokens[0],
            key: tokens[1],
            value: tokens[2],
            otherValues: tokens.slice(3)
        }
    }


    function validateCommandData(commandData) {
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
    }


    this.createCommand = function (engine, text) {
        var commandData = parseTextCommand(text);
        validateCommandData(commandData);
        return new Command(engine, commandData['type'], commandData['key'], commandData['value'], commandData['otherValues']);
    };


    this.run = function (command) {
        return command.execute();
    };
}


module.exports = new CommandManager();