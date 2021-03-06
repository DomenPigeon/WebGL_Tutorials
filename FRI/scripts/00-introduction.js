let canvas;
let gl;

function start() {
    canvas = document.getElementById("canvas");
    gl = initGL(canvas);

    if(gl){
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
}

function initGL(canvas){
    gl = null;

    try{
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    }
    catch (e) {
    }

    if(gl == null)
        alert("Unable to initialize WebGL");

    return gl;
}