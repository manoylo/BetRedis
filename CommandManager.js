"use strict";

var Command = require('./Command.js');


function CommandManager() {

    var commands = ['get', 'set', 'del', 'expire', 'ttl', 'append', 'strlen', 'incrby'];


    function parseTextCommand(text) {
        if (!text) {
            throw new Error('Empty command');
        }

        var commandsCSV = commands.join('|');
        var matches = text.match(new RegExp("(" + commandsCSV + ") (\\w+)( (\\w*))?", "i"));

        if (!matches) {
            throw new Error('Command parse error. Please refer to the correct syntax.');
        }

        return {
            type: matches[1],
            key: matches[2],
            value: matches[4]
        }
    }


    function validateCommandData(commandData) {
        switch (commandData['type']) {
            case 'set':
                if (!commandData['value']) {
                    throw new Error('Syntax error: Missing value for a SET command');
                }
                break;
            case 'append':
                if (!commandData['value']) {
                    throw new Error('Syntax error: Missing value for a APPEND command');
                }
                break;
            case 'expire':
                if (!commandData['value']) {
                    throw new Error('Syntax error: Missing value for a EXPIRE command');
                }
                if (isNaN(parseInt(commandData['value']))) {
                    throw new Error('Syntax error: EXPIRE value should be an integer');
                }
                break;
            case 'incrby':
                if (!commandData['value']) {
                    throw new Error('Syntax error: Missing value for a INCRBY command');
                }
                if (isNaN(parseInt(commandData['value']))) {
                    throw new Error('Syntax error: INCRBY value should be an integer');
                }
                break;
        }
    }


    this.createCommand = function (engine, text) {
        var commandData = parseTextCommand(text);
        validateCommandData(commandData);
        return new Command(engine, commandData['type'], commandData['key'], commandData['value']);
    };


    this.run = function (command) {
        return command.execute();
    };
}


module.exports = new CommandManager();