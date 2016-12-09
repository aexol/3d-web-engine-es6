"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * MObject class
 * @class MObject
 * @constructor
 * @param {MObject} parent of MObject object<br>
 */
var MObject = exports.MObject = function () {
    function MObject(parent) {
        _classCallCheck(this, MObject);

        this.children = [];
        if (parent) {
            this.setParent(parent);
        }
    }

    /**
     Sets parent on MObject and unbinds current parent in RenderTree
     @method addChilds
     @param mobject {MObject} mobject object to add as a child to RenderTree
     */


    _createClass(MObject, [{
        key: "addChilds",
        value: function addChilds(mobject) {
            if (this.children.indexOf(mobject) == -1) {
                this.children.push(mobject);
            }
        }

        /**
         Sets parent on MObject and unbinds current parent in RenderTree.
         Usually this is done inside GameObject, but you have also possibility
         to construct RenderTree by yourself.
         @method setParent
         @param parent {MObject} parent object
         @example
         world = new Scene()
         gshader = new basicShader()
         someMaterial = new Material({})
         gshader.setParent(world)
         someMaterial.setParent(world)
         */

    }, {
        key: "setParent",
        value: function setParent(parent) {
            if (this.parent != null) {
                this.parent.removeChild(this);
            }
            this.parent = parent;
            parent.addChilds(this);
        }
    }, {
        key: "removeChild",
        value: function removeChild(child) {
            this.children.splice(this.children.indexOf(child), 1);
        }

        /**
         Removes MObject from RenderTree
         @method remove
         */

    }, {
        key: "remove",
        value: function remove() {
            this.parent.removeChild(this);
        }
    }]);

    return MObject;
}();