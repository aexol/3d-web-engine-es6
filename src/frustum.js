import {Vector4} from './vector';
/**
  * Frustum class
  * @class Frustum
  * @constructor
*/
export class Frustum {
    constructor() {
        this.planes = new Array(6)
        this.corners = new Array(8)
    }

    fromPerspectiveMatrix(matrix) {
        var mat = matrix.m
            this.planes[0] = new Vector4(mat[8]+mat[12], mat[9]+mat[13], mat[10]+mat[14], mat[11]+mat[15]);
            this.planes[1] = new Vector4(-mat[8]+mat[12], -mat[9]+mat[13], -mat[10]+mat[14], -mat[11]+mat[15]);
            this.planes[2] = new Vector4(mat[4]+mat[12], mat[5]+mat[13], mat[6]+mat[14], mat[7]+mat[15]);
            this.planes[3] = new Vector4(-mat[4]+mat[12], -mat[5]+mat[13], -mat[6]+mat[14], -mat[7]+mat[15]);
            this.planes[4] = new Vector4(mat[0]+mat[12], mat[1]+mat[13], mat[2]+mat[14], mat[3]+mat[15]);
            this.planes[5] = new Vector4(-mat[0]+mat[12], -mat[1]+mat[13], -mat[2]+mat[14], -mat[3]+mat[15]);
    }

    boxInFrustum(box) {
        for(var p in this.planes){
            var checkPlane = this.planes[p]
            var out = 0;
            out += ((checkPlane.dot(new Vector4(box.min.x, box.min.y, box.min.z, 1.0) ) < 0.0 )?1:0);
            if (out == 0)
                continue;
            out += ((checkPlane.dot(new Vector4(box.max.x, box.min.y, box.min.z, 1.0) ) < 0.0 )?1:0);
            if (out == 1)
                continue;
            out += ((checkPlane.dot(new Vector4(box.min.x, box.max.y, box.min.z, 1.0) ) < 0.0 )?1:0);
            if (out == 2)
                continue;
            out += ((checkPlane.dot(new Vector4(box.max.x, box.max.y, box.min.z, 1.0) ) < 0.0 )?1:0);
            if (out == 3)
                continue;
            out += ((checkPlane.dot(new Vector4(box.min.x, box.min.y, box.max.z, 1.0) ) < 0.0 )?1:0);
            if (out == 4)
                continue;
            out += ((checkPlane.dot(new Vector4(box.max.x, box.min.y, box.max.z, 1.0) ) < 0.0 )?1:0);
            if (out == 5)
                continue;
            out += ((checkPlane.dot(new Vector4(box.min.x, box.max.y, box.max.z, 1.0) ) < 0.0 )?1:0);
            if (out == 6)
                continue;
            out += ((checkPlane.dot(new Vector4(box.max.x, box.max.y, box.max.z, 1.0) ) < 0.0 )?1:0);
            if( out==8 ) return false;
        }
        return true
    }

    sphereInFrustum(sphere) {
        for(var p in this.planes){
            var checkPlane = this.planes[p]
            var sc = sphere.center
            let fDistance = checkPlane.x*sc.x+checkPlane.y*sc.y+checkPlane.z*sc.z+checkPlane.d
            if(fDistance < -sphere.radius){
                return false;
            }
        }
        return true
    }
}
