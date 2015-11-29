"use strict";


function Command(dbEngine, type, key, value) {
    this.execute = function() {
        dbEngine[type].call(null, key, value);
    };
}


module.exports = Command;