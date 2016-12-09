'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Aex = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mobject = require('./mobject');

var _vector = require('./vector');

var _matrix = require('./matrix');

var _gl = require('./gl');

var _gl2 = _interopRequireDefault(_gl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Aex class - Aex objects hold the modelView `Matrix`
 * @class Aex
 * @extends MObject
 * @constructor
 * @param [options={}] {Dict} Dictionary of options when creating Aex object
 * @return {Aex} Returns Aex Object
 * @example
 *      var aex = new Aex({
 *          uniforms:{
 *              tiling:[2.0,2.0]
 *          }
 *      })
 */
var Aex = exports.Aex = function (_MObject) {
    _inherits(Aex, _MObject);

    _createClass(Aex, [{
        key: 'aabb',
        get: function get() {
            var ab = this.parent.aabb;
            var abb = {
                min: ab.min.multiply(this.size).add(this.position),
                max: ab.max.multiply(this.size).add(this.position)
            };
            return abb;
        }
    }, {
        key: 'sphere',
        get: function get() {
            var sphere = this.parent.sphere;
            var sp = {
                radius: sphere.radius * this.size.max(),
                center: sphere.center.add(this.position)
            };
            return sp;
        }
        /**
         * Position of object
         * @property position
         * @type Vector
         * @example
         *     world = new Scene()
         *     game = new Aex()
         *     game.position = new Vector(1.0,2.0,3.0)
         */

    }, {
        key: 'position',
        set: function set(val) {
            this._position = val;
        },
        get: function get() {
            return this._position;
        }
        /**
         * x Position of object
         * @property x
         * @type Float
         * @example
         *     world = new Scene()
         *     game = new Aex()
         *     game.x = 20.0
         */

    }, {
        key: 'x',
        set: function set(val) {
            this._position.x = val;
            this.setModelView();
        }
        /**
         * y Position of object
         * @property y
         * @type Float
         * @example
         *     world = new Scene()
         *     game = new Aex()
         *     game.y = 20.0
         */
        ,
        get: function get() {
            return this._position.x;
        }
    }, {
        key: 'y',
        set: function set(val) {
            this._position.y = val;
            this.setModelView();
        }
        /**
         * z Position of object
         * @property z
         * @type Float
         * @example
         *     world = new Scene()
         *     game = new Aex()
         *     game.z = 20.0
         */
        ,
        get: function get() {
            return this._position.y;
        }
    }, {
        key: 'z',
        set: function set(val) {
            this._position.z = val;
            this.setModelView();
        },
        get: function get() {
            return this._position.z;
        }
        /**
         * Rotation of object
         * @property rotation
         * @type Vector
         * @example
         *     world = new Scene()
         *     game = new Aex()
         *     game.rotation = new Vector(0.0,90.0,0.0)
         */

    }, {
        key: 'rotation',
        set: function set(val) {
            this._rotation = val;
        },
        get: function get() {
            return this._rotation;
        }

        /**
         * x Rotation of object
         * @property rotX
         * @type Float
         * @example
         *     world = new Scene()
         *     game = new Aex()
         *     game.rotX = 20.0
         */

    }, {
        key: 'rotX',
        set: function set(val) {
            this._rotation.x = val;
            this.setModelView();
        }
        /**
         * y Rotation of object
         * @property rotY
         * @type Float
         * @example
         *     world = new Scene()
         *     game = new Aex()
         *     game.rotY = 20.0
         */
        ,
        get: function get() {
            return this._rotation.x;
        }
    }, {
        key: 'rotY',
        set: function set(val) {
            this._rotation.y = val;
            this.setModelView();
        }
        /**
         * z Rotation of object
         * @property rotZ
         * @type Float
         * @example
         *     world = new Scene()
         *     game = new Aex()
         *     game.rotZ = 20.0
         */
        ,
        get: function get() {
            return this._rotation.y;
        }
    }, {
        key: 'rotZ',
        set: function set(val) {
            this._rotation.z = val;
            this.setModelView();
        },
        get: function get() {
            return this._rotation.z;
        }
    }, {
        key: 'size',
        set: function set(val) {
            this._size = val;
        },
        get: function get() {
            return this._size;
        }
        /**
         * x scale of object
         * @property scaleX
         * @type Float
         * @example
         *     world = new Scene()
         *     game = new Aex()
         *     game.scaleX = 2.0
         */

    }, {
        key: 'scaleX',
        set: function set(val) {
            this._size.x = val;
            this.setModelView();
        }
        /**
         * y scale of object
         * @property scaleY
         * @type Float
         * @example
         *     world = new Scene()
         *     game = new Aex()
         *     game.scaleY = 2.0
         */
        ,
        get: function get() {
            return this._size.x;
        }
    }, {
        key: 'scaleY',
        set: function set(val) {
            this._size.y = val;
            this.setModelView();
        }
        /**
         * z scale of object
         * @property scaleZ
         * @type Float
         * @example
         *     world = new Scene()
         *     game = new Aex()
         *     game.scaleZ = 2.0
         */
        ,
        get: function get() {
            return this._size.y;
        }
    }, {
        key: 'scaleZ',
        set: function set(val) {
            this._size.z = val;
            this.setModelView();
        },
        get: function get() {
            return this._size.z;
        }
    }]);

    function Aex(options) {
        _classCallCheck(this, Aex);

        var _this = _possibleConstructorReturn(this, (Aex.__proto__ || Object.getPrototypeOf(Aex)).call(this));

        _this.hidden = false;

        _this.texture = null;
        _this.wireframe = 0;
        _this.modelView = new _matrix.Matrix();
        _this._size = new _vector.Vector(1.0, 1.0, 1.0);
        _this._rotation = new _vector.Vector(0.0, 0.0, 0.0);
        _this._position = new _vector.Vector(0.0, 0.0, 0.0);
        _this.parentMatrix = new _matrix.Matrix();
        _this.uniforms = { tiling: [1.0, 1.0], material: {} };
        _this.aTextures = {};
        _this.uniformsDone = 0;
        for (var i in options) {
            var o = options[i];
            _this[i] = o;
        }
        return _this;
    }

    _createClass(Aex, [{
        key: 'getAABB',
        value: function getAABB() {
            return this.parent.getAABB();
        }

        /**
         * Force set shader uniforms
         * @method setUniforms
         * @example
         *      var aex = new Aex()
         *      aex.setUniforms()
         */

    }, {
        key: 'setUniforms',
        value: function setUniforms() {
            this.uniforms._gl_ModelViewMatrix = this.modelView.m;
            this.uniforms.NormalMatrix = this.NormalMatrix.m;
            _gl2.default.currentShader.uniforms(this.uniforms);
        }

        /**
         * Centers pivot of an Aex to parent Mesh
         * @method centerPivot
         */

    }, {
        key: 'centerPivot',
        value: function centerPivot() {
            if (this.parent) {
                var cc = this.parent.getCenter();
                var ccN = cc.negative();
                this.parent.move(ccN.x, ccN.y, ccN.z);
                this.move(cc.x, cc.y, cc.z);
            }
            return this;
        }

        /**
         * Move object
         * @method move
         * @param x - x axis
         * @param y - y axis
         * @param z - z axis
         * @param r - relative transform
         * @example
         *      var aex = new Aex()
         *      aex.move(0,1,2)
         */

    }, {
        key: 'move',
        value: function move(x, y, z, r) {
            if (r) {
                this.position = this.position.add(new _vector.Vector(x, y, z));
            } else {
                this.position = new _vector.Vector(x, y, z);
            }
            this.setModelView();
        }

        /**
         * Rotate object
         * @method rotate
         * @param x - angle around x axis
         * @param y - angle around y axis
         * @param z - angle around z axis
         * @param r - relative transform
         * @example
         *      var aex = new Aex()
         *      aex.rotate(0,1,2)
         */

    }, {
        key: 'rotate',
        value: function rotate(x, y, z, r) {
            if (r) {
                this.rotation = this.rotation.add(new _vector.Vector(x, y, z));
            } else {
                this.rotation = new _vector.Vector(x, y, z);
            }
            this.setModelView();
        }

        /**
         * Scale object
         * @method scale
         * @param x - x axis
         * @param y - y axis
         * @param z - z axis
         * @param r - relative transform
         * @example
         *      var aex = new Aex()
         *      aex.scale(0,1,2)
         */

    }, {
        key: 'scale',
        value: function scale(x, y, z, r) {
            if (r) {
                this.size = this.size.add(new _vector.Vector(x, y, z));
            } else {
                this.size = new _vector.Vector(x, y, z);
            }
            this.setModelView();
        }

        /**
         * Rotate object around point
         * @method rotateAroundPoint
         * @param {Vector} center pivot point location
         * @param angle - rotation in degrees
         * @param x - usage of x axis
         * @param y -  usage of y axis
         * @param z -  usage of z axis
         * @example
         *      var aex = new Aex()
         *      aex.rotateAroundPoint(new Vector(0,1,1),90,0,1,0)
         */

    }, {
        key: 'rotateAroundPoint',
        value: function rotateAroundPoint(center, x, y, z) {
            var vNewPosition = new _vector.Vector();
            var angle = Math.max(Math.abs(x), Math.abs(y), Math.abs(z));

            var xx = x / angle;
            var yy = y / angle;
            var zz = z / angle;
            var vPos = this.position.subtract(center);
            // Calculate the sine and cosine of the angle once
            var cosTheta = Math.cos(angle * Math.degToRad);
            var sinTheta = Math.sin(angle * Math.degToRad);

            // Find the new x position for the new rotated point
            vNewPosition.x = (cosTheta + (1 - cosTheta) * xx * xx) * vPos.x;
            vNewPosition.x += ((1 - cosTheta) * xx * yy - zz * sinTheta) * vPos.y;
            vNewPosition.x += ((1 - cosTheta) * xx * zz + yy * sinTheta) * vPos.z;

            // Find the new y position for the new rotated point
            vNewPosition.y = ((1 - cosTheta) * xx * yy + zz * sinTheta) * vPos.x;
            vNewPosition.y += (cosTheta + (1 - cosTheta) * yy * yy) * vPos.y;
            vNewPosition.y += ((1 - cosTheta) * yy * zz - xx * sinTheta) * vPos.z;

            // Find the new z position for the new rotated point
            vNewPosition.z = ((1 - cosTheta) * xx * zz - yy * sinTheta) * vPos.x;
            vNewPosition.z += ((1 - cosTheta) * yy * zz + xx * sinTheta) * vPos.y;
            vNewPosition.z += (cosTheta + (1 - cosTheta) * zz * zz) * vPos.z;

            _gl2.default.estra = [vPos, x, y, z, this.position, vNewPosition, cosTheta, sinTheta, angle];
            this.position = vNewPosition;
            this.rotate(x, y, z, 1);
            return this;
        }

        /**
         * Sets aex modelview and Normal matrix. Internal function done after transformations as move, rotate etc..
         * @internal
         * @method setModelView
         */

    }, {
        key: 'setModelView',
        value: function setModelView() {
            var m = this.parentMatrix;
            m = m.multiply(_matrix.Matrix.scale(this.size.x, this.size.y, this.size.z));
            m = m.multiply(_matrix.Matrix.rotate(this.rotation.x, 1, 0, 0));
            m = m.multiply(_matrix.Matrix.rotate(this.rotation.y, 0, 1, 0));
            m = m.multiply(_matrix.Matrix.rotate(this.rotation.z, 0, 0, 1));
            m = m.multiply(_matrix.Matrix.translate(this.position.x, this.position.y, this.position.z));
            this.modelView = m;
            this.NormalMatrix = this.modelView.toInverseMat3();
        }

        /**
         * Draw the Aex inside draw function of your Scene
         * @internal
         * @method draw
         */

    }, {
        key: 'draw',
        value: function draw(uniforms) {
            if (!this.hidden) {
                if (_gl2.default.frustum.sphereInFrustum(this.sphere) == true) {
                    if (uniforms) {
                        _gl2.default.currentShader.uniforms(uniforms);
                    }
                    this.setUniforms();
                    var triangleBL = _gl2.default.indexBuffers.triangles.buffer.length;
                    _gl2.default.drawElements(_gl2.default.TRIANGLES, triangleBL, _gl2.default.UNSIGNED_SHORT, 0);
                    for (var child in this.children) {
                        this.children[child].draw();
                    }
                }
            }
        }
    }]);

    return Aex;
}(_mobject.MObject);