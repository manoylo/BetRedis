var commandManager = require('./CommandManager');
var memoryDbEngine = require('./MemoryDBEngine');

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: 3000 });

wss.on('connection', function connection(ws) {

    console.log('connected');

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);

        try {
            var command = commandManager.createCommand(memoryDbEngine, message);
            var result = commandManager.run(command);
            console.log('result: ' + result);
            ws.send(String(result));
        } catch(e) {
            console.log('error: ' + e);
            ws.send(e.message);
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