import {Vector} from './vector';
/**
  * Matrix3 class
  * @class Matrix3
  * @constructor
*/
export class Matrix3 {
    constructor() {
        this.m = Array.prototype.concat.apply([],arguments);
        if(!this.m.length){
            this.m - [1,0,0,0,1,0,0,0,1];
        }
    }

    /**
    * Exchanges columns for rows.
    * @method transpose
    * @return {Matrix3} Transposed matrix3
    */
    transpose() {
        var m = this.m;
        return new Matrix3(m[0], m[3], m[6], m[1], m[4], m[7], m[2], m[5], m[8]);
    }
}

/**
  * Matrix class
  * @class Matrix
  * @constructor
*/
export class Matrix {
    constructor() {
        this.m = Array.prototype.concat.apply([], arguments);
        if(!this.m.length) {
            this.m = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        }
    }

    /**
    * Returns the matrix that when multiplied with this matrix results in the
    * identity matrix.
    * @method inverse
    * @return {Matrix} Inverted matrix
    */
    inverse() {
        var m = this.m, inv = new Matrix(m[5] * m[10] * m[15] - m[5] * m[14] * m[11] - m[6] * m[9] * m[15] + m[6] * m[13] * m[11] + m[7] * m[9] * m[14] - m[7] * m[13] * m[10], -m[1] * m[10] * m[15] + m[1] * m[14] * m[11] + m[2] * m[9] * m[15] - m[2] * m[13] * m[11] - m[3] * m[9] * m[14] + m[3] * m[13] * m[10], m[1] * m[6] * m[15] - m[1] * m[14] * m[7] - m[2] * m[5] * m[15] + m[2] * m[13] * m[7] + m[3] * m[5] * m[14] - m[3] * m[13] * m[6], -m[1] * m[6] * m[11] + m[1] * m[10] * m[7] + m[2] * m[5] * m[11] - m[2] * m[9] * m[7] - m[3] * m[5] * m[10] + m[3] * m[9] * m[6], -m[4] * m[10] * m[15] + m[4] * m[14] * m[11] + m[6] * m[8] * m[15] - m[6] * m[12] * m[11] - m[7] * m[8] * m[14] + m[7] * m[12] * m[10], m[0] * m[10] * m[15] - m[0] * m[14] * m[11] - m[2] * m[8] * m[15] + m[2] * m[12] * m[11] + m[3] * m[8] * m[14] - m[3] * m[12] * m[10], -m[0] * m[6] * m[15] + m[0] * m[14] * m[7] + m[2] * m[4] * m[15] - m[2] * m[12] * m[7] - m[3] * m[4] * m[14] + m[3] * m[12] * m[6], m[0] * m[6] * m[11] - m[0] * m[10] * m[7] - m[2] * m[4] * m[11] + m[2] * m[8] * m[7] + m[3] * m[4] * m[10] - m[3] * m[8] * m[6], m[4] * m[9] * m[15] - m[4] * m[13] * m[11] - m[5] * m[8] * m[15] + m[5] * m[12] * m[11] + m[7] * m[8] * m[13] - m[7] * m[12] * m[9], -m[0] * m[9] * m[15] + m[0] * m[13] * m[11] + m[1] * m[8] * m[15] - m[1] * m[12] * m[11] - m[3] * m[8] * m[13] + m[3] * m[12] * m[9], m[0] * m[5] * m[15] - m[0] * m[13] * m[7] - m[1] * m[4] * m[15] + m[1] * m[12] * m[7] + m[3] * m[4] * m[13] - m[3] * m[12] * m[5], -m[0] * m[5] * m[11] + m[0] * m[9] * m[7] + m[1] * m[4] * m[11] - m[1] * m[8] * m[7] - m[3] * m[4] * m[9] + m[3] * m[8] * m[5], -m[4] * m[9] * m[14] + m[4] * m[13] * m[10] + m[5] * m[8] * m[14] - m[5] * m[12] * m[10] - m[6] * m[8] * m[13] + m[6] * m[12] * m[9], m[0] * m[9] * m[14] - m[0] * m[13] * m[10] - m[1] * m[8] * m[14] + m[1] * m[12] * m[10] + m[2] * m[8] * m[13] - m[2] * m[12] * m[9], -m[0] * m[5] * m[14] + m[0] * m[13] * m[6] + m[1] * m[4] * m[14] - m[1] * m[12] * m[6] - m[2] * m[4] * m[13] + m[2] * m[12] * m[5], m[0] * m[5] * m[10] - m[0] * m[9] * m[6] - m[1] * m[4] * m[10] + m[1] * m[8] * m[6] + m[2] * m[4] * m[9] - m[2] * m[8] * m[5]);
        var det = m[0] * inv.m[0] + m[1] * inv.m[4] + m[2] * inv.m[8] + m[3] * inv.m[12];
        if(det == 0)
            return new Matrix();
        for(var i = 0; i < 16; i++)
        inv.m[i] /= det;
        return inv;
    }

    /**
    * Returns the matrix that when multiplied with this matrix results in the
    * identity matrix3.
    * @method toInverseMat3
    * @return {Matrix3} Inverted matrix3
    */
    toInverseMat3() {
            // Cache the matrix values (makes for huge speed increases!)
            var mat = this.m
            var a00 = mat[0], a01 = mat[1], a02 = mat[2],
                a10 = mat[4], a11 = mat[5], a12 = mat[6],
                a20 = mat[8], a21 = mat[9], a22 = mat[10],

                b01 = a22 * a11 - a12 * a21,
                b11 = -a22 * a10 + a12 * a20,
                b21 = a21 * a10 - a11 * a20,

                d = a00 * b01 + a01 * b11 + a02 * b21,
                id;

            if (!d) { return null; }
            id = 1 / d;

            var dst = new Matrix3()
            let dest = dst.m
            dest[0] = b01 * id;
            dest[1] = (-a22 * a01 + a02 * a21) * id;
            dest[2] = (a12 * a01 - a02 * a11) * id;
            dest[3] = b11 * id;
            dest[4] = (a22 * a00 - a02 * a20) * id;
            dest[5] = (-a12 * a00 + a02 * a10) * id;
            dest[6] = b21 * id;
            dest[7] = (-a21 * a00 + a01 * a20) * id;
            dest[8] = (a11 * a00 - a01 * a10) * id;
            return dst;
    }

    nfm() {
        var mat = this.m
        var a00 = mat[0];
        var a01 = mat[1];
        var a02 = mat[2];
        var a10 = mat[4];
        var a11 = mat[5];
        var a12 = mat[6];
        var a20 = mat[8];
        var a21 = mat[9];
        var a22 = mat[10];
        var b01 = a22 * a11 - a12 * a21;
        var b11 = -a22 * a10 + a12 * a20;
        var b21 = a21 * a10 - a11 * a20;
        var d = a00 * b01 + a01 * b11 + a02 * b21;
        var id = 1.0/d;
        var newm = new Matrix3();
        let dest = newm.m
        dest[0] = b01 * id;
        dest[1] = b11 * id;
        dest[2] = b21 * id;
        dest[3] = (-a22 * a01 + a02 * a21) * id;
        dest[4] = (a22 * a00 - a02 * a20) * id;
        dest[5] = (-a21 * a00 + a01 * a20) * id;
        dest[6] = (a12 * a01 - a02 * a11) * id;
        dest[7] = (-a12 * a00 + a02 * a10) * id;
        dest[8] = (a11 * a00 - a01 * a10) * id;
        return newm;
    }

    /**
    * Exchanges columns for rows.
    * @method transpose
    * @return {Matrix} Transposed matrix
    */
    transpose() {
        var m = this.m;
        return new Matrix(m[0], m[4], m[8], m[12], m[1], m[5], m[9], m[13], m[2], m[6], m[10], m[14], m[3], m[7], m[11], m[15]);
    }

    /**
    * Concatenates the transforms for this matrix and `matrix`.
    * @method multiply
    * @param {Matrix} matrix Matrix to multiply
    * @return {Matrix} Multiplied matrix
    */
    multiply(matrix) {
        var a = this.m, b = matrix.m;
        return new Matrix(a[0] * b[0] + a[1] * b[4] + a[2] * b[8] + a[3] * b[12], a[0] * b[1] + a[1] * b[5] + a[2] * b[9] + a[3] * b[13], a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + a[3] * b[14], a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + a[3] * b[15], a[4] * b[0] + a[5] * b[4] + a[6] * b[8] + a[7] * b[12], a[4] * b[1] + a[5] * b[5] + a[6] * b[9] + a[7] * b[13], a[4] * b[2] + a[5] * b[6] + a[6] * b[10] + a[7] * b[14], a[4] * b[3] + a[5] * b[7] + a[6] * b[11] + a[7] * b[15], a[8] * b[0] + a[9] * b[4] + a[10] * b[8] + a[11] * b[12], a[8] * b[1] + a[9] * b[5] + a[10] * b[9] + a[11] * b[13], a[8] * b[2] + a[9] * b[6] + a[10] * b[10] + a[11] * b[14], a[8] * b[3] + a[9] * b[7] + a[10] * b[11] + a[11] * b[15], a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + a[15] * b[12], a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + a[15] * b[13], a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + a[15] * b[14], a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + a[15] * b[15]);
    }

    /**
    * Transforms the vector as a point with a w coordinate of 1. This
    * means translations will have an effect, for example.
    * @method transformPoint
    * @return {Vector} Transformed Vector
    */
    transformPoint(v) {
        var m = this.m;
        if( v instanceof Vector ){
        return new Vector(
        m[0] * v.x + m[1] * v.y + m[2] * v.z + m[3],
        m[4] * v.x + m[5] * v.y + m[6] * v.z + m[7],
        m[8] * v.x + m[9] * v.y + m[10] * v.z + m[11]
        ).divide(m[12] * v.x + m[13] * v.y + m[14] * v.z + m[15]);
        }
        else{
        return new Vector(
            m[0] * v[0] + m[1] * v[1] + m[2] * v[2] + m[3],
        m[4] * v[0] + m[5] * v[1] + m[6] * v[2] + m[7],
        m[8] * v[0] + m[9] * v[1] + m[10] * v[2] + m[11]
        ).divide(m[12] * v[0] + m[13] * v[1] + m[14] * v[2] + m[15]);
        }
    }

    /**
    * Transforms the vector as a vector with a w coordinate of 0. This
    * means translations will have no effect, for example.
    * @method transformVector
    * @return {Vector} Transformed Vector
    */
    transformVector(v) {
        var m = this.m;
        return new Vector(m[0] * v.x + m[1] * v.y + m[2] * v.z, m[4] * v.x + m[5] * v.y + m[6] * v.z, m[8] * v.x + m[9] * v.y + m[10] * v.z);
    }

    /**
    * Sets up a perspective transform, which makes far away objects appear smaller
    * than nearby objects. The `aspect` argument is the width divided by the height
    * of your viewport and `fov` is the top-to-bottom angle of the field of view in
    * degrees.
    * @method perspective
    * @param {float} fov Field of View
    * @param {float} aspect Aspect ratio
    * @param {float} near Near plane
    * @param {float} far Far plane
    * @return {Matrix} Result matrix
    */
    static perspective(fov, aspect, near, far) {
        var y = Math.tan(fov * Math.PI / 360) * near;
        var x = y * aspect;
        return Matrix.frustum(-x, x, -y, y, near, far);
    }

    /**
    * Sets up a viewing frustum, which is shaped like a truncated pyramid with the
    * camera where the point of the pyramid would be. This emulates the OpenGL
    * @method frustum
    * @param {float} l Left
    * @param {float} r Right
    * @param {float} b Bottom
    * @param {float} t Top
    * @param {float} n Near
    * @param {float} f Far
    * @return {Matrix} Result matrix
    */
    static frustum(l, r, b, t, n, f) {
        return new Matrix(2 * n / ( r - l), 0, (r + l) / ( r - l), 0, 0, 2 * n / ( t - b), (t + b) / ( t - b), 0, 0, 0, -(f + n) / ( f - n), -2 * f * n / ( f - n), 0, 0, -1, 0);
    }

    /**
    * Sets up an ortho perspective transform. The `aspect` argument is the width divided by the height
    * of your viewport and `fov` is the top-to-bottom angle of the field of view in
    * degrees.
    * @method orthoPerspective
    * @param {float} fov Field of View
    * @param {float} aspect Aspect ratio
    * @param {float} near Near plane
    * @param {float} far Far plane
    * @return {Matrix} Result matrix
    */
    static orthoPerspective(fov, aspect, near, far) {
        var y = Math.tan(fov * Math.PI / 360) * near;
        var x = y * aspect;
        return Matrix.ortho(-x, x, -y, y, near, far);
    }

    /**
    * Creates an orthographic projection, in which objects are the same size no
    * matter how far away or nearby they are.
    * @method ortho
    * @param {float} l Left
    * @param {float} r Right
    * @param {float} b Bottom
    * @param {float} t Top
    * @param {float} n Near
    * @param {float} f Far
    * @return {Matrix} Result matrix
    */
    static ortho(l, r, b, t, n, f) {
        return new Matrix(2 / ( r - l), 0, 0, (r + l) / ( r - l), 0, 2 / ( t - b), 0, (t + b) / ( t - b), 0, 0, -2 / ( f - n), (f + n) / ( f - n), 0, 0, 0, 1);
    }

    /**
    * Creates a matrix that scales by the vector `x, y, z`.
    * @method scale
    * @param {float} x Vector X value
    * @param {float} y Vector Y value
    * @param {float} z Vector Z value
    * @return {Matrix} Result matrix
    */
    static scale(x, y, z) {
        return new Matrix(x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1);
    }

    /**
    * Creates a matrix that translates by the vector `x, y, z`.
    * @method translate
    * @param {float} x Vector X value
    * @param {float} y Vector Y value
    * @param {float} z Vector Z value
    * @return {Matrix} Result matrix
    */
    static translate(x, y, z) {
        return new Matrix(1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1);
    }

    /**
    * Creates a matrix that rotates by `a` degrees around the vector `x, y, z`.
    * @method rotate
    * @param {float} a Angle in degrees
    * @param {float} x Vector X value
    * @param {float} y Vector Y value
    * @param {float} z Vector Z value
    * @return {Matrix} Result matrix
    */
    static rotate(a, x, y, z) {
        if(a && (x || y || z)) {
            var d = Math.sqrt(x * x + y * y + z * z);
            a *= Math.PI / 180;
            x /= d;
            y /= d;
            z /= d;
            var c = Math.cos(a), s = Math.sin(a), t = 1 - c;
            return new Matrix(x * x * t + c, x * y * t - z * s, x * z * t + y * s, 0, y * x * t + z * s, y * y * t + c, y * z * t - x * s, 0, z * x * t - y * s, z * y * t + x * s, z * z * t + c, 0, 0, 0, 0, 1);
        } else {
            return new Matrix();
        }
    }

    /**
    * Creates a matrix that rotates in three axes `x, y, z`.
    * @method rotate
    * @param {float} xAngle in degrees
    * @param {float} yAngle in degrees
    * @param {float} zAngle in degrees
    * @return {Matrix} Result matrix
    */
    rotateVector(xAngle, yAngle, zAngle) {
        var m = this
        m = m.multiply(Matrix.rotate(xAngle, 1, 0, 0));
        m = m.multiply(Matrix.rotate(yAngle, 0, 1, 0));
        m = m.multiply(Matrix.rotate(zAngle, 0, 0, 1));
        return m
    }

    /**
    * Create a matrix that puts the camera at the eye point `ex, ey, ez` looking
    * toward the center point `cx, cy, cz` with an up direction of `ux, uy, uz`.
    * @method lookAt
    * @param {Vector} e Eye point
    * @param {Vector} c Center point
    * @param {Vector} u Up vector
    * @return {Matrix} Result matrix
    */
    static lookAt(e, c, u) {
        var f = e.subtract(c).unit();
        var s = u.cross(f).unit();
        var t = f.cross(s).unit();
        return new Matrix(s.x, s.y, s.z, -s.dot(e), t.x, t.y, t.z, -t.dot(e), f.x, f.y, f.z, -f.dot(e), 0, 0, 0, 1);
    }
}
