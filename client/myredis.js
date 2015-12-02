var MyRedis = (function () {

    /*** Constants ***/
    var ID_LENGTH = 12;
    var ID_PATTERN = new RegExp("^ID:\\w{" + ID_LENGTH + "} ");


    /*** Private properties ***/
    var connectPromise;
    var socket;


    /*** Private functions ***/


    /**
     * generateRequestId
     * Generates random request ID
     * @returns {string}
     */
    function generateRequestId() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < ID_LENGTH; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }


    /**
     * sendCommand
     * Generic method used for all commands
     * @param commandType
     * @param commandArguments
     * @returns {Promise}
     */
    function sendCommand(commandType, commandArguments) {
        // generating command text
        var commandText = commandType;
        for (var i = 0; i < commandArguments.length; i++) {
            commandText += ' "' + commandArguments[i] + '"';
        }

        var requestId = generateRequestId();
        // sending command after ensuring the connection is established
        connectPromise.then(function () {
            socket.send('ID:' + requestId + ' ' + commandText);
        });

        return new Promise(function (resolve, reject) {
            socket.onmessage = function (event) {
                // checking if the message is a response for this command using request ID
                var matches = event['data'].match(ID_PATTERN);
                if (matches && matches[0] == 'ID:' + requestId + " ") {
                    // message contains the request ID
                    var message = event['data'].replace(ID_PATTERN, "");
                    // checking if this is an error
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


    /**
     * get
     * @param key
     * @returns {Promise}
     */
    MyRedis.prototype.get = function (key) {
        return sendCommand('get', arguments);
    };


    /**
     * strlen
     * @param key
     * @returns {Promise}
     */
    MyRedis.prototype.strlen = function (key) {
        return sendCommand('strlen', arguments);
    };


    /**
     * expire
     * @param key
     * @param value
     * @returns {Promise}
     */
    MyRedis.prototype.expire = function (key, value) {
        return sendCommand('expire', arguments);
    };


    /**
     * ttl
     * @param key
     * @returns {Promise}
     */
    MyRedis.prototype.ttl = function (key) {
        return sendCommand('ttl', arguments);
    };


    /**
     * del
     * @param key
     * @returns {Promise}
     */
    MyRedis.prototype.del = function (key) {
        return sendCommand('del', arguments);
    };


    /**
     * type
     * @param key
     * @returns {Promise}
     */
    MyRedis.prototype.type = function (key) {
        return sendCommand('type', arguments);
    };


    /**
     * keys
     * @param keyPattern
     * @returns {Promise}
     */
    MyRedis.prototype.keys = function (keyPattern) {
        return sendCommand('keys', arguments);
    };


    /**
     * append
     * @param key
     * @param value
     * @returns {Promise}
     */
    MyRedis.prototype.append = function (key, value) {
        return sendCommand('append', arguments);
    };


    /**
     * incrby
     * @param key
     * @param value
     * @returns {Promise}
     */
    MyRedis.prototype.incrby = function (key, value) {
        return sendCommand('incrby', arguments);
    };


    /**
     * hset
     * @param key
     * @param hashKey
     * @param value
     * @returns {Promise}
     */
    MyRedis.prototype.hset = function (key, hashKey, value) {
        return sendCommand('hset', arguments);
    };


    /**
     * hget
     * @param key
     * @param hashKey
     * @returns {Promise}
     */
    MyRedis.prototype.hget = function (key, hashKey) {
        return sendCommand('hget', arguments);
    };


    /**
     * hkeys
     * @param key
     * @returns {Promise}
     */
    MyRedis.prototype.hkeys = function (key) {
        return sendCommand('hkeys', arguments);
    };


    /**
     * hvals
     * @param key
     * @returns {Promise}
     */
    MyRedis.prototype.hvals = function (key) {
        return sendCommand('hvals', arguments);
    };


    /**
     * hdel
     * @param key
     * @param hashKey
     * @returns {Promise}
     */
    MyRedis.prototype.hdel = function (key, hashKey) {
        return sendCommand('hdel', arguments);
    };


    /**
     * hincrby
     * @param key
     * @param hashKey
     * @param value
     * @returns {Promise}
     */
    MyRedis.prototype.hincrby = function (key, hashKey, value) {
        return sendCommand('hincrby', arguments);
    };

    return MyRedis;
}());