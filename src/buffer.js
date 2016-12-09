import gl from './gl';
/**
 * @module Buffer
 */
/**
  * Indexer class (internal)
  * @class Indexer
  * @constructor
*/
export class Indexer {
    constructor() {
        this.unique = [];
        this.indices = [];
        this.map = {};
    }

    /** 
    * add
    * @method add
    * @param {obj} obj
    */
    add(obj) {
        var key = JSON.stringify(obj);
        if(!( key in this.map)) {
            this.map[key] = this.unique.length;
            this.unique.push(obj);
        }
        return this.map[key];
    }
}

/**
  * Buffer class (internal)
  * @class Buffer
  * @constructor
*/
export class Buffer {
    constructor(target, type) {
        this.buffer = null;
        this.target = target;
        this.type = type;
        this.data = [];
    }

    /** 
    * compile
    * @method compile
    * @param {type} type Type of data 
    */
    compile(type) {
        var data = new Array();
        for(var i = 0, chunk = 10000; i < this.data.length; i += chunk) {
            data = Array.prototype.concat.apply(data, this.data.slice(i, i + chunk));
        }
            var spacing = this.data.length ? data.length / this.data.length : 0;
            if (spacing != Math.round(spacing)) throw 'buffer elements not of consistent size, average size is ' + spacing;
            this.buffer = this.buffer || gl.createBuffer();
            this.buffer.length = data.length;
            this.buffer.spacing = data.length / this.data.length;
            gl.bindBuffer(this.target, this.buffer);
            gl.bufferData(this.target, new this.type(data), type || gl.STATIC_DRAW);
    }
}