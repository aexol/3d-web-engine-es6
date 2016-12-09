'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ZBuffer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _texture = require('./texture');

var _vector = require('./vector');

var _gl = require('./gl');

var _gl2 = _interopRequireDefault(_gl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ZBufferShader = function ZBufferShader() {
    return new Shader('\
                    varying vec4 vPos;\
                    void main(){\
                    vPos = gl_ModelViewMatrix * vec4(gl_Vertex, 1.0);\
                    gl_Position = gl_ProjectionMatrix * gl_ModelViewMatrix * vec4(gl_Vertex, 1.0);\
                    }\
                    ', '\
                    varying vec4 vPos;\
                    uniform float zNear;\
                    uniform float zFar;\
                    void main(){\
                        float factor;\
                        factor = 1.0-abs(vPos.z-zNear)/abs(zFar-zNear);\
                        if(vPos.z < zFar){\
                            factor=0.0;\
                        }\
                        if(vPos.z > zNear){\
                            factor=1.0;\
                        }\
                        gl_FragColor = vec4(1.0,factor,factor,1.0);\
                    }\
                    ');
};

/**
 * ZBuffer class
 * @class ZBuffer
 * @constructor
 */

var ZBuffer = exports.ZBuffer = function () {
    function ZBuffer(options) {
        _classCallCheck(this, ZBuffer);

        this.width = 1024;
        this.height = 1024;
        for (var i in options) {
            this[i] = options[i];
        }
        this.buffer = _gl2.default.createFramebuffer();
        this.buffer.width = this.width;
        this.buffer.height = this.height;
        _gl2.default.bindFramebuffer(_gl2.default.FRAMEBUFFER, this.buffer);
        this.texture = new _texture.Texture();
        this.texture.width = this.width;
        this.texture.height = this.height;
        this.texture.handleZB();
        this.renderbuffer = _gl2.default.createRenderbuffer();
        _gl2.default.bindRenderbuffer(_gl2.default.RENDERBUFFER, this.renderbuffer);
        _gl2.default.renderbufferStorage(_gl2.default.RENDERBUFFER, _gl2.default.DEPTH_STENCIL, this.width, this.height);
        _gl2.default.framebufferTexture2D(_gl2.default.FRAMEBUFFER, _gl2.default.COLOR_ATTACHMENT0, _gl2.default.TEXTURE_2D, this.texture.id, 0);
        _gl2.default.framebufferRenderbuffer(_gl2.default.FRAMEBUFFER, _gl2.default.DEPTH_STENCIL_ATTACHMENT, _gl2.default.RENDERBUFFER, this.renderbuffer);
        _gl2.default.bindTexture(_gl2.default.TEXTURE_2D, null);
        _gl2.default.bindRenderbuffer(_gl2.default.RENDERBUFFER, null);
        _gl2.default.bindFramebuffer(_gl2.default.FRAMEBUFFER, null);
        this.texture.complete = 0;
    }

    /**
     * Bind cube framebuffer before drawing
     * @method bindCube
     * @param cubeFace Face of the cube ENUM
     */


    _createClass(ZBuffer, [{
        key: 'bindCube',
        value: function bindCube(cubeFace) {
            _gl2.default.bindFramebuffer(_gl2.default.FRAMEBUFFER, this.buffer);
            _gl2.default.framebufferTexture2D(_gl2.default.FRAMEBUFFER, _gl2.default.COLOR_ATTACHMENT0, cubeFace, this.texture.id, 0);
        }

        /**
         * Bind framebuffer before drawing
         * @method bind
         */

    }, {
        key: 'bind',
        value: function bind() {
            _gl2.default.bindFramebuffer(_gl2.default.FRAMEBUFFER, this.buffer);
        }

        /**
         * Unbind framebuffer
         * @method unbind
         */

    }, {
        key: 'unbind',
        value: function unbind() {
            _gl2.default.bindTexture(_gl2.default.TEXTURE_2D, this.texture.id);
            _gl2.default.generateMipmap(_gl2.default.TEXTURE_2D);
            _gl2.default.bindTexture(_gl2.default.TEXTURE_2D, null);
            _gl2.default.bindFramebuffer(_gl2.default.FRAMEBUFFER, null);
        }
    }]);

    return ZBuffer;
}();

/**
 * ZBufferCube class
 * @class ZBuffer
 * @constructor
 */


var ZBufferCube = function () {
    function ZBufferCube(options) {
        _classCallCheck(this, ZBufferCube);

        this.width = 1024;
        this.height = 1024;
        this.position = new _vector.Vector();
        for (var i in options) {
            this[i] = options[i];
        }
        this.buffers = [];
        this.texture = new _texture.Texture();
        this.texture.width = this.width;
        this.texture.height = this.height;
        this.texture.handleZBCube();

        this.renderbuffer = _gl2.default.createRenderbuffer();
        _gl2.default.bindRenderbuffer(_gl2.default.RENDERBUFFER, this.renderbuffer);
        _gl2.default.renderbufferStorage(_gl2.default.RENDERBUFFER, _gl2.default.DEPTH_STENCIL, this.width, this.height);
        _gl2.default.bindRenderbuffer(_gl2.default.RENDERBUFFER, null);

        var arr = [_gl2.default.TEXTURE_CUBE_MAP_POSITIVE_X, _gl2.default.TEXTURE_CUBE_MAP_NEGATIVE_X, _gl2.default.TEXTURE_CUBE_MAP_POSITIVE_Y, _gl2.default.TEXTURE_CUBE_MAP_NEGATIVE_Y, _gl2.default.TEXTURE_CUBE_MAP_POSITIVE_Z, _gl2.default.TEXTURE_CUBE_MAP_NEGATIVE_Z];
        for (var i = 0; i < 6; i++) {
            var fb = _gl2.default.createFramebuffer();
            fb.width = this.width;
            fb.height = this.height;
            _gl2.default.bindFramebuffer(_gl2.default.FRAMEBUFFER, fb);
            _gl2.default.framebufferTexture2D(_gl2.default.FRAMEBUFFER, _gl2.default.COLOR_ATTACHMENT0, arr[i], this.texture.id, 0);
            _gl2.default.framebufferRenderbuffer(_gl2.default.FRAMEBUFFER, _gl2.default.DEPTH_STENCIL_ATTACHMENT, _gl2.default.RENDERBUFFER, this.renderbuffer);
            this.buffers.push(fb);
        }
        _gl2.default.bindFramebuffer(_gl2.default.FRAMEBUFFER, null);
        this.texture.complete = 0;
    }

    /**
     * Bind framebuffer before drawing
     * @method bind
     */


    _createClass(ZBufferCube, [{
        key: 'bind',
        value: function bind(n) {
            _gl2.default.bindFramebuffer(_gl2.default.FRAMEBUFFER, this.buffers[n]);
        }

        /**
         * Unbind framebuffer
         * @method unbind
         */

    }, {
        key: 'unbind',
        value: function unbind() {
            _gl2.default.bindFramebuffer(_gl2.default.FRAMEBUFFER, null);
        }

        /**
         * Draw Scene into framebuffer cube texture
         * @method draw
         * @param drawFunction(uniforms) drawFunction to pass uniforms to
         * @example
         *      var cube = new ZBufferCube()
         *      cube.draw(function(uniforms){
         *          world.draw();
         *      })
         * @example
         *      var cube = new ZBufferCube()
         *      var shaderOverride = basicShader({color:[1.0,0.0,0.0]})
         *      cube.draw(function(uniforms){
         *          world.drawOverride(shaderOverride,uniforms);
         *      })
         */

    }, {
        key: 'draw',
        value: function draw(drawFunction) {
            var degs = [[0, 90, 0], [0, -90, 0], [90, 0, 0], [-90, 0, 0], [0, 0, 0], [0, 180, 0]];
            for (var i = 0; i < 6; i++) {
                _gl2.default.viewport(0, 0, this.width, this.height);
                this.bind(i);
                _gl2.default.clear(_gl2.default.COLOR_BUFFER_BIT | _gl2.default.DEPTH_BUFFER_BIT);
                var m = Matrix.perspective(90.0, 1.0, 0.01, 100.0);
                m = m.rotateVector(degs[i][0], degs[i][1], degs[i][2]);
                m = m.multiply(Matrix.translate(-this.position.x, -this.position.y, -this.position.z));
                drawFunction({
                    _gl_ProjectionMatrix: m,
                    lightPosition: this.position.toArray()
                });
                this.unbind();
            }
        }
    }]);

    return ZBufferCube;
}();