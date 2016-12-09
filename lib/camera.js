"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Camera = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vector = require("./vector");

var _matrix = require("./matrix");

var _aex = require("./aex");

var _gl = require("./gl");

var _gl2 = _interopRequireDefault(_gl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
/**
 * @module camera
 */


/**
  * Camera class
  * @class Camera
	* @extends Aex
  * @constructor
  * @param {float} [near] near Plane
  * @param {float} [far] far Plane
  * @param {float} [angle] angle of perspective camera
  * @example
  *     world = new Scene()
  *     camera = new Camera()
  *     camera.position = new Vector(0.1, -1, -10);
*/
var Camera = exports.Camera = function (_Aex) {
    _inherits(Camera, _Aex);

    _createClass(Camera, [{
        key: "projectionMatrix",
        set: function set(val) {
            this.parentMatrix = val;
        },
        get: function get() {
            return this.parentMatrix;
        }
    }]);

    function Camera(near, far, angle) {
        _classCallCheck(this, Camera);

        var _this = _possibleConstructorReturn(this, (Camera.__proto__ || Object.getPrototypeOf(Camera)).call(this));

        _this.modelView = new _matrix.Matrix();
        _this._size = new _vector.Vector(1.0, 1.0, 1.0);
        _this._rotation = new _vector.Vector(0.0, 0.0, 0.0);
        _this._position = new _vector.Vector(0.0, 0.0, 0.0);
        _this.cameraDefaultMouseController = false;
        _this.near = near || 0.1;
        _this.far = far || 100.0;
        _this.angle = angle || 45.0;
        _this.setPerspective();
        _this.setDisplay();
        _this.uniforms = {
            _gl_ProjectionMatrix: _this.projectionMatrix,
            cameraNear: _this.near,
            cameraFar: _this.far
        };
        return _this;
    }

    _createClass(Camera, [{
        key: "setModelView",
        value: function setModelView() {
            var m = this.parentMatrix;
            m = m.multiply(_matrix.Matrix.scale(this.size.x, this.size.y, this.size.z));
            m = m.multiply(_matrix.Matrix.rotate(this.rotation.x, 1, 0, 0));
            m = m.multiply(_matrix.Matrix.rotate(this.rotation.y, 0, 1, 0));
            m = m.multiply(_matrix.Matrix.rotate(this.rotation.z, 0, 0, 1));
            m = m.multiply(_matrix.Matrix.translate(-this.position.x, -this.position.y, -this.position.z));
            this.modelView = m;
            this.NormalMatrix = this.modelView.toInverseMat3();
        }

        /**
        * set orthographic projection for camera
        * @method setOrthoPerspective
        */

    }, {
        key: "setOrthoPerspective",
        value: function setOrthoPerspective() {
            this.projectionMatrix = _matrix.Matrix.orthoPerspective(this.angle, _gl2.default.canvas.width / _gl2.default.canvas.height, this.near, this.far);
        }

        /**
        * set perspective projection for camera
        * @method setPerspective
        */

    }, {
        key: "setPerspective",
        value: function setPerspective() {
            this.projectionMatrix = _matrix.Matrix.perspective(this.angle, _gl2.default.canvas.width / _gl2.default.canvas.height, this.near, this.far);
        }
    }, {
        key: "setToMatrix",
        value: function setToMatrix(m) {
            this.projectionMatrix = m;
        }

        /**
        * put the camera at the eye point looking `e`
        * toward the center point `c`  with an up direction of `u`.
        * @method lookAt
        * @param {Vector} e Eye point
        * @param {Vector} c Center point
        * @param {Vector} u Up vector
        * @return {Matrix} Result matrix
        */

    }, {
        key: "setLookAt",
        value: function setLookAt(e, c, u) {
            this.projectionMatrix = this.projectionMatrix.multiply(_matrix.Matrix.lookAt(e, c, u));
            this.setModelView();
        }
    }, {
        key: "transforms",
        value: function transforms() {
            if (this.cameraDefaultMouseController == true) {
                this.onTransforms();
            }
            var m = this.modelView;
            this.uniforms._gl_ProjectionMatrix = m.m;
            _gl2.default.frustum.fromPerspectiveMatrix(m);
        }

        // BACKWARD COMPATIBILITY

        /**
        * Set table with screen dimensions and coordinates for 2D games
        * @method setDisplay
        */

    }, {
        key: "setDisplay",
        value: function setDisplay() {
            var display = [];
            display.height = Math.abs(2 * this.position.z * Math.tan(_gl2.default.angle * (Math.PI / 180) / 2));
            display.width = Math.abs(display.height * (_gl2.default.canvas.width / _gl2.default.canvas.height));
            display.left = -display.width / 2 - this.position.x;
            display.right = display.width / 2 - this.position.x;
            display.top = display.height / 2 - this.position.y;
            display.bottom = -display.height / 2 - this.position.y;
            display.centerX = display.left + display.width / 2;
            display.centerY = display.top - display.height / 2;
            this.display = display;
        }

        /**
        * Set camera position
        * @method setCameraPosition
        */

    }, {
        key: "setCameraPosition",
        value: function setCameraPosition(vec) {
            this.position = vec;
            this.setDisplay();
        }
    }, {
        key: "onTransforms",
        value: function onTransforms() {
            this.positionBefore = this.position;
            this.yaw(this.yawStep);
            this.pitch(this.pitchStep);
            this.forward(this.forwardStep);
            this.forwardStep *= this.forwardReduce;
            this.side(this.sideStep);
            this.updown(this.upStep);
            this.yawStep *= 0.78;
            this.pitchStep *= 0.78;
            this.setModelView();
        }
    }, {
        key: "forward",
        value: function forward(f) {
            if (f == 0.0) {
                return true;
            }
            var fac = -f;
            var yRad = this.rotY * (Math.PI / 180.0);
            var xRad = this.rotX * (Math.PI / 180.0);
            var yChange = fac * Math.sin(xRad);
            var zChange = fac * Math.cos(yRad);
            var xChange = -fac * Math.sin(yRad);
            this.position.y += yChange;
            this.position.z += zChange;
            this.position.x += xChange;
        }

        /**
        * DEPRECATED use setters instead
        * Move camera left & right
        * @method side
        * @param {float} f distance to move
        */

    }, {
        key: "side",
        value: function side(f) {
            if (f == 0.0) {
                return true;
            }
            var fac = -f;
            var yRad = this.rotation.y * (Math.PI / 180.0);
            var zChange = fac * Math.sin(yRad);
            var xChange = fac * Math.cos(yRad);
            this.position.z += zChange;
            this.position.x += xChange;
        }

        /**
        * DEPRECATED use setters instead
        * Move camera up & down
        * @method updown
        * @param {float} f distance to move
        */

    }, {
        key: "updown",
        value: function updown(f) {
            if (f == 0.0) {
                return true;
            }
            var fac = f;
            this.position.y += fac;
        }

        /**
        * DEPRECATED use setters instead
        * Rotate on local x axis
        * @method pitch
        * @param {float} change rotation
        */

    }, {
        key: "pitch",
        value: function pitch(change) {
            this.rotation.x += this.sensitivity * change;
        }

        /**
        * DEPRECATED use setters instead
        * Rotate on local y axis
        * @method pitch
        * @param {float} change rotation
        */

    }, {
        key: "yaw",
        value: function yaw(change) {
            this.rotation.y += this.sensitivity * change;
        }

        /**
        * DEPRECATED use setters instead
        * Rotate on local z axis
        * @method roll
        * @param {float} change rotation
        */

    }, {
        key: "roll",
        value: function roll(change) {
            this.rotation.z += this.sensitivity * change;
        }

        /**
        * DEPRECATED use setters instead
        * Turn on standard camera mouse and WSAD operating
        * @method on
        * @param {float} factor sensitivity of camera
        */

    }, {
        key: "on",
        value: function on() {
            var factor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.1;
            var sensitivity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.3;

            this.cameraDefaultMouseController = true;
            this.forwardStep = 0.0;
            this.sideStep = 0.0;
            this.upStep = 0.0;
            this.forwardReduce = 1.0;
            this.yawStep = 0.0;
            this.pitchStep = 0.0;
            this.sensitivity = sensitivity;
            this.tempX = null;
            this.tempY = null;
            this.md = 0;
            this.factor = factor;
            var t = this;
            document.onkeydown = function (e) {
                var ev = e || window.event;
                if (ev.keyCode == 87) {
                    t.forwardStep = t.factor;
                    t.forwardReduce = 1.0;
                }
                if (ev.keyCode == 83) {
                    t.forwardStep = -t.factor;
                    t.forwardReduce = 1.0;
                }
                if (ev.keyCode == 68) {
                    t.sideStep = -t.factor;
                }
                if (ev.keyCode == 65) {
                    t.sideStep = t.factor;
                }
                if (ev.keyCode == 81) {
                    t.upStep = t.factor;
                }
                if (ev.keyCode == 69) {
                    t.upStep = -t.factor;
                }
            };
            document.onkeyup = function (e) {
                var ev = e || window.event;
                if (ev.keyCode == 87) {
                    t.forwardReduce = 0.78;
                }
                if (ev.keyCode == 83) {
                    t.forwardReduce = 0.78;
                }
                if (ev.keyCode == 68) {
                    t.sideStep = 0.0;
                }
                if (ev.keyCode == 65) {
                    t.sideStep = 0.0;
                }
                if (ev.keyCode == 81) {
                    t.upStep = 0.0;
                }
                if (ev.keyCode == 69) {
                    t.upStep = 0.0;
                }
            };
            var mouseDown = function mouseDown(e) {
                var x = e.clientX ? e.clientX : e.x;
                var y = e.clientY ? e.clientY : e.y;
                t.tempX = x;
                t.tempY = y;
                t.mD = e.button + 1;
            };
            var mouseMove = function mouseMove(ev) {
                if (t.eC == 0 || t.eC != 0 && t.mD != 0) {
                    if (t.tempX == null && t.tempY == null) {
                        t.tempX = ev.clientX;
                        t.tempY = ev.clientY;
                    }
                    var curX = ev.clientX;
                    var curY = ev.clientY;
                    var deltaX = (t.tempX - curX) * t.sensitivity;
                    var deltaY = (t.tempY - curY) * t.sensitivity;
                    t.tempX = curX;
                    t.tempY = curY;
                    if (t.mD == 1) {
                        t.yawStep = -deltaX;
                        t.pitchStep = -deltaY;
                    } else if (t.mD == 2) {
                        t.side(deltaX * 0.05);
                        t.updown(deltaY * 0.05);
                    }
                }
            };
            var mouseUp = function mouseUp(e) {
                t.mD = 0;
            };
            _gl2.default.canvas.addEventListener('mousedown', mouseDown, false);
            _gl2.default.canvas.addEventListener('mousemove', mouseMove, false);
            _gl2.default.canvas.addEventListener('mouseup', mouseUp, false);
        }
    }]);

    return Camera;
}(_aex.Aex);