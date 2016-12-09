'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AexolGL = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _matrix = require('./matrix');

var _frustum = require('./frustum');

var _resource = require('./resource');

var _gl = require('./gl');

var _gl2 = _interopRequireDefault(_gl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var aexolGL = function () {
  function aexolGL(options) {
    _classCallCheck(this, aexolGL);

    this.settings = {};
    _gl2.default.projectionMatrix = new _matrix.Matrix();
    _gl2.default.uniformsSet = {};
    _gl2.default.frustum = new _frustum.Frustum();
    _gl2.default.angle = 45;
    _gl2.default.pause = false;
    this.matrix = null;
    _gl2.default.nTexture = 0;
    _gl2.default.cbTexture = 0;
    _gl2.default.nShader = 1;

    _gl2.default.loadedElements = {};
    _gl2.default.progress = 0.0;

    _gl2.default.MAX_NUMBER_OF_TEXTURES = 8;

    _gl2.default.frame = 0;
    /* End of GL overloads */
    var __error = function __error(text) {
      if (window.handleError) window.handleError(text);
      throw text;
    };
  }

  /**
   * Inits the framebuffer
   * @method initGL
   */


  _createClass(aexolGL, [{
    key: 'initGL',
    value: function initGL() {
      _gl2.default.viewport(0, 0, _gl2.default.canvas.width, _gl2.default.canvas.height);
      _gl2.default.clearColor(0.0, 0.0, 0.0, 1);
      _gl2.default.clear(_gl2.default.COLOR_BUFFER_BIT | _gl2.default.DEPTH_BUFFER_BIT);
      _gl2.default.enable(_gl2.default.DEPTH_TEST);
      _gl2.default.enable(_gl2.default.BLEND);
      _gl2.default.blendFunc(_gl2.default.SRC_ALPHA, _gl2.default.ONE_MINUS_SRC_ALPHA);
    }

    /**
     * Start the engine
     * @method init
     */

  }, {
    key: 'init',
    value: function init() {
      var t = this;
      this.initDefaultPreloader();

      function checkIfElementsAreLoaded() {
        var le = _resource.Resource.loadedElements;
        var allLoaded = Object.keys(le).length;
        if (allLoaded == 0) {
          t.defaultPreload(100);
          t.executeInit();
        } else {
          var ready = 0;
          for (var l in le) {
            ready += le[l];
          }
          var percentage = ready / allLoaded;
          if (percentage == 1.0) {
            t.defaultPreload((percentage * 100).toFixed(2));
            t.executeInit();
          } else {
            t.defaultPreload((percentage * 100).toFixed(2));
            setTimeout(checkIfElementsAreLoaded, 10);
          }
        }
      }

      setTimeout(checkIfElementsAreLoaded, 10);
    }
  }, {
    key: 'initV2',
    value: function initV2() {
      var t = this;
      this.initDefaultPreloader();

      function checkIfElementsAreLoaded() {
        var le = _resource.Resource.loadedElements;
        var allLoaded = Object.keys(le).length;
        if (allLoaded == 0) {
          t.defaultPreload(100);
          t.executeInitV2();
        } else {
          var ready = 0;
          for (var l in le) {
            ready += le[l];
          }
          var percentage = ready / allLoaded;
          if (percentage == 1.0) {
            t.defaultPreload((percentage * 100).toFixed(2));
            t.executeInitV2();
          } else {
            t.defaultPreload((percentage * 100).toFixed(2));
            setTimeout(checkIfElementsAreLoaded, 10);
          }
        }
      }

      setTimeout(checkIfElementsAreLoaded, 10);
    }
  }, {
    key: 'executeInitV2',
    value: function executeInitV2() {
      var vendors = ['ms', 'moz', 'webkit', 'o'];
      var that = this;
      for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
      }
      if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback, element) {
          var currTime = Date.now(),
              timeToCall = Math.max(0, 16 - (currTime - lastTime));
          var id = window.setTimeout(function () {
            callback(currTime + timeToCall);
          }, timeToCall);
          lastTime = currTime + timeToCall;
          return id;
        };
      }
      if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (id) {
          clearTimeout(id);
        };
      }
      _gl2.default.enable(_gl2.default.DEPTH_TEST);
      if (that.animframe) {
        window.cancelAnimationFrame(that.animframe);
      }
      (function animloop() {
        if (_gl2.default.pause == false) {
          that.settings.logic();
          that.settings.draw();
          _gl2.default.frame += 1;
        }
        that.animframe = window.requestAnimationFrame(animloop, _gl2.default.canvas);
      })();
    }
  }, {
    key: 'executeInit',
    value: function executeInit() {
      var lastTime = 0;
      var vendors = ['ms', 'moz', 'webkit', 'o'];

      for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {

        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
      }

      if (!window.requestAnimationFrame) {

        window.requestAnimationFrame = function (callback, element) {

          var currTime = Date.now(),
              timeToCall = Math.max(0, 16 - (currTime - lastTime));
          var id = window.setTimeout(function () {
            callback(currTime + timeToCall);
          }, timeToCall);
          lastTime = currTime + timeToCall;
          return id;
        };
      }

      if (!window.cancelAnimationFrame) {

        window.cancelAnimationFrame = function (id) {
          clearTimeout(id);
        };
      }
      var draw = function draw() {
        _gl2.default.viewport(0, 0, 800, 800);
      };
      _gl2.default.enable(_gl2.default.DEPTH_TEST);
      if (window.draw) {
        if (_gl2.default.animframe) {
          window.cancelAnimationFrame(_gl2.default.animframe);
        }
        (function animloop() {
          _gl2.default.GLTD = "";
          _gl2.default.GLTD = _gl2.default.GLTD + _gl2.default.GLT;
          _gl2.default.GLT = "";
          if (_gl2.default.pause == false) {
            if (window.logic) {
              window.logic();
            }
            window.animations();
            window.draw();
            _gl2.default.frame += 1;
          }
          _gl2.default.animframe = window.requestAnimationFrame(animloop, _gl2.default.canvas);
        })();
      } else {
        draw();
      }
    }
  }, {
    key: 'initDefaultPreloader',
    value: function initDefaultPreloader() {
      if (!window.progress && !this.settings.progress) {
        this.progresstext = document.createElement("div");
        this.progresstext.style.color = "white";
        this.progresstext.style.zIndex = 999;
        this.progresstext.style.letterSpacing = "2px";
        this.progresstext.style.fontVariant = "small-caps";
        this.progresstext.style.textAlign = "center";
        this.progresstext.style.position = "absolute";
        this.progresstext.style.lineHeight = "25px";
        this.progresstext.style.marginLeft = _gl2.default.canvas.offsetLeft + _gl2.default.canvas.width / 2.0 - 71 + "px";
        this.progresstext.style.marginTop = _gl2.default.canvas.height / 2.0 - 12 + "px";
        _gl2.default.canvas.parentNode.insertBefore(this.progresstext, _gl2.default.canvas);
      }
    }
  }, {
    key: 'defaultPreload',
    value: function defaultPreload(e) {
      if (!this.settings.progress) {
        this.progresstext.innerHTML = "aexolgl is<br>loading " + e + "%";
        if (e == 100) {
          this.progresstext.remove();
        }
      } else {
        if (!window.progress) {
          this.settings.progress(e);
        } else {
          window.progress;
        }
      }
    }
  }]);

  return aexolGL;
}();

var AexolGL = exports.AexolGL = function AexolGL(options) {
  var lastTime = 0;
  var agl = new aexolGL();
  agl.settings = {
    setup: function setup() {},
    logic: function logic() {},
    draw: function draw() {}
  };
  for (var o in options) {
    if (agl.settings.hasOwnProperty(o)) {
      agl.settings[o] = options[o];
    }
  }
  agl.settings.setup();
  agl.initGL();
  agl.initV2();
  return agl;
};