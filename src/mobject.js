/**
 * MObject class
 * @class MObject
 * @constructor
 * @param {MObject} parent of MObject object<br>
 */
export class MObject {
    constructor(parent) {
        this.children = []
        if (parent) {
            this.setParent(parent)
        }
    }

    /**
     Sets parent on MObject and unbinds current parent in RenderTree
     @method addChilds
     @param mobject {MObject} mobject object to add as a child to RenderTree
     */
    addChilds(mobject) {
        if (this.children.indexOf(mobject) == -1) {
            this.children.push(mobject)
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
    setParent(parent) {
        if (this.parent != null) {
            this.parent.removeChild(this)
        }
        this.parent = parent
        parent.addChilds(this)
    }

    removeChild(child) {
        this.children.splice(this.children.indexOf(child), 1)
    }

    /**
     Removes MObject from RenderTree
     @method remove
     */
    remove() {
        this.parent.removeChild(this)
    }
}