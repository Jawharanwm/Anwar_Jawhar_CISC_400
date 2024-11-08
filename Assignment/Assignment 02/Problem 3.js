// Vertex shader program
var VSHADER_SOURCE = 
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_ModelMatrix;\n' +
    'void main() {\n' +
    '  gl_Position = u_ModelMatrix * a_Position;\n' +  // Apply the transformation matrix
    '}\n';

// Fragment shader program
var FSHADER_SOURCE =
    'void main() {\n' +
    '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' + // Set the triangle color to red
    '}\n';

var n = 0; // Number of vertices

function main() {
    // Retrieve <canvas> element
    var canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialize shaders.');
        return;
    }

    // Write the positions of vertices to a vertex shader
    n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed to set the positions of the vertices');
        return;
    }

    // Create Matrix4 object for model transformation
    var modelMatrix = new Matrix4();

    // Initial model matrix (translate to the center of the canvas)
    modelMatrix.setTranslate(0.0, 0.0, 0.0);

    // Get the uniform location for the model matrix
    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('Failed to get the storage location of u_ModelMatrix');
        return;
    }

    // Setup animation loop
    function draw() {
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Pass the model matrix to the vertex shader
        gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

        // Draw the triangle
        gl.drawArrays(gl.TRIANGLES, 0, n);

        // Request the next frame
        requestAnimationFrame(draw);
    }

    // Start the animation loop
    draw();

    // Handle keypresses for rotation
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowLeft') {
            // Rotate counterclockwise around the Y-axis by 5 degrees
            modelMatrix.rotate(5, 0, 1, 0);
        } else if (event.key === 'ArrowRight') {
            // Rotate clockwise around the Y-axis by 5 degrees
            modelMatrix.rotate(-5, 0, 1, 0);
        }
    });
}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        0.3, 0.3,  0.3, -0.3,  -0.3, 0.3,  // Vertices for the triangle
    ]);
    var n = 3; // The number of vertices

    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return false;
    }

    // Bind the buffer object to the target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write data into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }

    // Assign the buffer object to the a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    // Enable the assignment to the a_Position variable
    gl.enableVertexAttribArray(a_Position);

    return n;
}
