"use strict";

var CommandManager = require('./CommandManager');
var PubSubManager = require('./PubSubManager');

var commandManager = new CommandManager();
var pubSubManager = new PubSubManager();
var memoryDbEngine = require('./MemoryDBEngine');

/**
 * Request ID regex pattern
 * @type {RegExp}
 */
var ID_PATTERN = /^ID:\w{12} /;


// initializaing the WebSocket server
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 3000});


/**
 * getRequestId
 * Extracts request ID from a message
 * @param message
 */
function getRequestId(message) {
    var matches = message.match(ID_PATTERN);
    if (matches) {
        var requestId = matches[0];
    } else {
        throw new Error('Invalid message format - ID is missing');
    }
    return requestId;
}

/**
 * main
 */

wss.on('connection', function connection(ws) {
    var connectionId = pubSubManager.addConnection(ws);

    // message received
    ws.on('message', function incoming(message) {
        try {
            var command, result;
            var requestId = getRequestId(message);
            message = message.replace(requestId, "").trim();

            if(pubSubManager.isPubSubCommand(message)) {
                command = pubSubManager.createCommand(memoryDbEngine, message, connectionId);
                result = pubSubManager.run(command);
            } else {
                command = commandManager.createCommand(memoryDbEngine, message);
                result = commandManager.run(command);
            }

            // sending the command result
            ws.send(requestId + ' ' + String(result));
        } catch (e) {
            if (requestId) {
                ws.send(requestId + "- error - " + e.message);
            }
        }
    });

    ws.on('close', function () {
        pubSubManager.removeConnection(connectionId);
    });

    ws.on('error', function () {
        pubSubManager.removeConnection(connectionId);
    });

});