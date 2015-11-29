"use strict";


function Command(dbEngine, type, key, value) {
    this.execute = function() {
        return dbEngine[type].call(null, key, value);
    };
}


module.exports = Command;