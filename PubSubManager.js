"use strict";

var _ = require('lodash');
var uuid = require('node-uuid');
var PubSubCommand = require('./PubSubCommand');
var CommandManager = require('./CommandManager');


var connections = {};


/**
 * CommandManager
 * Responsible for creating and executing Commands
 * @constructor
 */
function PubSubManager() {
    /**
     * Implemented commands
     */
    this.COMMANDS = ['publish', 'subscribe', 'unsubscribe'];
}

PubSubManager.prototype = Object.create(CommandManager.prototype);


PubSubManager.prototype.isPubSubCommand = function (commandText) {
    return commandText.match(new RegExp("^(" + this.COMMANDS.join('|') + ")\\s")) != null;
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
 * @param connectionId
 * @returns {PubSubCommand}
 */
PubSubManager.prototype.createCommand = function (engine, text, connectionId) {
    var commandData = this.parseTextCommand(text);
    this.validateCommandData(commandData);
    return new PubSubCommand(connectionId, engine, commandData['type'], commandData['key'], commandData['value'], commandData['otherValues']);
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