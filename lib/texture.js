'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Texture = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _resource = require('./resource');

var _gl = require('./gl');

var _gl2 = _interopRequireDefault(_gl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function powerof2(liczba) {
    return liczba != 0 && (liczba & liczba - 1) == 0;
}
/**
 * Texture class
 * @class Texture
 * @constructor
 */

var Texture = exports.Texture = function () {
    function Texture(options) {
        _classCallCheck(this, Texture);

        this.options = options || {};
        this.id = _gl2.default.createTexture();
        this.binded = false;
        this.format = this.options.format || _gl2.default.RGBA;
        this.type = this.options.type || _gl2.default.UNSIGNED_BYTE;
    }

    _createClass(Texture, [{
        key: 'handle2DTexture',
        value: function handle2DTexture() {
            var options = this.options;
            _gl2.default.bindTexture(_gl2.default.TEXTURE_2D, this.id);
            _gl2.default.pixelStorei(_gl2.default.UNPACK_FLIP_Y_WEBGL, 1);
            _gl2.default.texImage2D(_gl2.default.TEXTURE_2D, 0, this.format, this.format, this.type, this.image || null);
            _gl2.default.texParameteri(_gl2.default.TEXTURE_2D, _gl2.default.TEXTURE_MAG_FILTER, options.filter || options.magFilter || _gl2.default.LINEAR);
            if (powerof2(this.image.width) && powerof2(this.image.height)) {
                _gl2.default.texParameteri(_gl2.default.TEXTURE_2D, _gl2.default.TEXTURE_MIN_FILTER, options.filter || options.minFilter || _gl2.default.LINEAR_MIPMAP_LINEAR);
            } else {
                _gl2.default.texParameteri(_gl2.default.TEXTURE_2D, _gl2.default.TEXTURE_MIN_FILTER, options.filter || options.minFilter || _gl2.default.LINEAR);
            }
            _gl2.default.texParameteri(_gl2.default.TEXTURE_2D, _gl2.default.TEXTURE_WRAP_S, options.wrap || options.wrapS || _gl2.default.CLAMP_TO_EDGE);
            _gl2.default.texParameteri(_gl2.default.TEXTURE_2D, _gl2.default.TEXTURE_WRAP_T, options.wrap || options.wrapT || _gl2.default.CLAMP_TO_EDGE);
            if (powerof2(this.image.width) && powerof2(this.image.height)) {
                _gl2.default.generateMipmap(_gl2.default.TEXTURE_2D);
            }
            _gl2.default.bindTexture(_gl2.default.TEXTURE_2D, null);
        }
    }, {
        key: 'handle',
        value: function handle() {
            if (this.isAtlas) {
                this.handleAtlas();
            } else {
                this.handle2DTexture();
            }
        }
    }, {
        key: 'handleAtlas',
        value: function handleAtlas() {
            var options = this.options;
            _gl2.default.bindTexture(_gl2.default.TEXTURE_2D, this.id);
            _gl2.default.pixelStorei(_gl2.default.UNPACK_FLIP_Y_WEBGL, 1);
            _gl2.default.texImage2D(_gl2.default.TEXTURE_2D, 0, this.format, this.format, this.type, this.image || null);
            _gl2.default.texParameteri(_gl2.default.TEXTURE_2D, _gl2.default.TEXTURE_MAG_FILTER, options.filter || options.magFilter || _gl2.default.LINEAR);
            _gl2.default.texParameteri(_gl2.default.TEXTURE_2D, _gl2.default.TEXTURE_MIN_FILTER, options.filter || options.minFilter || _gl2.default.LINEAR_MIPMAP_LINEAR);
            _gl2.default.texParameteri(_gl2.default.TEXTURE_2D, _gl2.default.TEXTURE_WRAP_S, options.wrap || options.wrapS || _gl2.default.CLAMP_TO_EDGE);
            _gl2.default.texParameteri(_gl2.default.TEXTURE_2D, _gl2.default.TEXTURE_WRAP_T, options.wrap || options.wrapT || _gl2.default.CLAMP_TO_EDGE);
            _gl2.default.generateMipmap(_gl2.default.TEXTURE_2D);
        }
    }, {
        key: 'handleZB',
        value: function handleZB() {
            var options = this.options;
            _gl2.default.bindTexture(_gl2.default.TEXTURE_2D, this.id);
            _gl2.default.texImage2D(_gl2.default.TEXTURE_2D, 0, this.format, this.width, this.height, 0, this.format, this.type, null);
            _gl2.default.texParameteri(_gl2.default.TEXTURE_2D, _gl2.default.TEXTURE_MAG_FILTER, options.filter || options.magFilter || _gl2.default.LINEAR);
            _gl2.default.texParameteri(_gl2.default.TEXTURE_2D, _gl2.default.TEXTURE_MIN_FILTER, options.filter || options.minFilter || _gl2.default.LINEAR_MIPMAP_NEAREST);
            _gl2.default.texParameteri(_gl2.default.TEXTURE_2D, _gl2.default.TEXTURE_WRAP_S, options.wrap || options.wrapS || _gl2.default.CLAMP_TO_EDGE);
            _gl2.default.texParameteri(_gl2.default.TEXTURE_2D, _gl2.default.TEXTURE_WRAP_T, options.wrap || options.wrapT || _gl2.default.CLAMP_TO_EDGE);
            _gl2.default.generateMipmap(_gl2.default.TEXTURE_2D);
        }
    }, {
        key: 'handleZBCube',
        value: function handleZBCube() {
            _gl2.default.bindTexture(_gl2.default.TEXTURE_CUBE_MAP, this.id);
            _gl2.default.pixelStorei(_gl2.default.UNPACK_FLIP_Y_WEBGL, 1);
            _gl2.default.texImage2D(_gl2.default.TEXTURE_CUBE_MAP_POSITIVE_X, 0, this.format, this.width, this.height, 0, this.format, this.type, null);
            _gl2.default.texImage2D(_gl2.default.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, this.format, this.width, this.height, 0, this.format, this.type, null);
            _gl2.default.texImage2D(_gl2.default.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, this.format, this.width, this.height, 0, this.format, this.type, null);
            _gl2.default.texImage2D(_gl2.default.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, this.format, this.width, this.height, 0, this.format, this.type, null);
            _gl2.default.texImage2D(_gl2.default.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, this.format, this.width, this.height, 0, this.format, this.type, null);
            _gl2.default.texImage2D(_gl2.default.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, this.format, this.width, this.height, 0, this.format, this.type, null);
            _gl2.default.texParameteri(_gl2.default.TEXTURE_CUBE_MAP, _gl2.default.TEXTURE_MIN_FILTER, _gl2.default.NEAREST);
            _gl2.default.texParameteri(_gl2.default.TEXTURE_CUBE_MAP, _gl2.default.TEXTURE_MAG_FILTER, _gl2.default.NEAREST);
            _gl2.default.texParameteri(_gl2.default.TEXTURE_CUBE_MAP, _gl2.default.TEXTURE_WRAP_S, _gl2.default.CLAMP_TO_EDGE);
            _gl2.default.texParameteri(_gl2.default.TEXTURE_CUBE_MAP, _gl2.default.TEXTURE_WRAP_T, _gl2.default.CLAMP_TO_EDGE);
        }
    }, {
        key: 'handleCube',
        value: function handleCube() {
            _gl2.default.bindTexture(_gl2.default.TEXTURE_CUBE_MAP, this.id);
            _gl2.default.pixelStorei(_gl2.default.UNPACK_FLIP_Y_WEBGL, 1);
            _gl2.default.texImage2D(_gl2.default.TEXTURE_CUBE_MAP_POSITIVE_X, 0, this.format, this.format, this.type, this.cube[0]);
            _gl2.default.texImage2D(_gl2.default.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, this.format, this.format, this.type, this.cube[1]);
            _gl2.default.texImage2D(_gl2.default.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, this.format, this.format, this.type, this.cube[2]);
            _gl2.default.texImage2D(_gl2.default.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, this.format, this.format, this.type, this.cube[3]);
            _gl2.default.texImage2D(_gl2.default.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, this.format, this.format, this.type, this.cube[4]);
            _gl2.default.texImage2D(_gl2.default.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, this.format, this.format, this.type, this.cube[5]);
            _gl2.default.texParameteri(_gl2.default.TEXTURE_CUBE_MAP, _gl2.default.TEXTURE_MIN_FILTER, _gl2.default.LINEAR);
            _gl2.default.texParameteri(_gl2.default.TEXTURE_CUBE_MAP, _gl2.default.TEXTURE_MAG_FILTER, _gl2.default.LINEAR);
            _gl2.default.texParameteri(_gl2.default.TEXTURE_CUBE_MAP, _gl2.default.TEXTURE_WRAP_S, _gl2.default.CLAMP_TO_EDGE);
            _gl2.default.texParameteri(_gl2.default.TEXTURE_CUBE_MAP, _gl2.default.TEXTURE_WRAP_T, _gl2.default.CLAMP_TO_EDGE);
            _gl2.default.bindTexture(_gl2.default.TEXTURE_CUBE_MAP, null);
        }
    }, {
        key: 'bind',
        value: function bind(unit) {
            if (!this.binded) {
                _gl2.default.nTexture += 1;
                this.binded = true;
                this.binder = _gl2.default.nTexture;
                _gl2.default.activeTexture(_gl2.default.TEXTURE0 + this.binder);
                _gl2.default.bindTexture(_gl2.default.TEXTURE_2D, this.id);
            }
        }
    }, {
        key: 'bindCube',
        value: function bindCube() {
            if (!this.binded) {
                _gl2.default.nTexture += 1;
                this.binded = true;
                this.binder = _gl2.default.nTexture;
                _gl2.default.activeTexture(_gl2.default.TEXTURE0 + this.binder);
                _gl2.default.bindTexture(_gl2.default.TEXTURE_CUBE_MAP, this.id);
            }
        }
    }, {
        key: 'unbindCube',
        value: function unbindCube() {
            if (this.binded) {
                _gl2.default.nTexture -= 1;
                this.binded = false;
                _gl2.default.activeTexture(_gl2.default.TEXTURE0 + this.binder);
                _gl2.default.bindTexture(_gl2.default.TEXTURE_CUBE_MAP, null);
            }
        }
    }, {
        key: 'unbind',
        value: function unbind(unit) {
            if (this.binded) {
                _gl2.default.nTexture -= 1;
                this.binded = false;
                _gl2.default.activeTexture(_gl2.default.TEXTURE0 + this.binder);
                _gl2.default.bindTexture(_gl2.default.TEXTURE_2D, null);
            }
        }
    }, {
        key: 'remove',
        value: function remove() {
            TXTS[this.binder] = "empty";
        }

        /**
         * Creates a texture from image file
         * @method fromImage
         * @param {String} src path to image file
         * @param {Dict} options
         * @example
         *      var imageSuper = Texture.fromImage("img/imgsuper.png",{
         *          wrap: gl.CLAMP_TO_EDGE,
         *          filter: gl.LINEAR_MIPMAP_LINEAR
         *      })
         * @example
         *      var imageSuper = Texture.fromImage("img/imgsuper.png",{
         *          wrap: gl.REPEAT,
         *          filter: gl.LINEAR
         *      })
         */

    }], [{
        key: 'bindTexture2D',
        value: function bindTexture2D(t) {
            var binder = _gl2.default.nTexture;
            _gl2.default.activeTexture(_gl2.default.TEXTURE0 + _gl2.default.nTexture);
            _gl2.default.bindTexture(_gl2.default.TEXTURE_2D, t.id);
            _gl2.default.nTexture += 1;
            _gl2.default.nTexture = _gl2.default.nTexture % _gl2.default.MAX_NUMBER_OF_TEXTURES;
            return binder;
        }
    }, {
        key: 'bindTextureCube',
        value: function bindTextureCube(t) {
            var binder = _gl2.default.cbTexture;
            _gl2.default.activeTexture(_gl2.default.TEXTURE0 + _gl2.default.cbTexture);
            _gl2.default.bindTexture(_gl2.default.TEXTURE_CUBE_MAP, t.id);
            _gl2.default.cbTexture += 1;
            _gl2.default.cbTexture = _gl2.default.cbTexture % _gl2.default.MAX_NUMBER_OF_TEXTURES;
            return binder;
        }
    }, {
        key: 'fromImage',
        value: function fromImage(src, options) {
            options = options || {};
            var texture = new Texture(0, 0, options);
            texture.image = new Image();
            texture.complete = 0;
            texture.options = options;
            _resource.Resource.load(src, function (e) {
                texture.image.src = window.URL.createObjectURL(e);
                texture.image.onload = function () {
                    texture.image = this;
                    texture.complete = 1;
                    if (texture.options.callback) {
                        texture.options.callback(texture);
                    }
                };
            });
            return texture;
        }
    }, {
        key: 'fromCanvas',
        value: function fromCanvas(canvas, options) {
            var texture = new Texture(0, 0, options);
            texture.image = canvas;
            texture.complete = 1;
            return texture;
        }

        /**
         * Creates a texture cube image files
         * @method fromCube
         * @param {String[]} srcs array to 6 path to image files
         * @param {Dict} options
         * @example
         *      var imageSuper = Texture.fromCube(["cube1.png",
         *                                         "cube2.png",
         *                                         "cube3.png",
         *                                         "cube4.png",
         *                                         "cube5.png",
         *                                         "cube6.png"],{})
         */

    }, {
        key: 'fromCube',
        value: function fromCube(srcs, options) {
            options = options || {};
            var texture = new Texture(0, 0, options);
            texture.cube = [];
            texture.complete = 0;
            for (var s in srcs) {
                _resource.Resource.load(srcs[s], function (e) {
                    texture.cube.push(new Image());
                    texture.cube[texture.complete].src = window.URL.createObjectURL(e);
                    texture.cube[texture.complete].onload = function () {
                        texture.cube[texture.complete] = this;
                    };
                    texture.complete += 1;
                });
            }
            return texture;
        }

        /**
         * Creates a texture from image blob
         * @method fromBlob
         * @param {String} blob image blov
         * @param {Dict} options
         */

    }, {
        key: 'fromBlob',
        value: function fromBlob(blob, options) {
            options = options || {};
            var texture = new Texture(0, 0, options);
            texture.image = new Image();
            texture.complete = 0;
            texture.options = options;
            texture.image.src = blob;
            texture.image.onload = function () {
                texture.image = this;
                texture.complete = 1;
            };
            return texture;
        }

        /**
         * Creates a texture atlas
         * @static
         * @method Atlas
         * @param {String} srcImage image file name
         * @param {String} srcJSON JSON file name
         * @param {Dict} options
         * @example
         *      var imageAtlas = Texture.Atlas("map.png","map.json")
         *      var image = Texture.fromAtlas(imageAtlas,"foot.png")
         *      podstawaMat = new Material({color: [0.3,0.9,0.9]})
         *  var tat = Texture.Atlas("into.png","into.json")
         *  podstawaMat.setTexture("diffuse",tat,"tap to play.png")
         */

    }, {
        key: 'Atlas',
        value: function Atlas(srcImage, srcJSON, options) {
            var texture = new Texture(0, 0, options);
            texture.image = new Image();
            texture.complete = 0;
            _gl2.default.loadedElements[srcImage] = 0;
            texture.options = options || {};
            texture.isAtlas = true;
            _resource.Resource.load(src, function (e) {
                texture.image.src = window.URL.createObjectURL(e);
                texture.image.onload = function () {
                    texture.image = this;
                    texture.resolution = { w: this.width, h: this.height };
                    texture.complete = -1;
                    _resource.Resource.load(srcJSON, function (e) {
                        texture.json = JSON.parse(e);
                        texture.uvd = {};
                        for (var j in texture.json) {
                            var tjs = texture.json[j];
                            var xx = tjs["x"] / texture.resolution.w;
                            var yy = tjs["y"] / texture.resolution.h;
                            texture.uvd[j] = [xx, xx + tjs["width"] / texture.resolution.w, yy, yy + tjs["height"] / texture.resolution.h];
                        }
                        texture.complete = 1;
                    });
                };
            });

            return texture;
        }
    }]);

    return Texture;
}();