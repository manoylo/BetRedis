"use strict";

var _ = require('lodash');
var Command = require('./Command.js');


function CommandManager() {

    var commands = [
        'get', 'set', 'del', 'expire', 'ttl',
        'append', 'strlen', 'incrby',
        'hset', 'hget'
    ];


    function parseTextCommand(text) {
        if (!text) {
            throw new Error('Empty command');
        }

        var tokens = text.split(" ");

        if (!_.includes(commands, tokens[0])) {
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
                if (!commandData['value']) {
                    throw new Error('Syntax error: Missing Hash key');
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