var aGLExists = el => {
    /* Need to check if WebGL canvas exists */
    var canvas = document.getElementById(el);
    if (!canvas)
        return null;
    var context = canvas.getContext("webgl", {alpha: false,preserveDrawingBuffer: true}) || canvas.getContext("experimental-webgl", {alpha: false,preserveDrawingBuffer: true});
    if (!context) {
        alert("Your browser does not support WebGl. It is recommended to update your browser to the latest version to view this page.");
        return null;
    }
    else if (context == null){
         alert("The graphic card drivers are not up to date. Please update your graphic card drivers to view this page.");
        return null;
    }
    if (context.FALSE == undefined)
        context.FALSE = 0;
    if (context.TRUE == undefined)
        context.TRUE = 1;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    return context;
};
var gl = aGLExists("gl_root");
export default gl;