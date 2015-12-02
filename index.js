"use strict";

var commandManager = require('./CommandManager');
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
});