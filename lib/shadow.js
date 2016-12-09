'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Shadow = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      @module Shadow
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _shader = require('./shader');

var _zbuffer = require('./zbuffer');

var _gl = require('./gl');

var _gl2 = _interopRequireDefault(_gl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var shadowShader = function shadowShader(options) {
    if (options) {
        for (var o in options) {
            settings[o] = options[o];
        }
    }
    var bShader = new _shader.Shader("", "", 1);
    bShader.addVarying("vec4", "vPosition");
    bShader.addVertexSource('\
			void main(void) {\
			    vPosition = gl_ModelViewMatrix * vec4(Vertex, 1.0);\
			    gl_Position = gl_ProjectionMatrix * vPosition;\
			}');
    bShader.addUniform("float", "near");
    bShader.addUniform("float", "far");
    bShader.addUniform("vec3", "lightPosition");
    var fragSource = 'void main(void) {\
        vec3 vpos = vec3(vPosition.x,vPosition.y,vPosition.z);\
        vec3 lpp = lightPosition;\
        float distance = length(lpp-vpos);\
        float ndepth = distance/far;\
        gl_FragColor = vec4(ndepth,ndepth,ndepth,1.0);\
    }';
    bShader.addFragmentSource(fragSource);
    bShader._build();
    return bShader;
};
var varianceDepth = function varianceDepth(options) {
    if (options) {
        for (var o in options) {
            settings[o] = options[o];
        }
    }
    var bShader = new _shader.Shader("", "", 1);
    bShader.addVarying("vec4", "vPosition");
    bShader.addVertexSource('\
			void main(void) {\
			    vPosition = gl_ModelViewMatrix * vec4(Vertex, 1.0);\
			    gl_Position = gl_ProjectionMatrix * vPosition;\
			}');
    bShader.addUniform("vec3", "lightPosition");
    var fragSource = '//\
        void main(){\
            vec3 vpos = vPosition.xyz;\
            vec3 lpp = lightPosition;\
            float distance = min(length(lpp-vpos),near);\
            float depth = max(min(distance/far,0.0),1.0);\
            float dx = dFdx(depth);\
            float dy = dFdy(depth);\
            gl_FragColor = vec4(depth, pow(depth, 2.0) + 0.25*(dx*dx + dy*dy), 0.0, 1.0);\
        }';
    bShader.addFragmentSource(fragSource);
    bShader._build();
    return bShader;
};

/**
 * @class Shadow
 * @param {Scene} scene
 * @param {Vector} lightPosition of pointLight
 * @param {float} [near] near shadow plane
 * @param {float} [far] far shadow plane
 * @param {int} [resolution] shadow map resolution
 * @constructor
 */

var Shadow = exports.Shadow = function () {
    function Shadow(scene, lightPosition, near, far, resolution) {
        _classCallCheck(this, Shadow);

        this.map = new _zbuffer.ZBufferCube({
            width: resolution || 512,
            height: resolution || 512
        });
        this.scene = scene;
        this.far = far || 100.0;
        this.near = near || 0.1;
        this.shader = shadowShader();
        this.position = lightPosition;
        this.projectionMatrix = Matrix.perspective(90.0, 1.0, this.near, this.far);
    }

    /**
     * draws shadow
     * @method draw
     */


    _createClass(Shadow, [{
        key: 'draw',
        value: function draw() {
            var degs = [[0, 90, 0], [0, -90, 0], [90, 0, 0], [-90, 0, 0], [0, 0, 0], [0, 180, 0]];
            for (var i = 0; i < 6; i++) {
                _gl2.default.viewport(0, 0, this.map.width, this.map.height);
                this.map.bind(i);
                _gl2.default.clear(_gl2.default.COLOR_BUFFER_BIT | _gl2.default.DEPTH_BUFFER_BIT);
                var m = this.projectionMatrix;
                m = m.rotateVector(degs[i][0], degs[i][1], degs[i][2]);
                m = m.multiply(Matrix.translate(-this.position.x, -this.position.y, -this.position.z));
                this.scene.drawOverride(this.shader, {
                    _gl_ProjectionMatrix: m.m,
                    lightPosition: this.position.toArray(),
                    near: this.near,
                    far: this.far
                });
                this.map.unbind();
            }
        }
    }]);

    return Shadow;
}();