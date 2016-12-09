import {MObject} from './mobject';
import {Vector} from './vector';
import {Matrix} from './matrix';
import gl from './gl';
/**
 * Aex class - Aex objects hold the modelView `Matrix`
 * @class Aex
 * @extends MObject
 * @constructor
 * @param [options={}] {Dict} Dictionary of options when creating Aex object
 * @return {Aex} Returns Aex Object
 * @example
 *      var aex = new Aex({
 *          uniforms:{
 *              tiling:[2.0,2.0]
 *          }
 *      })
 */
export class Aex extends MObject {
        hidden = false;
        get aabb(){
            var ab = this.parent.aabb;
            var abb = {
                min: ab.min.multiply(this.size).add(this.position),
                max: ab.max.multiply(this.size).add(this.position)
            }
            return abb
        }
        get sphere(){
            var sphere = this.parent.sphere;
            var sp = {
                radius: sphere.radius * this.size.max(),
                center: sphere.center.add(this.position)
            }
            return sp
        }
        /**
         * Position of object
         * @property position
         * @type Vector
         * @example
         *     world = new Scene()
         *     game = new Aex()
         *     game.position = new Vector(1.0,2.0,3.0)
         */
        set position(val){
            this._position = val
        }
        get position(){
            return this._position
        }
        /**
         * x Position of object
         * @property x
         * @type Float
         * @example
         *     world = new Scene()
         *     game = new Aex()
         *     game.x = 20.0
         */
        set x(val){
            this._position.x = val
            this.setModelView()
        }
        /**
         * y Position of object
         * @property y
         * @type Float
         * @example
         *     world = new Scene()
         *     game = new Aex()
         *     game.y = 20.0
         */
        set y(val){
            this._position.y = val
            this.setModelView()
        }
        /**
         * z Position of object
         * @property z
         * @type Float
         * @example
         *     world = new Scene()
         *     game = new Aex()
         *     game.z = 20.0
         */
        set z(val){
            this._position.z = val
            this.setModelView()
        }
        get x(){
            return this._position.x
        }
        get y(){
            return this._position.y
        }
        get z(){
            return this._position.z
        }
        /**
         * Rotation of object
         * @property rotation
         * @type Vector
         * @example
         *     world = new Scene()
         *     game = new Aex()
         *     game.rotation = new Vector(0.0,90.0,0.0)
         */
        set rotation(val){
            this._rotation = val
        }
        get rotation(){
            return this._rotation
        }

        /**
         * x Rotation of object
         * @property rotX
         * @type Float
         * @example
         *     world = new Scene()
         *     game = new Aex()
         *     game.rotX = 20.0
         */
        set rotX(val){
            this._rotation.x = val
            this.setModelView()
        }
        /**
         * y Rotation of object
         * @property rotY
         * @type Float
         * @example
         *     world = new Scene()
         *     game = new Aex()
         *     game.rotY = 20.0
         */
        set rotY(val){
            this._rotation.y = val;
            this.setModelView()
        }
        /**
         * z Rotation of object
         * @property rotZ
         * @type Float
         * @example
         *     world = new Scene()
         *     game = new Aex()
         *     game.rotZ = 20.0
         */
        set rotZ(val){
            this._rotation.z = val
            this.setModelView()
        }
        get rotX(){
            return this._rotation.x
        }
        get rotY(){
            return this._rotation.y
        }
        get rotZ(){
            return this._rotation.z
        }

        set size(val){
            this._size = val;
        }
        get size(){
            return this._size
        }
        /**
         * x scale of object
         * @property scaleX
         * @type Float
         * @example
         *     world = new Scene()
         *     game = new Aex()
         *     game.scaleX = 2.0
         */
        set scaleX(val){
            this._size.x = val;
            this.setModelView()
        }
        /**
         * y scale of object
         * @property scaleY
         * @type Float
         * @example
         *     world = new Scene()
         *     game = new Aex()
         *     game.scaleY = 2.0
         */
        set scaleY(val){
            this._size.y = val
            this.setModelView()
        }
        /**
         * z scale of object
         * @property scaleZ
         * @type Float
         * @example
         *     world = new Scene()
         *     game = new Aex()
         *     game.scaleZ = 2.0
         */
        set scaleZ(val){
            this._size.z = val
            this.setModelView()
        }
        get scaleX(){
            return this._size.x
        }
        get scaleY(){
            return this._size.y
        }
        get scaleZ(){
            return this._size.z
        }
    constructor(options) {
        super()
        this.texture = null;
        this.wireframe = 0;
        this.modelView = new Matrix();
        this._size = new Vector(1.0, 1.0, 1.0);
        this._rotation = new Vector(0.0, 0.0, 0.0);
        this._position = new Vector(0.0, 0.0, 0.0);
        this.parentMatrix = new Matrix()
        this.uniforms = {tiling: [1.0, 1.0], material: {}}
        this.aTextures = {}
        this.uniformsDone = 0
        for (var i in options) {
            var o = options[i];
            this[i] = o;
        }
    }

    getAABB() {
        return this.parent.getAABB()
    }

    /**
     * Force set shader uniforms
     * @method setUniforms
     * @example
     *      var aex = new Aex()
     *      aex.setUniforms()
     */
    setUniforms() {
        this.uniforms._gl_ModelViewMatrix = this.modelView.m
        this.uniforms.NormalMatrix = this.NormalMatrix.m
        gl.currentShader.uniforms(this.uniforms);
    }

    /**
     * Centers pivot of an Aex to parent Mesh
     * @method centerPivot
     */
    centerPivot() {
        if (this.parent) {
            var cc = this.parent.getCenter();
            var ccN  = cc.negative()
            this.parent.move(ccN.x,ccN.y,ccN.z);
            this.move(cc.x,cc.y,cc.z);
        }
        return this
    }

    /**
     * Move object
     * @method move
     * @param x - x axis
     * @param y - y axis
     * @param z - z axis
     * @param r - relative transform
     * @example
     *      var aex = new Aex()
     *      aex.move(0,1,2)
     */
    move(x, y, z, r) {
        if (r) {
            this.position = this.position.add(new Vector(x, y, z))
        }
        else {
            this.position = new Vector(x, y, z)
        }
        this.setModelView()
    }

    /**
     * Rotate object
     * @method rotate
     * @param x - angle around x axis
     * @param y - angle around y axis
     * @param z - angle around z axis
     * @param r - relative transform
     * @example
     *      var aex = new Aex()
     *      aex.rotate(0,1,2)
     */
    rotate(x, y, z, r) {
        if (r) {
            this.rotation = this.rotation.add(new Vector(x, y, z))
        }
        else {
            this.rotation = new Vector(x, y, z)
        }
        this.setModelView()
    }

    /**
     * Scale object
     * @method scale
     * @param x - x axis
     * @param y - y axis
     * @param z - z axis
     * @param r - relative transform
     * @example
     *      var aex = new Aex()
     *      aex.scale(0,1,2)
     */
    scale(x, y, z, r) {
        if (r) {
            this.size = this.size.add(new Vector(x, y, z))
        }
        else {
            this.size = new Vector(x, y, z)
        }
        this.setModelView()
    }

    /**
     * Rotate object around point
     * @method rotateAroundPoint
     * @param {Vector} center pivot point location
     * @param angle - rotation in degrees
     * @param x - usage of x axis
     * @param y -  usage of y axis
     * @param z -  usage of z axis
     * @example
     *      var aex = new Aex()
     *      aex.rotateAroundPoint(new Vector(0,1,1),90,0,1,0)
     */
    rotateAroundPoint(center, x, y, z) {
        var vNewPosition = new Vector();
        var angle = Math.max(Math.abs(x),Math.abs(y),Math.abs(z));

        var xx = x/angle;
        var yy = y/angle;
        var zz = z/angle;
        var vPos = this.position.subtract(center);
        // Calculate the sine and cosine of the angle once
        var cosTheta = Math.cos(angle * Math.degToRad);
        var sinTheta = Math.sin(angle * Math.degToRad);

        // Find the new x position for the new rotated point
        vNewPosition.x = (cosTheta + (1 - cosTheta) * xx * xx) * vPos.x;
        vNewPosition.x += ((1 - cosTheta) * xx * yy - zz * sinTheta) * vPos.y;
        vNewPosition.x += ((1 - cosTheta) * xx * zz + yy * sinTheta) * vPos.z;

        // Find the new y position for the new rotated point
        vNewPosition.y = ((1 - cosTheta) * xx * yy + zz * sinTheta) * vPos.x;
        vNewPosition.y += (cosTheta + (1 - cosTheta) * yy * yy) * vPos.y;
        vNewPosition.y += ((1 - cosTheta) * yy * zz - xx * sinTheta) * vPos.z;

        // Find the new z position for the new rotated point
        vNewPosition.z = ((1 - cosTheta) * xx * zz - yy * sinTheta) * vPos.x;
        vNewPosition.z += ((1 - cosTheta) * yy * zz + xx * sinTheta) * vPos.y;
        vNewPosition.z += (cosTheta + (1 - cosTheta) * zz * zz) * vPos.z;

        gl.estra = [vPos,x,y,z,this.position,vNewPosition,cosTheta,sinTheta,angle]
        this.position = vNewPosition;
        this.rotate(x,y,z,1);
        return this
    }

    /**
     * Sets aex modelview and Normal matrix. Internal function done after transformations as move, rotate etc..
     * @internal
     * @method setModelView
     */
    setModelView() {
        var m = this.parentMatrix
        m = m.multiply(Matrix.scale(this.size.x, this.size.y, this.size.z));
        m = m.multiply(Matrix.rotate(this.rotation.x, 1, 0, 0));
        m = m.multiply(Matrix.rotate(this.rotation.y, 0, 1, 0));
        m = m.multiply(Matrix.rotate(this.rotation.z, 0, 0, 1));
        m = m.multiply(Matrix.translate(this.position.x, this.position.y, this.position.z));
        this.modelView = m
        this.NormalMatrix = this.modelView.toInverseMat3()

    }

    /**
     * Draw the Aex inside draw function of your Scene
     * @internal
     * @method draw
     */
    draw(uniforms) {
        if( !this.hidden ){
            if (gl.frustum.sphereInFrustum(this.sphere) == true) {
                if (uniforms) {
                    gl.currentShader.uniforms(uniforms)
                }
                this.setUniforms()
                var triangleBL = gl.indexBuffers.triangles.buffer.length
                gl.drawElements(gl.TRIANGLES, triangleBL, gl.UNSIGNED_SHORT, 0);
                for (var child in this.children) {
                    this.children[child].draw()
                }
            }
        }
    }
}