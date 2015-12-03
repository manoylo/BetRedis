"use strict";

var _ = require('lodash');
var uuid = require('node-uuid');
var Command = require('./Command');
var CommandManager = require('./CommandManager');


var COMMANDS = ['publish', 'subscribe', 'unsubscribe'];


var connections = {};


/**
 * CommandManager
 * Responsible for creating and executing Commands
 * @constructor
 */
function PubSubManager() {
}

PubSubManager.prototype = Object.create(CommandManager.prototype);


PubSubManager.prototype.isPubSubCommand = function (commandText) {
    return commandText.match(new RegExp("^(" + COMMANDS.join('|') + ")\\s")) != null;
};

PubSubManager.prototype.addConnection = function (connection) {
    var id = uuid.v4();
    connections[id] = connection;
    return id;
};

PubSubManager.prototype.removeConnection = function (connectionId) {
    delete connections[connectionId];
};


/**
 * validateCommandData
 * Checks commands syntax: arguments number and type
 * @param commandData
 */
PubSubManager.prototype.validateCommandData = function (commandData) {
    switch (commandData['type']) {
        case 'publish':
            if (!commandData['value']) {
                throw new Error('Syntax error: Missing value');
            }
            break;
    }
};


/**
 * createCommand
 * @param engine
 * @param text
 * @param connection
 * @returns {Command}
 */
PubSubManager.prototype.createCommand = function (engine, text, connection) {
    var commandData = this.parseTextCommand(text);
    this.validateCommandData(commandData);
    return new Command(engine, commandData['type'], commandData['key'], commandData['value'], clientId);
};


/**
 * run
 * Runs a Command
 * @param command
 */
PubSubManager.prototype.run = function (command) {
    var result = command.execute();
    if (command.type == 'publish') {
        console.log('publish!!!');
    }
    return result;
};


module.exports = PubSubManager;