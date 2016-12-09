'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Buffer = exports.Indexer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _gl = require('./gl');

var _gl2 = _interopRequireDefault(_gl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @module Buffer
 */
/**
  * Indexer class (internal)
  * @class Indexer
  * @constructor
*/
var Indexer = exports.Indexer = function () {
    function Indexer() {
        _classCallCheck(this, Indexer);

        this.unique = [];
        this.indices = [];
        this.map = {};
    }

    /** 
    * add
    * @method add
    * @param {obj} obj
    */


    _createClass(Indexer, [{
        key: 'add',
        value: function add(obj) {
            var key = JSON.stringify(obj);
            if (!(key in this.map)) {
                this.map[key] = this.unique.length;
                this.unique.push(obj);
            }
            return this.map[key];
        }
    }]);

    return Indexer;
}();

/**
  * Buffer class (internal)
  * @class Buffer
  * @constructor
*/


var Buffer = exports.Buffer = function () {
    function Buffer(target, type) {
        _classCallCheck(this, Buffer);

        this.buffer = null;
        this.target = target;
        this.type = type;
        this.data = [];
    }

    /** 
    * compile
    * @method compile
    * @param {type} type Type of data 
    */


    _createClass(Buffer, [{
        key: 'compile',
        value: function compile(type) {
            var data = new Array();
            for (var i = 0, chunk = 10000; i < this.data.length; i += chunk) {
                data = Array.prototype.concat.apply(data, this.data.slice(i, i + chunk));
            }
            var spacing = this.data.length ? data.length / this.data.length : 0;
            if (spacing != Math.round(spacing)) throw 'buffer elements not of consistent size, average size is ' + spacing;
            this.buffer = this.buffer || _gl2.default.createBuffer();
            this.buffer.length = data.length;
            this.buffer.spacing = data.length / this.data.length;
            _gl2.default.bindBuffer(this.target, this.buffer);
            _gl2.default.bufferData(this.target, new this.type(data), type || _gl2.default.STATIC_DRAW);
        }
    }]);

    return Buffer;
}();