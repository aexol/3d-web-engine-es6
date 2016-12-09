'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Pivot = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _gameobject = require('./gameobject');

var _aex = require('./aex');

var _vector = require('./vector');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Main Class for constructing groups and hierarchy
 * @class Pivot
 * @extends Aex
 * @constructor
 * @example
 *      wheel = new Pivot()
 *      wheel2 = new Pivot()
 *      axis = new Pivot()
 *      wheel.add(rim).add(tire)
 *      wheel2.add(rim2).add(tire2)
 *      rear_axis.add(wheel).add(wheel2)
 */
var Pivot = exports.Pivot = function (_Aex) {
    _inherits(Pivot, _Aex);

    function Pivot() {
        _classCallCheck(this, Pivot);

        var _this = _possibleConstructorReturn(this, (Pivot.__proto__ || Object.getPrototypeOf(Pivot)).call(this));

        _this.group = [];
        return _this;
    }

    /**
     * Method to add children Aex objects to
     * @method add
     * @param aex
     * @returns {Pivot}
     */


    _createClass(Pivot, [{
        key: 'add',
        value: function add(aex) {
            if (aex instanceof _gameobject.GameObject) {
                aex = aex.aex;
            }
            aex.parentMatrix = this.modelView;
            aex.setModelView();
            this.group.push(aex);
            return this;
        }

        /**
         * Sets modelview of pivot and its children items
         * @method setModelView
         * @returns {Pivot}
         */

    }, {
        key: 'setModelView',
        value: function setModelView() {
            _aex.Aex.prototype.setModelView.apply(this);
            for (var a in this.group) {
                var aex = this.group[a];
                aex.parentMatrix = this.modelView;
                aex.setModelView();
            }
            return this;
        }

        /**
         * Sets pivot to desired Vector in 3d space without moving the object
         * @method setPivot
         * @param v
         * @returns {Pivot}
         */

    }, {
        key: 'setPivot',
        value: function setPivot(v) {
            var rv = this.position.subtract(v);
            for (var a in this.group) {
                var aex = this.group[a];
                aex.move(rv.x, rv.y, rv.z, 1);
            }
            this.position = v;
            this.setModelView();
            return this;
        }

        /**
         * Sets pivot to center of contained objects
         * @method setPivotToCenter
         * @returns {Pivot}
         */

    }, {
        key: 'setPivotToCenter',
        value: function setPivotToCenter() {
            var v = new _vector.Vector();
            var d = 0;
            for (var a in this.group) {
                var aex = this.group[a];
                v = v.add(aex.position);
                d += 1;
            }
            if (d > 0) {
                v = v.divide(d);
                this.setPivot(v);
            }
            return this;
        }
    }]);

    return Pivot;
}(_aex.Aex);