'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Material = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mobject = require('./mobject');

var _texture = require('./texture');

var _gl = require('./gl');

var _gl2 = _interopRequireDefault(_gl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SHDS = [];
for (var t = 0; t < 500; t++) {
    SHDS.push("empty");
}
function getShNum() {
    for (var i = 1; i < SHDS.length + 1; i++) {
        if (SHDS[i] == "empty") {
            SHDS[i] = "shader";
            return i;
        }
    }
}

/**
 * Material class
 * @class Material
 * @constructor
 * @param {Object} settings Options for the material
 */

var Material = exports.Material = function (_MObject) {
    _inherits(Material, _MObject);

    function Material(settings) {
        _classCallCheck(this, Material);

        var _this = _possibleConstructorReturn(this, (Material.__proto__ || Object.getPrototypeOf(Material)).call(this));

        _this.shaderId = getShNum();
        _this.compl = 0;
        /**
         * @property settings
         * @type Object
         * @example
         *      mat = new Material()
         *      mat.settings{{
        *         color: [1.0,0.0,0.0],
        *         specularWeight: 1.0,
        *         reflectionWeight: 1.0,
        *         alpha:1.0
        *         }}
         */
        _this.settings = {
            id: _this.shaderId + "",
            color: [1.0, 1.0, 1.0],
            specularWeight: 1.0,
            mappingType: 1.0,
            shininess: 15.0,
            alpha: 1.0
        };
        _this._textures = {};
        if (settings) {
            for (var o in settings) {
                var so = settings[o];
                if (so instanceof _texture.Texture) {
                    _this.setTexture(o, so);
                } else {
                    _this.settings[o] = settings[o];
                }
            }
        }
        return _this;
    }

    /**
     * Draw material
     * @method draw
     */


    _createClass(Material, [{
        key: 'draw',
        value: function draw() {
            var all = this.completeTextures();
            if (all) {
                this.bindAll();
                var dic = {};
                dic["material"] = this.settings;
                for (var tx in this._textures) {
                    var tex = this._textures[tx];
                    if (tex instanceof _texture.Texture) {
                        dic[tx] = tex.binder;
                        if (tex.isAtlas) {
                            dic["atlas"] = tex.uvd[this.atlasName];
                        }
                    }
                }
                for (var child in this.children) {
                    this.children[child].draw(dic);
                }
                this.unbindAll();
            }
        }

        /**
         * Set diffuse texture
         * @method setDiffuse
         * @param {String} channel texture channel ( "diffuse", "specular", "bump", "cube" )
         * @param {Texture} tex Texture to set on diffuse channel
         * @param {String} name required if texture is atlas
         */

    }, {
        key: 'setTexture',
        value: function setTexture(channel, tex, name) {
            if (tex instanceof _texture.Texture) {
                this.compl = -1;
            }
            this._textures[channel] = tex;
            if (tex.isAtlas) {
                this.atlasName = name;
            }
        }

        /**
         * Set diffuse texture
         * @method setDiffuse
         * @param {Texture} tex Texture to set on diffuse channel
         */

    }, {
        key: 'setDiffuse',
        value: function setDiffuse(tex, name) {
            this.setTexture("diffuse", tex, name);
        }

        /**
         * Set bump texture
         * @method setBump
         * @param {Texture} tex Texture to set on bump channel
         */

    }, {
        key: 'setBump',
        value: function setBump(tex, name) {
            this.setTexture("bump", tex, name);
        }

        /**
         * Set specular texture
         * @method setSpecular
         * @param {Texture} tex Texture to set on specular channel
         */

    }, {
        key: 'setSpecular',
        value: function setSpecular(tex, name) {
            this.setTexture("specular", tex, name);
        }

        /**
         * Set cube environment texture
         * @method setCube
         * @param {Texture} tex Texture to set on environment channel
         */

    }, {
        key: 'setCube',
        value: function setCube(cube, name) {
            this.setTexture("cube", cube, name);
        }
    }, {
        key: 'bindAll',
        value: function bindAll() {
            for (var tx in this._textures) {
                var tex = this._textures[tx];
                if (tex instanceof _texture.Texture) {
                    if (tx == "cube") {
                        tex.bindCube();
                    } else {
                        tex.bind();
                    }
                    this[tx] = tex.binder;
                }
            }
        }
    }, {
        key: 'unbindAll',
        value: function unbindAll() {
            for (var tx in this._textures) {
                var tex = this._textures[tx];
                if (tex instanceof _texture.Texture) {
                    if (tx == "cube") {
                        tex.unbindCube();
                    } else {
                        tex.unbind();
                    }
                }
            }
        }
    }, {
        key: 'completeTextures',
        value: function completeTextures() {
            var compmax = 0;
            var comps = 0;
            for (var tx in this._textures) {
                var tex = this._textures[tx];
                compmax += 1;
                if (tex instanceof _texture.Texture) {
                    if (tx != "cube") {
                        if (tex.complete == 1) {
                            tex.handle();
                            tex.complete = 2;
                        } else if (tex.complete == 2) {
                            comps += 1;
                        }
                    } else {
                        if (tex.complete == 6) {
                            tex.handleCube();
                            tex.complete = 12;
                        } else if (tex.complete == 12) {
                            comps += 1;
                        }
                    }
                }
            }
            if (compmax == 0) {
                return true;
            } else {
                return comps / compmax == 1.0 ? true : false;
            }
        }

        /**
         * Set Material shader uniforms
         * @method uniforms
         * @param {Dict} uniforms Dictionary of uniforms of shader
         */

    }, {
        key: 'uniforms',
        value: function uniforms(uni) {
            var dic = uni || {};
            _gl2.default.currentShader.uniforms(dic);
        }
    }]);

    return Material;
}(_mobject.MObject);

Material._settable = ["color", "specularWeight", "mappingType", "alpha", "shininess"];