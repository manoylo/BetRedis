/**
 * Animal
 * @param name
 * @constructor
 */
function Animal(name) {
    this.name = name.toUpperCase();
}

/**
 * say
 */
Animal.prototype.say = function() {
    console.log("I am an animal. My name is " + this.name);
};


/**
 * Cat
 * @param name
 * @constructor
 */
function Cat(name) {
    Animal.call(this, name);
}

// setting inheritance Cat -> Animal
Cat.prototype = Object.create(Animal.prototype);

/**
 * say
 */
Cat.prototype.say = function() {
    Animal.prototype.say.call(this);
    console.log("I am a cat. My name is " + this.name);
};


/**
 * BlackCat
 * @param name
 * @constructor
 */
function BlackCat(name) {
    Cat.call(this, name);
}

// setting inheritance Cat -> Animal
BlackCat.prototype = Object.create(Cat.prototype);

/**
 * say
 */
BlackCat.prototype.say = function() {
    Cat.prototype.say.call(this);
    console.log("I am a black cat. My name is " + this.name);
};


/**
 * main
 */

var murchik = new BlackCat("murchik");
murchik.say();