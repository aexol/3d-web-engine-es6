import {Vector} from "./vector";
import {Matrix} from "./matrix";
import {Aex} from "./aex";
/**
 * @module camera
 */
import gl from './gl';
/**
  * Camera class
  * @class Camera
	* @extends Aex
  * @constructor
  * @param {float} [near] near Plane
  * @param {float} [far] far Plane
  * @param {float} [angle] angle of perspective camera
  * @example
  *     world = new Scene()
  *     camera = new Camera()
  *     camera.position = new Vector(0.1, -1, -10);
*/
export class Camera extends Aex {
    set projectionMatrix(val){
        this.parentMatrix = val;
    }
    get projectionMatrix(){
        return this.parentMatrix
    };
    constructor(near, far, angle) {
        super();
        this.modelView = new Matrix();
        this._size = new Vector(1.0, 1.0, 1.0);
        this._rotation = new Vector(0.0, 0.0, 0.0);
        this._position = new Vector(0.0, 0.0, 0.0);
        this.cameraDefaultMouseController = false
        this.near = near || 0.1;
        this.far = far || 100.0;
        this.angle = angle || 45.0
        this.setPerspective()
            this.setDisplay()
            this.uniforms = {
            _gl_ProjectionMatrix:this.projectionMatrix,
            cameraNear:this.near,
            cameraFar:this.far
        }
    }

    setModelView() {
        var m = this.parentMatrix
        m = m.multiply(Matrix.scale(this.size.x, this.size.y, this.size.z));
        m = m.multiply(Matrix.rotate(this.rotation.x, 1, 0, 0));
        m = m.multiply(Matrix.rotate(this.rotation.y, 0, 1, 0));
        m = m.multiply(Matrix.rotate(this.rotation.z, 0, 0, 1));
        m = m.multiply(Matrix.translate(-this.position.x, -this.position.y, -this.position.z));
        this.modelView = m
        this.NormalMatrix = this.modelView.toInverseMat3()

    }

    /**
    * set orthographic projection for camera
    * @method setOrthoPerspective
    */
    setOrthoPerspective() {
        this.projectionMatrix = Matrix.orthoPerspective(this.angle, gl.canvas.width / gl.canvas.height, this.near, this.far)
    }

    /**
    * set perspective projection for camera
    * @method setPerspective
    */
    setPerspective() {
        this.projectionMatrix = Matrix.perspective(this.angle, gl.canvas.width / gl.canvas.height, this.near, this.far)
    }

    setToMatrix(m) {
        this.projectionMatrix = m
    }

    /**
    * put the camera at the eye point looking `e`
    * toward the center point `c`  with an up direction of `u`.
    * @method lookAt
    * @param {Vector} e Eye point
    * @param {Vector} c Center point
    * @param {Vector} u Up vector
    * @return {Matrix} Result matrix
    */
    setLookAt(e, c, u) {
        this.projectionMatrix = this.projectionMatrix.multiply(Matrix.lookAt(e,c,u))
        this.setModelView()
    }

    transforms() {
        if(this.cameraDefaultMouseController == true){
            this.onTransforms()
        }
        var m = this.modelView
        this.uniforms._gl_ProjectionMatrix = m.m
        gl.frustum.fromPerspectiveMatrix(m)
    }

    // BACKWARD COMPATIBILITY

    /**
    * Set table with screen dimensions and coordinates for 2D games
    * @method setDisplay
    */
    setDisplay() {
        var display = []
        display.height = Math.abs( 2 * this.position.z * Math.tan( (gl.angle * ( Math.PI/180))/2 ) )
        display.width = Math.abs( display.height * (gl.canvas.width/gl.canvas.height) )
        display.left = -display.width/2 - this.position.x
        display.right = display.width/2 - this.position.x
        display.top = display.height/2 - this.position.y
        display.bottom = -display.height/2 - this.position.y
        display.centerX = display.left + display.width/2
        display.centerY = display.top - display.height/2
        this.display = display
    }

    /**
    * Set camera position
    * @method setCameraPosition
    */
    setCameraPosition(vec) {
        this.position = vec
        this.setDisplay()

    }

    onTransforms() {
        this.positionBefore= this.position
        this.yaw(this.yawStep)
        this.pitch(this.pitchStep)
        this.forward(this.forwardStep)
        this.forwardStep *= this.forwardReduce
        this.side(this.sideStep)
        this.updown(this.upStep)
        this.yawStep *= 0.78
        this.pitchStep *= 0.78
        this.setModelView()
    }

    forward(f) {
        if(f == 0.0){ return true }
        var fac = -f;
        let yRad = this.rotY * (Math.PI / 180.0);
        let xRad = this.rotX * (Math.PI / 180.0);
        let yChange = fac * Math.sin(xRad);
        let zChange = fac * Math.cos(yRad);
        let xChange = -fac * Math.sin(yRad);
        this.position.y += yChange;
        this.position.z += zChange;
        this.position.x += xChange;
    }

    /**
    * DEPRECATED use setters instead
    * Move camera left & right
    * @method side
    * @param {float} f distance to move
    */
    side(f) {
        if(f == 0.0){ return true }
        var fac = -f;
        let yRad = this.rotation.y * (Math.PI / 180.0)
        let zChange = fac * Math.sin(yRad);
        let xChange = fac * Math.cos(yRad);
        this.position.z += zChange;
        this.position.x += xChange;
    }

    /**
    * DEPRECATED use setters instead
    * Move camera up & down
    * @method updown
    * @param {float} f distance to move
    */
    updown(f) {
        if(f == 0.0){ return true }
        var fac = f;
        this.position.y += fac;
    }

    /**
    * DEPRECATED use setters instead
    * Rotate on local x axis
    * @method pitch
    * @param {float} change rotation
    */
    pitch(change) {
        this.rotation.x += this.sensitivity * change;
    }

    /**
    * DEPRECATED use setters instead
    * Rotate on local y axis
    * @method pitch
    * @param {float} change rotation
    */
    yaw(change) {
        this.rotation.y += this.sensitivity * change;
    }

    /**
    * DEPRECATED use setters instead
    * Rotate on local z axis
    * @method roll
    * @param {float} change rotation
    */
    roll(change) {
        this.rotation.z += this.sensitivity * change;
    }

    /**
    * DEPRECATED use setters instead
    * Turn on standard camera mouse and WSAD operating
    * @method on
    * @param {float} factor sensitivity of camera
    */
    on(factor=0.1,sensitivity=0.3) {
        this.cameraDefaultMouseController = true
        this.forwardStep = 0.0
        this.sideStep = 0.0
        this.upStep = 0.0
        this.forwardReduce = 1.0
        this.yawStep = 0.0;
        this.pitchStep = 0.0;
        this.sensitivity = sensitivity;
        this.tempX = null;
        this.tempY = null;
        this.md = 0;
        this.factor = factor;
        var t = this;
        document.onkeydown = e => {
            var ev = e || window.event;
            if(ev.keyCode == 87) {
                t.forwardStep = t.factor
                t.forwardReduce =1.0
            }
            if(ev.keyCode == 83) {
                t.forwardStep = -t.factor
                t.forwardReduce =1.0
            }
            if(ev.keyCode == 68) {
                t.sideStep=-t.factor
            }
            if(ev.keyCode == 65) {
                t.sideStep=t.factor
            }
            if(ev.keyCode == 81) {
                t.upStep=t.factor
            }
            if(ev.keyCode == 69) {
                t.upStep=-t.factor
            }
        }
        document.onkeyup= e => {
            var ev = e || window.event;
            if(ev.keyCode == 87) {
                t.forwardReduce =0.78
            }
            if(ev.keyCode == 83) {
                t.forwardReduce =0.78
            }
            if(ev.keyCode == 68) {
                t.sideStep=0.0
            }
            if(ev.keyCode == 65) {
                t.sideStep=0.0
            }
            if(ev.keyCode == 81) {
                t.upStep=0.0
            }
            if(ev.keyCode == 69) {
                t.upStep=0.0
            }
        }
        let mouseDown = e => {
            var x = e.clientX ? e.clientX : e.x;
            var y = e.clientY ? e.clientY : e.y;
            t.tempX = x;
            t.tempY = y;
            t.mD = e.button+1;
        }
        let mouseMove = ev => {
            if(t.eC == 0 || (t.eC != 0 && t.mD != 0)) {
                if(t.tempX == null && t.tempY == null) {
                    t.tempX = ev.clientX;
                    t.tempY = ev.clientY;
                }
                var curX = ev.clientX;
                var curY = ev.clientY;
                var deltaX = (t.tempX - curX) * t.sensitivity;
                var deltaY = (t.tempY - curY) * t.sensitivity;
                t.tempX = curX;
                t.tempY = curY;
                if( t.mD ==1){
                    t.yawStep = -deltaX;
                    t.pitchStep = -deltaY;
                }
                else if(  t.mD ==2){
                    t.side(deltaX*0.05);
                    t.updown(deltaY*0.05);
                }

            }
        }
        let mouseUp = e => {
            t.mD = 0;
        }
        gl.canvas.addEventListener('mousedown', mouseDown, false);
        gl.canvas.addEventListener('mousemove', mouseMove, false);
        gl.canvas.addEventListener('mouseup', mouseUp, false);
    }
}
