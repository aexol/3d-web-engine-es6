import {AexolGL} from './aexolgl';
import {Scene} from './scene';
import {Aex} from './aex';
import {GameObject} from './gameobject';
import {Texture} from './texture';
import {Camera} from './camera';
import {Material} from './material';
import {basicShader} from './basic_shaders';
import {Mesh} from './mesh';
import {Light} from './light';
import {Vector} from './vector';
export default class StartGL{
    constructor(){
    }
    setup(){
    }
    logic(){
    }
    draw(){
    }
    run(){
        this.app = new AexolGL({
            setup:this.setup,
            logic:this.logic,
            draw:this.draw
        })
    }
}