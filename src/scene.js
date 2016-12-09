import {MObject} from './mobject';
import gl from './gl';
/**
 * Scene class
 * @class Scene
 * @constructor
 * @example
 *      var world = new Scene()
 */
export class Scene extends MObject {
    constructor() {
        super()
        this._globalShaderInit = 0
        this._init = false
    }

    init() {
        // canvasInit()
    }

    /**
     * Traverse all items
     * @private
     * @method traverse
     */
    traverse() {
        function stepDown(tt) {
            if (tt.children.length > 0) {
                for (var child in tt.children) {
                    stepDown(tt.children[child])
                }
            }
        }

        stepDown(this)
    }

    /**
     * Draw all items inside Scene with connected camera
     * @method draw
     * @param {Camera} [camera] showing drawed items
     */
    draw(camera) {
        if (!this._init) {
            this.init()
            this._init = true
        }
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        var dic = {}
        if (camera) {
                camera.transforms()
                dic = camera.uniforms
            }
        for (var child in this.children) {
            gl.frame += 1
            this.children[child].draw(dic)
        }
    }

    /**
     * Draw all items inside Scene with connected camera
     * @method drawOverride
     * @param {Shader} [shader] Shader to override for all items
     * @param {Dict} uniforms to pass to shader
     */
    drawOverride(shader, uniforms) {
        shader.useProgram()
        shader.uniforms(uniforms);
        shader.uniformsSet = {}
        meshTable = []
        function checkDown(node) {
            if (node instanceof Mesh) {
                meshTable.push(node)
            }
            else {
                if (node.children.length > 0) {
                    for (var c in node.children) {
                        checkDown(node.children[c])
                    }
                }
            }
        }

        checkDown(this)
        gl.extradata = meshTable
        for (var c in meshTable) {
            meshTable[c].draw()
        }
    }
}
