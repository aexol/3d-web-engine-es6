/**
 @module Game
 */
import {Aex} from './aex';
window.animations = () => {
    for (var g in GO) {
        var go = GO[g]
        if (go) {
            for (var a in go.animations) {
                var ani = go.animations[a]
                ani.execute()
            }
        }
    }
}
let GO = []

/**
 Main class for creating objects in aexolGL engine. Takes care for connecting RenderTree objects.
 @class GameObject
 @constructor
 @param scene {Scene} scene where GameObject exists
 @example
     world = new Scene();
     gshader = new basicShader()
     skyMat = new Material({color:[0.4,0.7,1],shininess:13.0,specularWeight:0.0	})
     skyMesh = Mesh.sphere().scale(30.0,10.0,30.0)
     someLight = new Light({
            lightPosition: new Vector(1.3,4.0,-2.0),
            attenuation: 40.0,
            intensity: 1.33,
            color: [0.8,1.0,1.0]
        })
     sky = new GameObject(world,{
            shader:gshader,
            material:skyMat,
            mesh:skyMesh,
            light:someLight
        })
 */
export class GameObject {
        /**
         * Aex connected to this game object
         * @property aex
         * @type Aex
         * @example
         *     world = new Scene()
         *     game = new GameObject(world,{...})
         *     game.aex = new Aex()
         */
        set aex(val){
            if (!this._mesh) {
                throw "Specify mesh for your GameObject before connecting aex"
            }
            if (this._aex) {
                this._mesh.removeChild(this._aex)
            }
            this._aex = val;
            this._aex.setParent(this._mesh)
        }
        get aex(){
            return this._aex;
        }
        /**
         * Mesh connected to this game object
         * @property mesh
         * @type Mesh
         * @example
         *     world = new Scene()
         *     game = new GameObject(world,{...})
         *     game.mesh = Mesh.sphere()
         */
        set mesh(val){
            if (!this._material) {
                throw "Specify material for your GameObject before connecting mesh"
            }
            if (this._mesh) {
                this._material.removeChild(this._mesh)
            }
            this._mesh = val;
            this._mesh.setParent(this._material)
            this._aex = this._aex || new Aex()
            this._aex.setParent(this._mesh)
        }
        get mesh(){
            return this._mesh;
        }
        /**
         * Material connected to this game object
         * @property material
         * @type Material
         * @example
         *     world = new Scene()
         *     game = new GameObject(world,{...})
         *     game.material = new Material({})
         */
        set material(val){
            if (!this._shader) {
                throw "Specify shader for your GameObject before connecting material"
            }
            if (this._material) {
                if (this._light) {
                    this._light.removeChild(this._material)
                } else {
                    this._shader.removeChild(this._material)
                }
            }
            this._material = val;
            this._material.setParent(this._shader)
            if (this._mesh) {
                this._mesh.setParent(this._material)
            }
        }
        get material(){
            return this._material;
        }
        /**
         * Shader connected to this game object
         * @property shader
         * @type Shader
         * @example
         *     world = new Scene()
         *     game = new GameObject(world,{...})
         *     game.shader = new Shader({})
         */
        set shader(val){
            if (this._shader) {
                if (this._light) {
                    this._light.removeChild(this._shader)
                } else {
                    this.scene.removeChild(this._shader)
                }
            }
            this._shader = val;
            if (this._light) {
                this._shader.setParent(this._light)
            } else {
                this._shader.setParent(this.scene)
            }
            if (this._material) {
                this._material.setParent(this._shader)
            }
        }
        get shader(){
            return this._shader;
        }
        /**
         * Light system connected to this game object
         * @property light
         * @type Light
         * @example
         *     world = new Scene()
         *     game = new GameObject(world,{...})
         *     game.light = new Light({})
         */
        set light(val){
            if(this._light){
                this.scene.removeChild(this._light)
            }
            this._light = val;
            this._light.setParent(this.scene);
            if (this._shader) {
                this._shader.setParent(this._light)
            }
        }
        get light(){
            return this._light;
        }
        /**
         * Uniforms of object
         * @property uniforms
         * @type Dict
         * @example
         *     world = new Scene()
         *     game = new GameObject(world,{...})
         *     game.uniforms["tiling"] = [1.0,10.0]
         * You can also set uniforms of the material easily
         * @example
         *     world = new Scene()
         *     game = new GameObject(world,{...})
         *     game.uniforms["color"] = [1.0,0.0,0.0]
         *     game.uniforms["alpha"] = 0.2
         */
        set uniforms(val){
            this._aex.uniforms = val;
        }
        get uniforms(){
            return this._aex.uniforms;
        }
        /**
         * Position of object
         * @property position
         * @type Vector
         * @example
         *     world = new Scene()
         *     game = new GameObject(world,{})
         *     game.position = new Vector(1.0,2.0,3.0)
         */
        set position(val){
            this._aex.position = val
            this.setModelView()
        }
        get position(){
            return this.aex._position
        }
        /**
         * x Position of object
         * @property x
         * @type Float
         * @example
         *     world = new Scene()
         *     game = new GameObject(world,{})
         *     game.x = 20.0
         */
        set x(val){
            this._aex.position.x = val
            this.setModelView()
        }
        /**
         * y Position of object
         * @property y
         * @type Float
         * @example
         *     world = new Scene()
         *     game = new GameObject(world,{})
         *     game.y = 20.0
         */
        set y(val){
            this._aex.position.y = val
            this.setModelView()
        }
        /**
         * z Position of object
         * @property z
         * @type Float
         * @example
         *     world = new Scene()
         *     game = new GameObject(world,{})
         *     game.z = 20.0
         */
        set z(val){
            this._aex.position.z = val
            this.setModelView()
        }
        get x(){
            return this.aex._position.x
        }
        get y(){
            return this.aex._position.y
        }
        get z(){
            return this.aex._position.z
        }
        /**
         * Rotation of object
         * @property rotation
         * @type Vector
         * @example
         *     world = new Scene()
         *     game = new GameObject(world,{})
         *     game.rotation = new Vector(0.0,90.0,0.0)
         */
        set rotation(val){
            this._aex.rotation = val
            this.setModelView()
        }
        get rotation(){
            return this.aex._rotation
        }

        /**
         * x Rotation of object
         * @property rotX
         * @type Float
         * @example
         *     world = new Scene()
         *     game = new GameObject(world,{})
         *     game.rotX = 20.0
         */
        set rotX(val){
            this._aex.rotation.x = val
            this.setModelView()
        }
        /**
         * y Rotation of object
         * @property rotY
         * @type Float
         * @example
         *     world = new Scene()
         *     game = new GameObject(world,{})
         *     game.rotY = 20.0
         */
        set rotY(val){
            this._aex.rotation.y = val;
            this.setModelView()
        }
        /**
         * z Rotation of object
         * @property rotZ
         * @type Float
         * @example
         *     world = new Scene()
         *     game = new GameObject(world,{})
         *     game.rotZ = 20.0
         */
        set rotZ(val){
            this._aex.rotation.z = val
            this.setModelView()
        }
        get rotX(){
            return this.aex._rotation.x
        }
        get rotY(){
            return this.aex._rotation.y
        }
        get rotZ(){
            return this.aex._rotation.z
        }

        set size(val){
            this._aex.size = val;
            this.setModelView()
        }
        get size(){
            return this.aex._size
        }
        /**
         * x scale of object
         * @property scaleX
         * @type Float
         * @example
         *     world = new Scene()
         *     game = new GameObject(world,{})
         *     game.scaleX = 2.0
         */
        set scaleX(val){
            this._aex.size.x = val;
            this.setModelView()
        }
        /**
         * y scale of object
         * @property scaleY
         * @type Float
         * @example
         *     world = new Scene()
         *     game = new GameObject(world,{})
         *     game.scaleY = 2.0
         */
        set scaleY(val){
            this._aex.size.y = val
            this.setModelView()
        }
        /**
         * z scale of object
         * @property scaleZ
         * @type Float
         * @example
         *     world = new Scene()
         *     game = new GameObject(world,{})
         *     game.scaleZ = 2.0
         */
        set scaleZ(val){
            this._aex.size.z = val
            this.setModelView()
        }
        get scaleX(){
            return this.aex._size.x
        }
        get scaleY(){
            return this.aex._size.y
        }
        get scaleZ(){
            return this.aex._size.z
        }
    constructor(scene, options) {
        this.scene = scene
        if (options.light) {
            this.light = options.light
        }
        if (options.shader) {
            this.shader = options.shader
        }
        if (options.material) {
            this.material = options.material
        }
        if (options.mesh) {
            this.mesh = options.mesh
            this.aex = options.aex || new Aex()
            this.setModelView()
        }
        this.animations = []
        if (GO.indexOf(this) == -1) {
            GO.push(this)
        }
    }

    /**
     * Replace modelView in RenderNode
     * @method setModelView
     */
    setModelView() {
        this.aex.setModelView()
    }

    /**
     * Scale the object
     * @method scale
     * @param {float} x  Scale in x axis
     * @param {float} y  Scale in y axis
     * @param {float} z  Scale in z axis
     * @param {boolean} r  Scale relative to actual scale
     * @example
     *     world = new Scene()
     *     game = new GameObject(world,{})
     *     //absolute scale
     *     game.scale(1.2,1.2,1.3)
     *     //relative scale
     *     game.scale(0,1,0,1)
     */
    scale(x, y, z, r) {
        this.aex.scale(x,y,z,r)
        return this
    }

    /**
     * Scale the object uniform in all axes
     * @method scaleUniform
     * @param {float} f  Scale factor
     * @param {boolean} r  Scale relative to actual scale
     */
    scaleUniform(f, r) {
        this.aex.scaleUniform(f,r)
        return this
    }

    /**
     * Move the object
     * @method move
     * @param {float} x  Move in x axis
     * @param {float} y  Move in y axis
     * @param {float} z  Move in z axis
     * @param {boolean} r  Move relative to actual position
     * @example
     *     world = new Scene()
     *     game = new GameObject(world,{})
     *     //absolute move
     *     game.move(0,1,0)
     *     //relative move
     *     game.move(0,1,0,1)
     */
    move(x, y, z, r) {
        this.aex.move(x,y,z,r)
        return this
    }

    /**
     * Rotate the object (degrees)
     * @method rotate
     * @param {float} x  Rotate in x axis
     * @param {float} y  Rotate in y axis
     * @param {float} z  Rotate in z axis
     * @param {boolean} r  Rotate relative to actual rotation
     * @example
     *     world = new Scene()
     *     game = new GameObject(world,{})
     *     //absolute rotate
     *     game.rotate(0,1,0)
     *     //relative rotate
     *     game.rotate(0,1,0,1)
     */
    rotate(x, y, z, r) {
        this.aex.rotate(x,y,z,r);
        return this
    }

    rotateAroundPoint(center, x, y, z) {
        this.aex.rotateAroundPoint(center,x,y,z);
        return this
    }

    /**
     * Adds animation to GameObject
     * @method addAnimation
     * @param {Animation} animation to add to animations.
     */
    addAnimation(animation) {
        this.animations.push(animation)
        return this
    }

    /**
     * Removes GameObject
     * @method remove
     */
    remove() {
        if (this.aex) {
            this.aex.remove()
        }
        GO.splice(GO.indexOf(this), 1);
    }
}
