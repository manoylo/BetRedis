var MyRedis = (function () {
    var COMMANDS = [
        'get', 'set', 'del', 'expire', 'ttl', 'type', 'keys',
        'append', 'strlen', 'incrby',
        'hset', 'hget', 'hkeys', 'hvals', 'hdel', 'hincrby'
    ];

    var ID_PATTERN = /^ID:\w{12} /;

    var connectPromise;
    var promises = {};

    function generateRequestId() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 12; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    function MyRedis(url) {
        var s = new WebSocket("ws://" + url);

        connectPromise = new Promise(function (resolve, reject) {
            s.onopen = function () {
                resolve();
            };

            s.onclose = function (event) {
                if (!event.wasClean) {
                    reject(Error('Connection closed'));
                }
            };
        });

        //s.onmessage = function (event) {
        //    console.log(event.data);
        //};

        this.set = function (key, value) {
            var requestId = generateRequestId();
            connectPromise.then(function () {
                s.send('ID:' + requestId + ' set ' + key + ' ' + value);
            });
            return new Promise(function(resolve, reject) {
                s.onmessage = function(event) {
                    var matches = event['data'].match(ID_PATTERN);
                    if(matches && matches[0] == 'ID:' + requestId + " ") {
                        resolve(event['data'].replace(ID_PATTERN, ""));
                    }
                }
            });
        };
    }

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