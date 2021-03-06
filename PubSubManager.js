"use strict";

var _ = require('lodash');
var uuid = require('node-uuid');
var PubSubCommand = require('./PubSubCommand');
var CommandManager = require('./CommandManager');

/**
 * Used to store all connections
 * @type {{}}
 */
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

// inheriting PubSubManager -> CommandManager
PubSubManager.prototype = Object.create(CommandManager.prototype);


/**
 * isPubSubCommand
 * @param commandText
 * @returns {boolean}
 */
PubSubManager.prototype.isPubSubCommand = function (commandText) {
    return commandText.match(new RegExp("^(" + this.COMMANDS.join('|') + ")\\s")) != null;
};

/**
 * addConnection
 * @param connection
 * @returns {string}
 */
PubSubManager.prototype.addConnection = function (connection) {
    var id = uuid.v4();
    connections[id] = connection;
    return id;
};


/**
 * removeConnection
 * @param connectionId
 */
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
        if (result['connectionIds']) {
            _.each(result['connectionIds'], function (connectionId) {
                if (connections[connectionId]) {
                    connections[connectionId].send('message');
                    connections[connectionId].send(result['key']);
                    connections[connectionId].send(result['value']);
                }
            });
            return result['connectionIds'].length;
        }
        return 0;
    }

    return result;
};


module.exports = PubSubManager;