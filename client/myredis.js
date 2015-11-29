var MyRedis = (function () {
    var COMMANDS = [
        'get', 'set', 'del', 'expire', 'ttl', 'type', 'keys',
        'append', 'strlen', 'incrby',
        'hset', 'hget', 'hkeys', 'hvals', 'hdel', 'hincrby'
    ];

    var connectPromise;

    function MyRedis(url) {
        var s = new WebSocket("ws://" + url);

        connectPromise = new Promise(function(resolve, reject) {
            s.onopen = function() {
                resolve();
            };

            s.onerror = function(error) {
                reject(error);
            };
        });

        //s.onmessage = function (event) {
        //    console.log(event.data);
        //};

        this.set = function (key, value) {
            connectPromise.then(function() {
                s.send('set ' + key + ' ' + value);
            });
            //return new Promise(function(resolve, reject) {
            //    req.onload = function() {
            //        // This is called even on 404 etc
            //        // so check the status
            //        if (req.status == 200) {
            //            // Resolve the promise with the response text
            //            resolve(req.response);
            //        }
            //        else {
            //            // Otherwise reject with the status text
            //            // which will hopefully be a meaningful error
            //            reject(Error(req.statusText));
            //        }
            //    };
            //
            //    // Handle network errors
            //    req.onerror = function() {
            //        reject(Error("Network Error"));
            //    };
            //
            //    // Make the request
            //    req.send();
            //});
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