var MyRedis = (function () {

    /*** Constants ***/

    var ID_LENGTH = 12;
    var ID_PATTERN = new RegExp("^ID:\\w{" + ID_LENGTH + "} ");
    var COMMANDS = [
        'get', 'set', 'del', 'expire', 'ttl', 'type', 'keys',
        'append', 'strlen', 'incrby',
        'hset', 'hget', 'hkeys', 'hvals', 'hdel', 'hincrby'
    ];


    /*** Private properties ***/



    var connectPromise;
    var socket;


    /*** Provate functions ***/




    function generateRequestId() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < ID_LENGTH; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }


    function sendCommand(commandType, commandArguments) {
        var commandText = commandType;
        for (var i = 0; i < commandArguments.length; i++) {
            commandText += ' "' + commandArguments[i] + '"';
        }

        var requestId = generateRequestId();
        connectPromise.then(function () {
            socket.send('ID:' + requestId + ' ' + commandText);
        });

        return new Promise(function (resolve, reject) {
            socket.onmessage = function (event) {
                var matches = event['data'].match(ID_PATTERN);
                if (matches && matches[0] == 'ID:' + requestId + " ") {
                    var message = event['data'].replace(ID_PATTERN, "");
                    var matchesError = message.match(/- error - (.*)/);
                    if (matchesError) {
                        reject(matchesError[1]);
                    } else {
                        resolve(message);
                    }
                }
            }
        });
    }

    /**
     * MyRedis
     * @param url
     * @constructor
     */
    function MyRedis(url) {
        socket = new WebSocket("ws://" + url);
        connectPromise = new Promise(function (resolve, reject) {
            socket.onopen = function () {
                resolve();
            };

            socket.onclose = function (event) {
                if (!event.wasClean) {
                    reject(Error('Connection closed'));
                }
            };
        });
    }


    /**
     * set
     * @param key
     * @param value
     */
    MyRedis.prototype.set = function (key, value) {
        return sendCommand('set', arguments);
    };


    MyRedis.prototype.get = function (key) {
        return sendCommand('get', arguments);
    };


    MyRedis.prototype.strlen = function (key) {
        return sendCommand('strlen', arguments);
    };


    MyRedis.prototype.expire = function (key, value) {
        return sendCommand('expire', arguments);
    };


    MyRedis.prototype.ttl = function (key) {
        return sendCommand('ttl', arguments);
    };


    MyRedis.prototype.del = function (key) {
        return sendCommand('del', arguments);
    };


    MyRedis.prototype.type = function (key) {
        return sendCommand('type', arguments);
    };


    MyRedis.prototype.keys = function (keyPattern) {
        return sendCommand('keys', arguments);
    };


    MyRedis.prototype.append = function (key, value) {
        return sendCommand('append', arguments);
    };


    MyRedis.prototype.incrby = function (key, value) {
        return sendCommand('incrby', arguments);
    };


    MyRedis.prototype.hset = function (key, hashKey, value) {
        return sendCommand('hset', arguments);
    };


    MyRedis.prototype.hget = function (key, hashKey) {
        return sendCommand('hget', arguments);
    };


    MyRedis.prototype.hkeys = function (key) {
        return sendCommand('hkeys', arguments);
    };


    MyRedis.prototype.hvals = function (key) {
        return sendCommand('hvals', arguments);
    };


    MyRedis.prototype.hdel = function (key, hashKey) {
        return sendCommand('hdel', arguments);
    };


    MyRedis.prototype.hincrby = function (key, hashKey, value) {
        return sendCommand('hincrby', arguments);
    };

    return MyRedis;
}());


//    var s = new WebSocket("ws://localhost:3000");
//    s.onopen = function() {
//        s.send('set test 123');
//    };
//    socket.onopen = function() {
//        alert("?????????? ???????????.");
//    };
//
//    socket.onclose = function(event) {
//        if (event.wasClean) {
//            alert('?????????? ??????? ?????');
//        } else {
//            alert('????? ??????????'); // ????????, "????" ??????? ???????
//        }
//        alert('???: ' + event.code + ' ???????: ' + event.reason);
//    };
//
//    socket.onmessage = function(event) {
//        alert("???????? ?????? " + event.data);
//    };
//
//    socket.onerror = function(error) {
//        alert("?????? " + error.message);
//    };