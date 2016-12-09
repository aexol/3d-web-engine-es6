"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
  * Vector class
  * @class Vector
  * @constructor
  * @param {float} x X position
  * @param {float} y Y position
  * @param {float} z Z position
*/
var Vector = exports.Vector = function () {
    function Vector(x, y, z) {
        _classCallCheck(this, Vector);

        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }

    /**
    * Returns the opposite vector
    * @method negative
    * @return {Vector} opposite Vector
    */


    _createClass(Vector, [{
        key: "negative",
        value: function negative() {
            return new Vector(-this.x, -this.y, -this.z);
        }

        /**
        * Add vector
        * @method add
        * @param {Vector} v Vector to add
        * @return {Vector} sum of two vectors
        */

    }, {
        key: "add",
        value: function add(v) {
            var b = v instanceof Vector;
            return new Vector(this.x + (b ? v.x : v), this.y + (b ? v.y : v), this.z + (b ? v.z : v));
        }

        /**
        * Subtract vector
        * @method subtract
        * @param {Vector} v Vector to subtract
        * @return {Vector} difference of two vectors
        */

    }, {
        key: "subtract",
        value: function subtract(v) {
            var b = v instanceof Vector;
            return new Vector(this.x - (b ? v.x : v), this.y - (b ? v.y : v), this.z - (b ? v.z : v));
        }

        /**
        * Multiply vector
        * @method multiply
        * @param {Vector} v Vector to multiply
        * @return {Vector} product of two vectors
        */

    }, {
        key: "multiply",
        value: function multiply(v) {
            var b = v instanceof Vector;
            return new Vector(this.x * (b ? v.x : v), this.y * (b ? v.y : v), this.z * (b ? v.z : v));
        }

        /**
        * Divide vector
        * @method divide
        * @param {Vector} v Vector to divide
        * @return {Vector} quotient of two vectors
        */

    }, {
        key: "divide",
        value: function divide(v) {
            var b = v instanceof Vector;
            return new Vector(this.x / (b ? v.x : v), this.y / (b ? v.y : v), this.z / (b ? v.z : v));
        }

        /**
        * Dot product
        * @method dot
        * @param {Vector} v Vector
        * @return {Vector} Dot product of two vectors
        */

    }, {
        key: "dot",
        value: function dot(v) {
            return this.x * v.x + this.y * v.y + this.z * v.z;
        }

        /**
        * Cross product
        * @method cross
        * @param {Vector} v Vector to cross
        * @return {Vector} Cross product of two vectors
        */

    }, {
        key: "cross",
        value: function cross(v) {
            return new Vector(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x);
        }

        /**
        * Returns the length of vector
        * @method length
        * @return {float} legth of vector
        */

    }, {
        key: "length",
        value: function length() {
            return Math.sqrt(this.dot(this));
        }

        /**
        * Returns the unit
        * @method unit
        * @return {Vector} Vector divided by its length
        */

    }, {
        key: "unit",
        value: function unit() {
            return this.divide(this.length());
        }

        /**
        * Returns the minimum value of vector axes
        * @method min
        * @return {float} min value of (x,y,z)
        */

    }, {
        key: "min",
        value: function min() {
            return Math.min(Math.min(this.x, this.y), this.z);
        }

        /**
        * Returns the minimum value of vector axes
        * @method min
        * @return {float} min value of (x,y,z)
        */

    }, {
        key: "absmin",
        value: function absmin() {
            return Math.min(Math.min(Math.abs(this.x), Math.abs(this.y)), Math.abs(this.z));
        }

        /**
        * Returns the maximum value of vector axes
        * @method max
        * @return {float} max value of (x,y,z)
        */

    }, {
        key: "max",
        value: function max() {
            return Math.max(Math.max(this.x, this.y), this.z);
        }

        /**
        * Returns the maximum value of vector absolute axes
        * @method max
        * @return {float} max value of (abs(x),abs(y),abs(z))
        */

    }, {
        key: "absmax",
        value: function absmax() {
            return Math.max(Math.max(Math.abs(this.x), Math.abs(this.y)), Math.abs(this.z));
        }

        /**
        * Returns the normalized vector
        * @method normalize
        * @return {Vector} Vector normalized
        */

    }, {
        key: "normalize",
        value: function normalize() {
            return this.divide(this.absmax());
        }
    }, {
        key: "randomize",
        value: function randomize() {
            return new Vector(this.x * Math.random(), this.y * Math.random(), this.z * Math.random());
        }
    }, {
        key: "toAngles",
        value: function toAngles() {
            return {
                theta: Math.atan2(this.z, this.x),
                phi: Math.asin(this.y / this.length())
            };
        }

        /**
        * Returns the array of axes
        * @method toArray
        * @return {array[3]} Array [x,y,z]
        */

    }, {
        key: "toArray",
        value: function toArray(n) {
            return [this.x, this.y, this.z].slice(0, n || 3);
        }
    }, {
        key: "isZero",
        value: function isZero() {
            return this.x == 0.0 && this.y == 0.0 && this.z == 0.0;
        }
    }, {
        key: "copy",
        value: function copy(v) {
            return new Vector(this.x, this.y, this.z);
        }
    }], [{
        key: "copy",
        value: function copy(v) {
            return new Vector(v.x, v.y, v.z);
        }

        /**
         * Gives distance between two Vector objects
         * @param {Vector} v
         * @param {Vector} v2
         * @returns {float|*}
         */

    }, {
        key: "distance",
        value: function distance(v, v2) {
            if (v instanceof Vector && v2 instanceof Vector) {} else {
                var v = new Vector(v[0], v[1], v[2]);
                var v2 = new Vector(v2[0], v2[1], v2[2]);
            }
            return v2.subtract(v).length();
        }
    }, {
        key: "distanceXZ",
        value: function distanceXZ(v, v2) {
            if (v instanceof Vector && v2 instanceof Vector) {} else {
                var v = new Vector(v[0], 0.0, v[2]);
                var v2 = new Vector(v2[0], 0.0, v2[2]);
            }
            return v2.subtract(v).length();
        }
    }, {
        key: "distanceXY",
        value: function distanceXY(v, v2) {
            if (v instanceof Vector && v2 instanceof Vector) {} else {
                var v = new Vector(v[0], v[1], 0.0);
                var v2 = new Vector(v2[0], v2[1], 0.0);
            }
            return v2.subtract(v).length();
        }
    }, {
        key: "distanceYZ",
        value: function distanceYZ(v, v2) {
            if (v instanceof Vector && v2 instanceof Vector) {} else {
                var v = new Vector(0.0, v[1], v[2]);
                var v2 = new Vector(0.0, v2[1], v2[2]);
            }
            return v2.subtract(v).length();
        }

        // ### Static Methods
        // `Vector.random()` returns a vector with a length of 1 and a statistically
        // uniform direction. `Vector.lerp()` performs linear interpolation between
        // two vectors.

    }, {
        key: "fromAngles",
        value: function fromAngles(theta, phi) {
            return new Vector(Math.cos(theta) * Math.cos(phi), Math.sin(phi), Math.sin(theta) * Math.cos(phi));
        }
    }, {
        key: "random",
        value: function random() {
            return Vector.fromAngles(Math.random() * Math.PI * 2, Math.asin(Math.random() * 2 - 1));
        }
    }, {
        key: "min",
        value: function min(a, b) {
            return new Vector(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.min(a.z, b.z));
        }
    }, {
        key: "max",
        value: function max(a, b) {
            return new Vector(Math.max(a.x, b.x), Math.max(a.y, b.y), Math.max(a.z, b.z));
        }
    }, {
        key: "lerp",
        value: function lerp(a, b, fraction) {
            return a.add(b.subtract(a).multiply(fraction));
        }
    }, {
        key: "fromArray",
        value: function fromArray(a) {
            return new Vector(a[0], a[1], a[2]);
        }
    }]);

    return Vector;
}();

/**
  * Vector4 class
  * @class Vector4
  * @constructor
  * @param {float} x X position
  * @param {float} y Y position
  * @param {float} z Z position
  * @param {float} w W position
*/


var Vector4 = exports.Vector4 = function () {
    function Vector4(x, y, z, w) {
        _classCallCheck(this, Vector4);

        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
        this.w = w || 1;
    }

    /**
    * Dot product
    * @method dot
    * @param {Vector4} v Vector4
    * @return {Vector4} Dot product of two vectors
    */


    _createClass(Vector4, [{
        key: "dot",
        value: function dot(v) {
            return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
        }
        /* End of Vector */

    }]);

    return Vector4;
}();