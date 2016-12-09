'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Shader = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mobject = require('./mobject');

var _matrix = require('./matrix');

var _vector = require('./vector');

var _gl = require('./gl');

var _gl2 = _interopRequireDefault(_gl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function regexMap(regex, text, callback) {
    var result = regex.exec(text);
    while (result != null) {
        callback(result);
        result = regex.exec(text);
    }
}
// Insert the header after any extensions, since those must come first.
function fix(header, source) {
    var match = /^((\s*\/\/.*\n|\s*#extension.*\n)+)[^]*$/.exec(source);
    source = match ? match[1] + header + source.substr(match[1].length) : header + source;
    regexMap(/\bgl_\w+\b/g, header, function (result) {
        source = source.replace(new RegExp(result, 'g'), '_' + result);
    });
    return source;
}
function compare(a1, a2) {
    if (a1 instanceof Array) {
        if (a1.length != a2.length) return false;
        for (var i = 0, l = a1.length; i < l; i++) {
            if (a1[i] instanceof Array && a2[i] instanceof Array) {
                if (!compareArrays(a1[i], a2[i])) return false;
            } else if (a1[i] != a2[i]) {
                return false;
            }
        }
        return true;
    } else {
        return a1 == a2;
    }
}
/**
  * Shader class
  * @class Shader
  * @constructor
  * @param {String} vertexSource Source of vertex shader
  * @param {String} fragmentSource Source of fragment shader
  * @param {String} addons additional attributes
*/

var Shader = function (_MObject) {
    _inherits(Shader, _MObject);

    function Shader(vertexSource, fragmentSource, noBuild) {
        _classCallCheck(this, Shader);

        var _this = _possibleConstructorReturn(this, (Shader.__proto__ || Object.getPrototypeOf(Shader)).call(this));

        _this.cp = -1.0;
        _this.uniformsSet = {};
        _this.construct = {
            "varying": [],
            "uniforms": [],
            "defines": [],
            "structs": {},
            "mainFragment": fragmentSource,
            "mainVertex": vertexSource
        };
        _this.header = 'uniform mat4 gl_ModelViewMatrix;uniform mat4 gl_ProjectionMatrix;uniform mat4 gl_ModelViewProjectionMatrix;uniform mat3 NormalMatrix;';
        _this.vertexHeader = 'precision highp float; attribute vec3 Vertex;attribute vec2 TexCoord;attribute vec3 Normal;' + _this.header;
        _this.fragmentHeader = 'precision highp float;' + _this.header;
        if (noBuild) {} else {
            _this._build();
        }
        return _this;
    }

    _createClass(Shader, [{
        key: 'addUniform',
        value: function addUniform(type, name) {
            this.construct.uniforms.push([type, name]);
        }
    }, {
        key: 'define',
        value: function define(name) {
            this.construct.defines.push(name);
        }
    }, {
        key: 'addVarying',
        value: function addVarying(type, name) {
            this.construct.varying.push([type, name]);
        }
    }, {
        key: 'addStruct',
        value: function addStruct(name, struct) {
            this.construct.structs[name] = [];
            if (struct) {
                this.construct.structs[name] = struct;
            }
        }
    }, {
        key: 'addToStruct',
        value: function addToStruct(structName, type, name) {
            this.construct.structs[structName].push([type, name]);
        }
    }, {
        key: 'addVertexSource',
        value: function addVertexSource(source) {
            this.construct.mainVertex = source;
        }
    }, {
        key: 'addFragmentSource',
        value: function addFragmentSource(source) {
            this.construct.mainFragment = source;
        }
    }, {
        key: 'reconstruct',
        value: function reconstruct() {
            this.vertexLines = "";
            this.fragmentLines = "";
            for (var v in this.construct.defines) {
                var vv = this.construct.defines[v];
                var line = "\n#define " + vv + " 1 \n";
                this.fragmentLines += line;
            }
            for (var v in this.construct.varying) {
                var vv = this.construct.varying[v];
                var line = "varying " + vv[0] + " " + vv[1] + ";\n";
                this.vertexLines += line;
                this.fragmentLines += line;
            }
            for (var st in this.construct.structs) {
                var ss = this.construct.structs[st];
                var line = "struct " + st + "{\n";
                for (var svalue in ss) {
                    var ll = ss[svalue];
                    line += "\t" + ll[0] + " " + ll[1] + ";\n";
                }
                line += "};\n";
                this.fragmentLines += line;
                this.vertexLines += line;
            }
            for (var u in this.construct.uniforms) {
                var uu = this.construct.uniforms[u];
                var line = "uniform " + uu[0] + " " + uu[1] + ";\n";
                this.fragmentLines += line;
                this.vertexLines += line;
            }
            this.vertexLines += this.construct.mainVertex;
            this.fragmentLines += this.construct.mainFragment;
        }
    }, {
        key: '_build',
        value: function _build() {
            this.reconstruct();
            var vertexSource = fix(this.vertexHeader, this.vertexLines);
            var fragmentSource = fix(this.fragmentHeader, this.fragmentLines);
            function compileSource(type, source) {
                var shader = _gl2.default.createShader(type);
                _gl2.default.shaderSource(shader, source);
                _gl2.default.compileShader(shader);
                if (!_gl2.default.getShaderParameter(shader, _gl2.default.COMPILE_STATUS)) {
                    alert('compile error: ' + _gl2.default.getShaderInfoLog(shader));
                }
                return shader;
            }
            this.program = _gl2.default.createProgram();
            _gl2.default.attachShader(this.program, compileSource(_gl2.default.VERTEX_SHADER, vertexSource));
            _gl2.default.attachShader(this.program, compileSource(_gl2.default.FRAGMENT_SHADER, fragmentSource));
            _gl2.default.bindAttribLocation(this.program, 0, "Vertex");
            _gl2.default.bindAttribLocation(this.program, 1, "Normal");
            _gl2.default.bindAttribLocation(this.program, 2, "TexCoord");
            _gl2.default.enableVertexAttribArray(0);
            _gl2.default.enableVertexAttribArray(1);
            _gl2.default.enableVertexAttribArray(2);

            _gl2.default.linkProgram(this.program);
            if (!_gl2.default.getProgramParameter(this.program, _gl2.default.LINK_STATUS)) {
                _gl2.default.extradatae = 'link error: ' + _gl2.default.getProgramInfoLog(this.program);
            }
            this.attributes = {};
            this.uniformLocations = {};
            var isSampler = {};
            regexMap(/uniform\s+sampler(1D|2D|3D|Cube)\s+(\w+)\s*;/g, vertexSource + fragmentSource, function (groups) {
                isSampler[groups[2]] = 1;
            });
            this.isSampler = isSampler;
            this.needsMVP = (vertexSource + fragmentSource).indexOf('gl_ModelViewProjectionMatrix') != -1;
        }
    }, {
        key: '_checkUniforms',
        value: function _checkUniforms(value, location, name, lname) {
            if (value instanceof _vector.Vector) {
                value = [value.x, value.y, value.z];
            } else if (value instanceof _matrix.Matrix) {
                value = value.m;
            }
            var checkname = lname;
            if (compare(this.uniformsSet[checkname], value)) {
                return;
            } else {
                this.uniformsSet[checkname] = value;
            }
            if (isArray(value)) {

                switch (value.length) {
                    case 1:
                        _gl2.default.uniform1fv(location, new Float32Array(value));
                        break;
                    case 2:
                        _gl2.default.uniform2fv(location, new Float32Array(value));
                        break;
                    case 3:
                        _gl2.default.uniform3fv(location, new Float32Array(value));
                        break;
                    case 4:
                        _gl2.default.uniform4fv(location, new Float32Array(value));
                        break;
                    // Matrices are automatically transposed, since WebGL uses column-major
                    // indices instead of row-major indices.
                    case 9:
                        _gl2.default.uniformMatrix3fv(location, false, new Float32Array([value[0], value[3], value[6], value[1], value[4], value[7], value[2], value[5], value[8]]));
                        break;
                    case 16:
                        _gl2.default.uniformMatrix4fv(location, false, new Float32Array([value[0], value[4], value[8], value[12], value[1], value[5], value[9], value[13], value[2], value[6], value[10], value[14], value[3], value[7], value[11], value[15]]));
                        break;
                    default:
                        __error('don\'t know how to load uniform "' + name + '" of length ' + value.length);
                }
            } else if (isNumber(value)) {
                (this.isSampler[name] ? _gl2.default.uniform1i : _gl2.default.uniform1f).call(_gl2.default, location, value);
            } else if (typeof value == "boolean") {
                _gl2.default.uniform1i(location, value == true ? 1 : 0);
            } else {
                if (value == null) {} else {
                    console.log(name, value == null);
                    __error('attempted to set uniform "' + name + '" to invalid value ' + value);
                }
            }
        }
    }, {
        key: 'useProgram',
        value: function useProgram() {
            _gl2.default.useProgram(this.program);
            _gl2.default.currentShader = this;
            _gl2.default.currentProgram = this.program;
        }

        /**
        * Set shader uniforms
        * @method uniforms
        * @param {Dict} uniforms Dictionary of uniforms of shader
        */

    }, {
        key: 'uniforms',
        value: function uniforms(_uniforms) {
            for (var name in _uniforms) {
                var value = _uniforms[name];
                if (value instanceof Object && !isArray(value) && !(value instanceof _matrix.Matrix) && !(arr instanceof _vector.Vector)) {
                    var id = value["id"] ? value["id"] : "";
                    this.uniformLocations[name] = this.uniformLocations[name] || {};
                    for (var us in value) {
                        if (us == "id") {
                            continue;
                        }
                        var location = this.uniformLocations[name][us] || _gl2.default.getUniformLocation(this.program, name + '.' + us);
                        if (!location) {
                            this.uniformsSet[name + us] = value[us];
                            continue;
                        }
                        this.uniformLocations[name][us] = location;
                        var val = value[us];
                        this._checkUniforms(val, location, name, name + us);
                    }
                } else if (isArray(value) && (value[0] instanceof Object || isArray(value[0]))) {
                    for (var i = 0; i < value.length; i++) {
                        var arr = value[i];
                        if (arr instanceof Object && !isArray(arr) && !(arr instanceof _matrix.Matrix) && !(arr instanceof _vector.Vector)) {
                            this.uniformLocations[name] = this.uniformLocations[name] || [];
                            for (us in arr) {
                                this.uniformLocations[name][i] = this.uniformLocations[name][i] || {};
                                var location = this.uniformLocations[name][i][us] || _gl2.default.getUniformLocation(this.program, name + '[' + i + ']' + '.' + us);
                                if (!location) continue;
                                this.uniformLocations[name][us] = location;
                                var val = arr[us];
                                this._checkUniforms(val, location, name, name + us + i);
                            }
                        } else {
                            this.uniformLocations[name] = this.uniformLocations[name] || [];
                            var location = this.uniformLocations[name][i] || _gl2.default.getUniformLocation(this.program, name + '[' + i + ']');
                            if (!location) continue;
                            this.uniformLocations[name][i] = location;
                            this._checkUniforms(value, location, name, name + i);
                        }
                    }
                } else {
                    var location = this.uniformLocations[name] || _gl2.default.getUniformLocation(this.program, name);
                    if (!location) continue;
                    this.uniformLocations[name] = location;
                    this._checkUniforms(value, location, name, name);
                }
            }

            return this;
        }

        /** 
        * Draw with this shader
        * @method draw
        */

    }, {
        key: 'draw',
        value: function draw(uniforms) {
            this.useProgram();
            var dic = uniforms || {};
            this.uniforms(dic);
            this.uniformsSet = {};
            for (var child in this.children) {
                this.children[child].draw();
            }
        }
    }]);

    return Shader;
}(_mobject.MObject);

exports.Shader = Shader;


var isArray = function isArray(obj) {
    return Object.prototype.toString.call(obj) == '[object Array]';
};

var isNumber = function isNumber(obj) {
    return Object.prototype.toString.call(obj) == '[object Number]';
};

function loadFile(url, data, callback, errorCallback) {
    // Set up an asynchronous request
    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    // Hook the event that gets called as the request progresses
    request.onreadystatechange = function () {
        // If the request is "DONE" (completed or failed)
        if (request.readyState == 4) {
            // If we got HTTP status 200 (OK)
            if (request.status == 200) {
                callback(request.responseText, data);
            } else {
                // Failed
                errorCallback(url);
            }
        }
    };

    request.send(null);
}

function loadFiles(urls, callback, errorCallback) {
    var numUrls = urls.length;
    var numComplete = 0;
    var result = [];

    // Callback for a single file
    function partialCallback(text, urlIndex) {
        result[urlIndex] = text;
        numComplete++;

        // When all files have downloaded
        if (numComplete == numUrls) {
            callback(result);
        }
    }

    for (var i = 0; i < numUrls; i++) {
        loadFile(urls[i], i, partialCallback, errorCallback);
    }
}
/** 
* Loads shader from .fs files
* @method fromFile
* @param {String} vertexUrl
* @param {String} fragmentUrl
*/

Shader.fromFile = function (vertexUrl, fragmentUrl, callback) {
    var shader;
    loadFiles([vertexUrl, fragmentUrl], function (shaderText) {
        shader = new Shader(shaderText[0], shaderText[1]);
        callback(shader);
    }, function (url) {
        console.log('Failed to download "' + url + '"');
    });
};