var commandManager = require('./CommandManager');
var memoryDbEngine = require('./MemoryDBEngine');

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: 3000 });

wss.on('connection', function connection(ws) {

    console.log('connected');

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);

        var command = commandManager.createCommand(memoryDbEngine, message);
        var result = commandManager.run(command);
        ws.send(result);
    });
});