'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Scene = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mobject = require('./mobject');

var _gl = require('./gl');

var _gl2 = _interopRequireDefault(_gl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Scene class
 * @class Scene
 * @constructor
 * @example
 *      var world = new Scene()
 */
var Scene = exports.Scene = function (_MObject) {
    _inherits(Scene, _MObject);

    function Scene() {
        _classCallCheck(this, Scene);

        var _this = _possibleConstructorReturn(this, (Scene.__proto__ || Object.getPrototypeOf(Scene)).call(this));

        _this._globalShaderInit = 0;
        _this._init = false;
        return _this;
    }

    _createClass(Scene, [{
        key: 'init',
        value: function init() {}
        // canvasInit()


        /**
         * Traverse all items
         * @private
         * @method traverse
         */

    }, {
        key: 'traverse',
        value: function traverse() {
            function stepDown(tt) {
                if (tt.children.length > 0) {
                    for (var child in tt.children) {
                        stepDown(tt.children[child]);
                    }
                }
            }

            stepDown(this);
        }

        /**
         * Draw all items inside Scene with connected camera
         * @method draw
         * @param {Camera} [camera] showing drawed items
         */

    }, {
        key: 'draw',
        value: function draw(camera) {
            if (!this._init) {
                this.init();
                this._init = true;
            }
            _gl2.default.viewport(0, 0, _gl2.default.canvas.width, _gl2.default.canvas.height);
            var dic = {};
            if (camera) {
                camera.transforms();
                dic = camera.uniforms;
            }
            for (var child in this.children) {
                _gl2.default.frame += 1;
                this.children[child].draw(dic);
            }
        }

        /**
         * Draw all items inside Scene with connected camera
         * @method drawOverride
         * @param {Shader} [shader] Shader to override for all items
         * @param {Dict} uniforms to pass to shader
         */

    }, {
        key: 'drawOverride',
        value: function drawOverride(shader, uniforms) {
            shader.useProgram();
            shader.uniforms(uniforms);
            shader.uniformsSet = {};
            meshTable = [];
            function checkDown(node) {
                if (node instanceof Mesh) {
                    meshTable.push(node);
                } else {
                    if (node.children.length > 0) {
                        for (var c in node.children) {
                            checkDown(node.children[c]);
                        }
                    }
                }
            }

            checkDown(this);
            _gl2.default.extradata = meshTable;
            for (var c in meshTable) {
                meshTable[c].draw();
            }
        }
    }]);

    return Scene;
}(_mobject.MObject);