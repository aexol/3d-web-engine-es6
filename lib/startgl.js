'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _aexolgl = require('./aexolgl');

var _scene = require('./scene');

var _aex = require('./aex');

var _gameobject = require('./gameobject');

var _texture = require('./texture');

var _camera = require('./camera');

var _material = require('./material');

var _basic_shaders = require('./basic_shaders');

var _mesh = require('./mesh');

var _light = require('./light');

var _vector = require('./vector');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StartGL = function () {
    function StartGL() {
        _classCallCheck(this, StartGL);
    }

    _createClass(StartGL, [{
        key: 'setup',
        value: function setup() {}
    }, {
        key: 'logic',
        value: function logic() {}
    }, {
        key: 'draw',
        value: function draw() {}
    }, {
        key: 'run',
        value: function run() {
            this.app = new _aexolgl.AexolGL({
                setup: this.setup,
                logic: this.logic,
                draw: this.draw
            });
        }
    }]);

    return StartGL;
}();

exports.default = StartGL;