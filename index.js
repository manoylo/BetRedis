"use strict";

var commandManager = require('./CommandManager');
var pubSubManager = require('./PubSubManager');
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
        message = message.replace(ID_PATTERN, "");
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
    pubSubManager.addConnection(ws);

    // message received
    ws.on('message', function incoming(message) {
        try {
            var requestId = getRequestId(message);
            var command = commandManager.createCommand(memoryDbEngine, message);
            var result = commandManager.run(command);

            // sending the command result
            ws.send(requestId + ' ' + String(result));
        } catch (e) {
            if (requestId) {
                ws.send(requestId + "- error - " + e.message);
            }
        }
    });

    ws.on('close', function () {
        pubSubManager.removeConnection(ws);
    });

    ws.on('error', function () {
        pubSubManager.removeConnection(ws);
    });

});