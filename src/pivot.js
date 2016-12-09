import {GameObject} from './gameobject';
import {Aex} from './aex';
import {Vector} from './vector';
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
export class Pivot extends Aex {
    constructor() {
        super()
        this.group = []
    }

    /**
     * Method to add children Aex objects to
     * @method add
     * @param aex
     * @returns {Pivot}
     */
    add(aex) {
        if(aex instanceof GameObject){
            aex = aex.aex
        }
        aex.parentMatrix = this.modelView
        aex.setModelView()
        this.group.push(aex)
        return this
    }

    /**
     * Sets modelview of pivot and its children items
     * @method setModelView
     * @returns {Pivot}
     */
    setModelView() {
        Aex.prototype.setModelView.apply(this)
        for(var a in this.group){
            var aex = this.group[a];
            aex.parentMatrix = this.modelView
            aex.setModelView()
        }
        return this
    }

    /**
     * Sets pivot to desired Vector in 3d space without moving the object
     * @method setPivot
     * @param v
     * @returns {Pivot}
     */
    setPivot(v) {
        var rv = this.position.subtract(v)
        for(var a in this.group){
            var aex = this.group[a];
            aex.move(rv.x,rv.y,rv.z,1)
        }
        this.position = v
        this.setModelView()
        return this
    }

    /**
     * Sets pivot to center of contained objects
     * @method setPivotToCenter
     * @returns {Pivot}
     */
    setPivotToCenter() {
        var v = new Vector()
        var d = 0
        for(var a in this.group){
            var aex = this.group[a];
            v= v.add(aex.position)
            d+=1;
        }
        if(d>0){
            v = v.divide(d)
            this.setPivot(v)
        }
        return this
    }
}