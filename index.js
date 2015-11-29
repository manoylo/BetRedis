var commandManager = require('./CommandManager');
var memoryDbEngine = require('./MemoryDBEngine');

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: 3000 });

var ID_PATTERN = /^ID:\w{12} /;

wss.on('connection', function connection(ws) {

    console.log('connected');

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);

        try {
            var matches = message.match(ID_PATTERN);
            if(matches) {
                message = message.replace(ID_PATTERN, "");
                var requestId = matches[0];
                console.log(requestId);
            } else {
                throw new Error('Invalid message format - ID is missing');
            }
            var command = commandManager.createCommand(memoryDbEngine, message);
            var result = commandManager.run(command);
            console.log('result: ' + result);
            ws.send(requestId + ' ' + String(result));
        } catch(e) {
            console.log('error: ' + e);
            ws.send("Error: " + e.message);
        }
    });
});

//try {
//    var command = commandManager.createCommand(memoryDbEngine, "set test 123");
//    var result = commandManager.run(command);
//    console.log(result);
//
//    command = commandManager.createCommand(memoryDbEngine, "get test");
//    result = commandManager.run(command);
//    console.log(result);
//} catch(e) {
//    console.error(e);
//}