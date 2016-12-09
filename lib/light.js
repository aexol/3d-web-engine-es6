'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Light = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vector = require('./vector');

var _mobject = require('./mobject');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                @module Light
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 @class Light
 @extends MObject
 @constructor
 @param tableOptions {Dict} light options
 @example
 light = new Light({
		lightPosition: new Vector(1.3,4.0,-2.0),
		attenuation: 40.0,
		intensity: 1.33,
		lightType:1.0,
		color: [0.8,1.0,1.0]
	})
 Example 2:
 @example
 light = new Light([
 {
     lightPosition: new Vector(1.3,4.0,-2.0),
     attenuation: 400.0,
     intensity: 1.2,
     color: [0.8,1.0,1.0]
 },
 {
     lightPosition: new Vector(0.1,2.0,3.0),
     attenuation: 100.0,
     intensity: .33,
     color: [0.8,0.2,1.0]
 },
 {
     lightPosition: new Vector(-1.3,4.0,-2.0),
     attenuation: 140.0,
     intensity: 1.33,
     color: [0.8,1.0,1.0]
 }
 ])
  Example 3 creating ambient light:
 @example
 light = new Light([
 {
     intensity: 1.2,
     lightType:2.0,
     color: [0.8,1.0,1.0]
 },
 ])
 */
var Light = exports.Light = function (_MObject) {
    _inherits(Light, _MObject);

    function Light(tableOptions) {
        _classCallCheck(this, Light);

        var _this = _possibleConstructorReturn(this, (Light.__proto__ || Object.getPrototypeOf(Light)).call(this));

        _this.lights = [];
        _this.shadows = new Array(32);
        _this.ssse = 0;
        if (tableOptions instanceof Array) {
            for (var l in tableOptions) {
                var tabs = {};
                var options = tableOptions[l];
                tabs.lightPosition = new _vector.Vector();
                tabs.attenuation = 20.0;
                tabs.intensity = 1.0;
                tabs.color = [1.0, 1.0, 0.9];
                tabs.shadow = false;
                tabs.lightType = 1;
                if (options) {
                    for (var o in options) {
                        tabs[o] = options[o];
                    }
                }
                _this.lights.push(tabs);
            }
        } else {
            var tabs = {};
            tabs.lightPosition = new _vector.Vector(0, 1, -10);
            tabs.attenuation = 20.0;
            tabs.intensity = 1.0;
            tabs.color = [1.0, 1.0, 0.0];
            tabs.shadow = false;
            tabs.lightType = 1;
            if (tableOptions) {
                for (var o in tableOptions) {
                    tabs[o] = tableOptions[o];
                }
            }
            _this.lights.push(tabs);
        }
        return _this;
    }

    _createClass(Light, [{
        key: 'draw',
        value: function draw(uniforms) {
            var dic = uniforms || {};
            this.bindAll(dic);
            dic["lights"] = this.lights;
            dic["numlights"] = this.lights.length;
            for (var child in this.children) {
                this.children[child].draw(dic);
            }
            this.unbindAll();
        }
    }, {
        key: 'bindAll',
        value: function bindAll(dic) {
            if (this.shadows.complete == 12) {
                this.shadows.bindCube();
                dic["shadows"] = this.shadows.binder;
            }
        }
    }, {
        key: 'unbindAll',
        value: function unbindAll() {
            if (this.shadows.complete == 12) {
                this.shadows.unbindCube();
            }
        }

        /**
         * sets shadow for light system( 1 shadowmap per system allowed now )
         * @method set Shadow
         * @param {Shadow} shadow
         */

    }, {
        key: 'setShadow',
        value: function setShadow(shadow) {
            this.shadows = shadow.map.texture;
        }

        /**
         @method fGI
         @static
         Creates fake global Illumination system
         @param sun {Boolean} if true sun will be drawn
         */

    }], [{
        key: 'fGI',
        value: function fGI(options, sun) {
            var lightTable = [];
            var radius = 10;
            for (var k = 1; k < 3; k++) {
                for (var i = 1; i < 6; i++) {
                    var angle = i / 6 * 6.28;
                    var lig = {
                        lightPosition: new _vector.Vector(Math.sin(angle) * radius, k * 3, Math.cos(angle) * radius).toArray(),
                        intensity: .3,
                        color: [0.7, 0.7, 0.9],
                        attenuation: 23.8
                    };
                    lightTable.push(lig);
                }
            }
            if (sun) {
                var lig = {
                    lightPosition: new _vector.Vector(100, 20, 100).toArray(),
                    intensity: .76,
                    color: [1.0, 0.7, 0.2],
                    attenuation: 1005.8
                };
                lightTable.push(lig);
            }
            return new Light(lightTable);
        }
    }, {
        key: 'minifGI',
        value: function minifGI(radius, size, intensity, position) {
            var lightTable = [];
            for (var k = 1; k < 2; k++) {
                for (var i = 1; i < 3; i++) {
                    var angle = i / 3 * 6.28;
                    var lig = {
                        lightPosition: new _vector.Vector(Math.sin(angle) * radius, k * 3, Math.cos(angle) * radius).toArray(),
                        intensity: intensity,
                        color: [0.7, 0.7, 0.9],
                        attenuation: size
                    };
                    lightTable.push(lig);
                }
            }
            if (position) {
                for (var l in lightTable) {
                    var lig = lightTable[l];
                    lig.lightPosition = _vector.Vector.fromArray(lig.lightPosition).add(position).toArray();
                }
            }
            return new Light(lightTable);
        }
    }]);

    return Light;
}(_mobject.MObject);