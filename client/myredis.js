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


    function sendCommand(commandtext) {
        var requestId = generateRequestId();
        connectPromise.then(function () {
            socket.send('ID:' + requestId + ' ' + commandtext);
        });

        return new Promise(function (resolve, reject) {
            socket.onmessage = function (event) {
                var matches = event['data'].match(ID_PATTERN);
                if (matches && matches[0] == 'ID:' + requestId + " ") {
                    resolve(event['data'].replace(ID_PATTERN, ""));
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
        return sendCommand('set ' + '"' + key + '"  "' + value + '"');
    };


    MyRedis.prototype.get = function (key) {
        return sendCommand('get ' + '"' + key + '"');
    };


    MyRedis.prototype.strlen = function (key) {
        return sendCommand('strlen ' + '"' + key + '"');
    };

    /*
    MyRedis.prototype.set = function (key, value) {
        return sendCommand('set ' + key + ' ' + value);
    };


    MyRedis.prototype.set = function (key, value) {
        return sendCommand('set ' + key + ' ' + value);
    };


    MyRedis.prototype.set = function (key, value) {
        return sendCommand('set ' + key + ' ' + value);
    };


    MyRedis.prototype.set = function (key, value) {
        return sendCommand('set ' + key + ' ' + value);
    };


    MyRedis.prototype.set = function (key, value) {
        return sendCommand('set ' + key + ' ' + value);
    };


    MyRedis.prototype.set = function (key, value) {
        return sendCommand('set ' + key + ' ' + value);
    };


    MyRedis.prototype.set = function (key, value) {
        return sendCommand('set ' + key + ' ' + value);
    };


    MyRedis.prototype.set = function (key, value) {
        return sendCommand('set ' + key + ' ' + value);
    };


    MyRedis.prototype.set = function (key, value) {
        return sendCommand('set ' + key + ' ' + value);
    };


    MyRedis.prototype.set = function (key, value) {
        return sendCommand('set ' + key + ' ' + value);
    };


    MyRedis.prototype.set = function (key, value) {
        return sendCommand('set ' + key + ' ' + value);
    };


    MyRedis.prototype.set = function (key, value) {
        return sendCommand('set ' + key + ' ' + value);
    };


    MyRedis.prototype.set = function (key, value) {
        return sendCommand('set ' + key + ' ' + value);
    };
    */

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