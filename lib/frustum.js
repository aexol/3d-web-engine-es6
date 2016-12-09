'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Frustum = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vector = require('./vector');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
  * Frustum class
  * @class Frustum
  * @constructor
*/
var Frustum = exports.Frustum = function () {
    function Frustum() {
        _classCallCheck(this, Frustum);

        this.planes = new Array(6);
        this.corners = new Array(8);
    }

    _createClass(Frustum, [{
        key: 'fromPerspectiveMatrix',
        value: function fromPerspectiveMatrix(matrix) {
            var mat = matrix.m;
            this.planes[0] = new _vector.Vector4(mat[8] + mat[12], mat[9] + mat[13], mat[10] + mat[14], mat[11] + mat[15]);
            this.planes[1] = new _vector.Vector4(-mat[8] + mat[12], -mat[9] + mat[13], -mat[10] + mat[14], -mat[11] + mat[15]);
            this.planes[2] = new _vector.Vector4(mat[4] + mat[12], mat[5] + mat[13], mat[6] + mat[14], mat[7] + mat[15]);
            this.planes[3] = new _vector.Vector4(-mat[4] + mat[12], -mat[5] + mat[13], -mat[6] + mat[14], -mat[7] + mat[15]);
            this.planes[4] = new _vector.Vector4(mat[0] + mat[12], mat[1] + mat[13], mat[2] + mat[14], mat[3] + mat[15]);
            this.planes[5] = new _vector.Vector4(-mat[0] + mat[12], -mat[1] + mat[13], -mat[2] + mat[14], -mat[3] + mat[15]);
        }
    }, {
        key: 'boxInFrustum',
        value: function boxInFrustum(box) {
            for (var p in this.planes) {
                var checkPlane = this.planes[p];
                var out = 0;
                out += checkPlane.dot(new _vector.Vector4(box.min.x, box.min.y, box.min.z, 1.0)) < 0.0 ? 1 : 0;
                if (out == 0) continue;
                out += checkPlane.dot(new _vector.Vector4(box.max.x, box.min.y, box.min.z, 1.0)) < 0.0 ? 1 : 0;
                if (out == 1) continue;
                out += checkPlane.dot(new _vector.Vector4(box.min.x, box.max.y, box.min.z, 1.0)) < 0.0 ? 1 : 0;
                if (out == 2) continue;
                out += checkPlane.dot(new _vector.Vector4(box.max.x, box.max.y, box.min.z, 1.0)) < 0.0 ? 1 : 0;
                if (out == 3) continue;
                out += checkPlane.dot(new _vector.Vector4(box.min.x, box.min.y, box.max.z, 1.0)) < 0.0 ? 1 : 0;
                if (out == 4) continue;
                out += checkPlane.dot(new _vector.Vector4(box.max.x, box.min.y, box.max.z, 1.0)) < 0.0 ? 1 : 0;
                if (out == 5) continue;
                out += checkPlane.dot(new _vector.Vector4(box.min.x, box.max.y, box.max.z, 1.0)) < 0.0 ? 1 : 0;
                if (out == 6) continue;
                out += checkPlane.dot(new _vector.Vector4(box.max.x, box.max.y, box.max.z, 1.0)) < 0.0 ? 1 : 0;
                if (out == 8) return false;
            }
            return true;
        }
    }, {
        key: 'sphereInFrustum',
        value: function sphereInFrustum(sphere) {
            for (var p in this.planes) {
                var checkPlane = this.planes[p];
                var sc = sphere.center;
                var fDistance = checkPlane.x * sc.x + checkPlane.y * sc.y + checkPlane.z * sc.z + checkPlane.d;
                if (fDistance < -sphere.radius) {
                    return false;
                }
            }
            return true;
        }
    }]);

    return Frustum;
}();