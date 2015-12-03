"use strict";

var _ = require('lodash');


/**
 * CommandManager
 * Responsible for creating and executing Commands
 * @constructor
 */
function PubSubManager() {

    var COMMANDS = ['publish', 'subscribe', 'unsubscribe'];

    var connections = {};


    this.addConnection = function (connection) {
        // ...
    };

    this.removeConnection = function (connection) {
        // ...
    };


}


module.exports = new PubSubManager();