"use strict";

var Command = require('./Command.js');


function CommandManager() {

    function parseTextCommand(text) {
        return {
            type: 'get',
            key: 'test'
        }
    }


    function validateCommandData(commandData) {
        if (commandData['type'] == 'get') {
            if (!commandData['key']) {
                throw new Error('Missing key for GET command');
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