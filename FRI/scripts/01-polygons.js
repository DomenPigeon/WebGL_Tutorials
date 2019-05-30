let canvas;
let gl;
let shaderProgram;

let triangleVertexPositionBuffer;
let squareVertexPositionBuffer;
let octagonalPositionBuffer;
let triacontadigonPositionBuffer;
let circlePositionBuffer;

let mvMatrix = mat4.create();
let pMatrix = mat4.create();

function start() {
    canvas = document.getElementById("canvas");
    gl = initGL(canvas);

    if(gl){
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        initShaders();
        initBuffers();

        requestAnimationFrame(drawScene);
    }
}

function initGL(canvas){
    gl = null;

    try{
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    }
    catch (e) {
    }

    if(gl == null)
        alert("Unable to initialize WebGL");

    return gl;
}

function initShaders(){
    let fragmentShader = getShader(gl, "shader-fs");
    let vertexShader = getShader(gl, "shader-vs");

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)){
        alert("Unable to initialize the shader program.");
        return null;
    }

    gl.useProgram(shaderProgram);
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}

function getShader(gl, id){
    let shaderScript = document.getElementById(id);
    if(!shaderScript) return null;

    let shaderSource = shaderScript.text;
    let shader;

    if(shaderScript.type == "x-shader/x-fragment"){
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    }
    else if(shaderScript.type == "x-shader/x-vertex"){
        shader = gl.createShader(gl.VERTEX_SHADER);
    }
    else{
        return null;
    }

    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
        alert("Shder didn't compile properly." + gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function initBuffers(){
    // Triangle
    triangleVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);

    let vertices = [
        0.0, 1.0, 0.0,
        -1.0, -1.0, 0.0,
        1.0, -1.0, 0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    triangleVertexPositionBuffer.itemSize = 3;
    triangleVertexPositionBuffer.numElements = 3;

    // Square
    squareVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    vertices = [
        1.0, 1.0, 0.0,
        -1.0, 1.0, 0.0,
        1.0, -1.0, 0.0,
        -1.0, -1.0, 0.0
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    squareVertexPositionBuffer.itemSize = 3;
    squareVertexPositionBuffer.numElements = 4;

    // Octagonal
    octagonalPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, octagonalPositionBuffer);
    vertices = [
        1.0, 2.0, 0.0,
        2.0, 1.0, 0.0,
        2.0, 0.0, 0.0,
        1.0, -1.0, 0.0,

        -1.0, -1.0, 0.0,
        -2.0, 0.0, 0.0,
        -2.0, 1.0, 0.0,
        -1.0, 2.0, 0.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    octagonalPositionBuffer.itemSize = 3;
    octagonalPositionBuffer.numElements = 8;

    // Triacontadigon
    triacontadigonPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triacontadigonPositionBuffer);
    vertices = regularPolygon(32, 1.5);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    triacontadigonPositionBuffer.itemSize = 3;
    triacontadigonPositionBuffer.numElements = 32;

    // Circle
    circlePositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, circlePositionBuffer);
    vertices = regularPolygon(56, 1.5);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    circlePositionBuffer.itemSize = 3;
    circlePositionBuffer.numElements = 56;
}

function drawScene(){
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

    mat4.perspective(60, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
    mat4.identity(mvMatrix);
    mat4.translate(mvMatrix, [-6.5, 2.0, -9.0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    gl.vertexAttribPointer(
        shaderProgram.vertexPositionAttribute,
        triangleVertexPositionBuffer.itemSize,
        gl.FLOAT,
        false,
        0, 0
    );
    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numElements);

    // Square
    mat4.translate(mvMatrix, [6.0, 0.0, 0.0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    gl.vertexAttribPointer(
        shaderProgram.vertexPositionAttribute,
        squareVertexPositionBuffer.itemSize,
        gl.FLOAT,
        false,
        0, 0
    );
    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareVertexPositionBuffer.numElements);

    // Octagonal
    mat4.translate(mvMatrix, [6.0, 0.0, 0.0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, octagonalPositionBuffer);
    gl.vertexAttribPointer(
        shaderProgram.vertexPositionAttribute,
        octagonalPositionBuffer.itemSize,
        gl.FLOAT,
        false,
        0, 0
    );
    setMatrixUniforms();
    gl.drawArrays(gl.LINE_LOOP, 0, octagonalPositionBuffer.numElements);
    mat4.translate(mvMatrix, [0.0, -4.0, 0.0]);
    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLE_FAN, 0, octagonalPositionBuffer.numElements);

    // Triacontadigon
    mat4.translate(mvMatrix, [-4.0, 0.0, 0.0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, triacontadigonPositionBuffer);
    gl.vertexAttribPointer(
        shaderProgram.vertexPositionAttribute,
        triacontadigonPositionBuffer.itemSize,
        gl.FLOAT,
        false, 0, 0
    );
    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLE_FAN, 0, triacontadigonPositionBuffer.numElements);

    // Circle
    mat4.translate(mvMatrix, [-4.0, 0.0, 0.0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, circlePositionBuffer);
    gl.vertexAttribPointer(
        shaderProgram.vertexPositionAttribute,
        circlePositionBuffer.itemSize,
        gl.FLOAT, false, 0, 0
    );
    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLE_FAN, 0, circlePositionBuffer.numElements);
}

function setMatrixUniforms(){
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

