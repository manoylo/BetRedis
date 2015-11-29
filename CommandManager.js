"use strict";

var Command = require('./Command.js');


function CommandManager() {

    var commands = ['get', 'set'];


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