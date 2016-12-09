import {Vector} from './vector';
import {Matrix} from './matrix';
/**
  * Quaternion class
  * @class Quaternion
  * @constructor
*/
export class Quaternion {
    constructor(x, y, z, w, epsilon) {
        if( arguments.length > 3){
            epsilon = epsilon || Number.EPSILON
            var mag = x * x + y * y + z * z + w*w;
            if (Math.abs(mag - 1) > epsilon) {
                magSqrt = Math.sqrt(mag);
                x /= magSqrt;
                y /= magSqrt;
                z /= magSqrt;
                w /= magSqrt;
            }
        }
        this.x = x || 0.0;
        this.y = y || 0.0;
        this.z = z || 0.0;
        this.w = w || 1.0;
    }

    /**
    @method getMatrix
    Returns the quaternion matrix
    @return {Matrix}
    */
    getMatrix() {
        var x2, y2, z2, xx, xy, xz, yy, yz, zz, wx, wy, wz;

        var rotMatrix = new Matrix()
        rotMatrix.m[15] = 1.0

        x2 = this.x+this.x;
        y2 = this.y+this.y
        z2 = this.z + this.z

        wx = x2*this.w
        wy = y2*this.w
        wz = z2*this.z
        xx = x2*this.x
        xy = y2*this.x
        xz = z2*this.x
        yy = y2*this.y
        yz = z2*this.y
        zz = z2*this.z

        rotMatrix[0] = 1.0 - (yy + zz)
        rotMatrix[4] =xy - wz
        rotMatrix[8] =xz + wy

        rotMatrix[1] =xy + wz
        rotMatrix[5] =1.0 - (xx + zz)
        rotMatrix[9] =yz - wx

        rotMatrix[2] =xz - wy
        rotMatrix[6] =yz + wx
        rotMatrix[10] =1.0 - (xx + yy)

        return rotMatrix
    }

    /**
    @method negative
    Returns negative quaternion
    @return {Quaternion}
    */
    negative() {
        return new Quaternion(-this.x, -this.y, -this.z, -this.w);
    }

    /**
    @method subtract
    @param q {Quaternion}
    Subtracts one quaternion from another
    @return {Quaternion}
    */
    subtract(q) {
        return new Quaternion(this.x-q.x,this.y-q.y,this.z-q.z,this.w-q.w)
    }

    /**
    @method add
    @param q {Quaternion}
    Adds 2 quaternions
    @return {Quaternion}
    */
    add(q) {
        return new Quaternion(this.x+q.x,this.y+q.y,this.z+q.z,this.w+q.w)
    }

    /**
    @method multiply
    @param q {Quaternion}
    Multiplies 2 quaternions
    @return {Quaternion}
    */
    multiply(q) {
        var b = q instanceof Quaternion
        return new Quaternion(( b ? q.w*this.x + q.x*this.w - q.y*this.z + q.z*this.y : this.x*q),
                              ( b ? q.w*this.y + q.y*this.w - q.z*this.x + q.x*this.z : this.y*q),
                              ( b ? q.w*this.z + q.z*this.w - q.x*this.y + q.y*this.x : this.z*q),
                              ( b ? q.w*this.w - q.x*this.w - q.y*this.y - q.z*this.z : this.w*q))
    }

    /**
    @method divide
    @param q {Quaternion}
    Divides 2 quaternions
    @return {Quaternion}
    */
    divide(q) {
        var b = q instanceof Quaternion
        return new Quaternion(( b ? q.w*this.x + q.x*this.w - q.y*this.z + q.z*this.y : q),
                              ( b ? q.w*this.y + q.y*this.w - q.z*this.x + q.x*this.z : q),
                              ( b ? q.w*this.z + q.z*this.w - q.x*this.y + q.y*this.x : q),
                              ( b ? q.w*this.w - q.x*this.w - q.y*this.y - q.z*this.z : q))
    }

    /**
    @method magnitudeSquared
    Returns the squared length of quaternion
    @return {Float}
    */
    magnitudeSquared() {
        return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w
    }

    /**
    @method magnitude
    Returns the length of quaternion
    @return {Float}
    */
    magnitude() {
        return Math.sqrt(this.magnitudeSquared());
    }

    /**
    @method inverse
    Returns inverted quaternion
    @return {Quaternion}
    */
    inverse() {
        var msqr = this.magnitudeSquared()
        return new Quaternion(-this.x/msqr, -this.y/msqr, -this.z/msqr, -this.w/msqr);
    }

    /**
    @method rotateVector
    @param v {Vector}
    Rotate Vector with quaternion
    @return {Vector}
    */
    rotateVector(v) {
        qVector = new Quaternion(v.x,v.y,v.z,0.0)
        qPrim = this.negative()
        mult = this.multiply(qVector).multiply(qPrim)
        return new Vector(mult.x,mult.y,mult.z)
    }

    /**
    @method getQuaternionFromEulerAnglesRad
    @param x {Float}
    @param y {Float}
    @param z {Float}
    Create quaternion from rotation XYZ in Radians
    @return {Quaternion}
    */
    static getQuaternionFromEulerAnglesRad(x, y, z) {
        var w,c1,s1,c2,s2,c3,s3,c1c2,s1s2
        c1 = Math.cos(x/2)
        s1 = Math.sin(x/2)
        c2 = Math.cos(y/2)
        s2 = Math.sin(y/2)
        c3 = Math.cos(z/2)
        s3 = Math.sin(z/2)
        c1c2 = c1*c2
        s1s2 = s1*s2
        w = c1c2*c3+s1s2*s3
        x = s1*c2*c3-c1*s2*s3
        y = c1*s2*c3+s1*c2*s3
        z = c1c2*s3-s1s2*c3
        return new Quaternion(x,y,z,w)
    }

    /**
    @method getQuaternionFromEulerAnglesRad
    @param x {Float}
    @param y {Float}
    @param z {Float}
    Create quaternion from rotation XYZ in Degrees
    @return {Quaternion}
    */
    static getQuaternionFromEulerDeg(x, y, z) {
        return Quaternion.getQuaternionFromEulerAnglesRad(Math.degToRad*x,Math.degToRad*y,Math.degToRad*z)
    }

    /**
    @method getQuaternionFromAxisAngle
    @param v {Vector}
    Create quaternion from axis angle in radians
    @return {Quaternion}
    */
    static getQuaternionFromAxisAngle(v, fi) {
        var x,y,z,w,rad,scale,vec
        if(v.isZero){
            return new Quaternion()
        }
        var vLen = v.length()
        if(Math.abs(vLen-1.0) > Number.EPSILON){
            vec = v.unit()
        }
        rad = fi /2.0
        w = Math.cos(rad)
        scale = Math.sin(rad)
        x = vec.x*scale;
        y = vec.y*scale;
        z = vec.z*scale;
        return new Quaternion(x,y,z,w)
    }

    /**
    @method getQuaternionFromAxisAngle
    @param v {Vector}
    Create quaternion from axis angle in degrees
    @return {Quaternion}
    */
    static getQuaternionFromAxisAngleDeg(v, fi) {
        return Quaternion.getQuaternionFromAxisAngle(v,Math.degToRad*fi)
    }

    /**
    @method getQuaternionFromMatrix
    @param  m {Matrix}
    Create quaternion from Matrix
    @return {Quaternion}
    */
    static getQuaternionFromMatrix(m) {
        var qw,qx,qy,qz
        var matrix = m.m
        var trace = matrix[0] + matrix[5] + matrix[10];
        if (trace > 0) {
            S = Math.sqrt(trace + 1.0) * 2; // S=4*qw
            qw = 0.25 * S;
            qx = (matrix[9] - matrix[6]) / S;
            qy = (matrix[2] - matrix[8]) / S;
            qz = (matrix[4] - matrix[1]) / S;
        } else if ((matrix[0] > matrix[5])&(matrix[0] > matrix[10])) {
            S = Math.sqrt(1.0 + matrix[0] - matrix[5] - matrix[10]) * 2; // S=4*qx
            qw = (matrix[9] - matrix[6]) / S;
            qx = 0.25 * S;
            qy = (matrix[1] + matrix[4]) / S;
            qz = (matrix[2] + matrix[8]) / S;
        } else if (matrix[5] > matrix[10]) {
            S = Math.sqrt(1.0 + matrix[5] - matrix[0] - matrix[10]) * 2; // S=4*qy
            qw = (matrix[2] - matrix[8]) / S;
            qx = (matrix[1] + matrix[4]) / S;
            qy = 0.25 * S;
            qz = (matrix[6] + matrix[9]) / S;
        } else {
            S = Math.sqrt(1.0 + matrix[10] - matrix[0] - matrix[5]) * 2; // S=4*qz
            qw = (matrix[4] - matrix[1]) / S;
            qx = (matrix[2] + matrix[8]) / S;
            qy = (matrix[6] + matrix[9]) / S;
            qz = 0.25 * S;
        }
        return new Quaternion(qx, qy, qz, qw);
    }

    /**
    @method getQuaternionFromSpherical
    @param  latitude {Float}
    @param  longtitude {Float}
    @param  angle {Float}
    Create quaternion from spherical coordinates
    @return {Quaternion}
    */
    static getQuaternionFromSpherical(latitude, longitude, angle) {
            var sin_a,cos_a,sin_lat,cos_lat,sin_long,cos_long,qx,qy,qz,qw
            sin_a = Math.sin(angle / 2.0)
            cos_a = Math.cos(angle / 2.0)
            sin_lat = Math.sin(latitude)
            cos_lat = Math.cos(latitude)

            sin_long = Math.sin(longitude)
            cos_long = Math.cos(longitude)

            qx = sin_a * cos_lat * sin_long
            qy = sin_a * sin_lat
            qz = sin_a * sin_lat * cos_long
            qw = cos_a
            return new Quaternion(qx, qy, qz, qw)
    }

    /**
    @method getRotationTo
    @param fromV {Vector}
    @param toV {Vector}
    get Quaternion from rotation from one Vector to another.
    @return {Quaternion}
    */
    static getRotationTo(fromV, toV) {
        var c = fromV.cross(toV)
        var d = fromV.dot(toV)
        return new Quaternion(c.x,c.y,c.z,d+Math.sqrt(fromV.dot(fromV)*toV.dot(toV)))
    }
}