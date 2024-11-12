// Vertex shader program
const VSHADER_SOURCE = `
attribute vec4 a_Position;
attribute vec4 a_Color;
uniform mat4 u_ModelMatrix;
varying vec4 v_Color;
void main() {
  gl_Position = u_ModelMatrix * a_Position;
  v_Color = a_Color;
}
`;

// Fragment shader program
const FSHADER_SOURCE = `
precision mediump float;
varying vec4 v_Color;
void main() {
  gl_FragColor = v_Color;
}
`;

function main() {
    const canvas = document.getElementById('webgl');
    const gl = canvas.getContext('webgl');
    if (!gl) {
        console.log('Failed to get WebGL context');
        return;
}

// Initialize shaders
if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
  console.log('Failed to initialize shaders');
  return;
}

// Set up positions for two squares
const n = initVertexBuffers(gl);

if (n < 0) {
  console.log('Failed to set the vertex information');
  return;
}

// Set clear color
gl.clearColor(0.0, 0.0, 0.0, 1.0);

// Initial positions for both squares
let redSquareY = 0.0;   // Y position for red square (left)
let greenSquareY = 0.0; // Y position for green square (right)

// Get location of u_ModelMatrix
const u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
if (!u_ModelMatrix) {
  console.log('Failed to get the storage location of u_ModelMatrix');
  return;
}

// Handle keyboard inputs
document.onkeydown = function(ev) {
  switch(ev.key) {
    case 'ArrowUp': greenSquareY += 0.05; break;
    case 'ArrowDown': greenSquareY -= 0.05; break;
    case 'w': redSquareY += 0.05; break;
    case 's': redSquareY -= 0.05; break;
  }
  draw(gl, n, u_ModelMatrix, redSquareY, greenSquareY);
};

// Draw initial scene
draw(gl, n, u_ModelMatrix, redSquareY, greenSquareY);
}

function initVertexBuffers(gl) {
    const verticesColors = new Float32Array([
        // Left red square
        -0.9,  0.1, 1.0, 0.0, 0.0, // Top-left
        -0.7,  0.1, 1.0, 0.0, 0.0, // Top-right
        -0.7, -0.1, 1.0, 0.0, 0.0, // Bottom-right
        -0.9, -0.1, 1.0, 0.0, 0.0, // Bottom-left

        // Right green square
        0.7,  0.1, 0.0, 1.0, 0.0, // Top-left
        0.9,  0.1, 0.0, 1.0, 0.0, // Top-right
        0.9, -0.1, 0.0, 1.0, 0.0, // Bottom-right
        0.7, -0.1, 0.0, 1.0, 0.0  // Bottom-left
    ]);
    const indices = new Uint8Array([
        0, 1, 2, 0, 2, 3,  // Left square
        4, 5, 6, 4, 6, 7   // Right square
    ]);

    // Create buffer objects
    const vertexColorBuffer = gl.createBuffer();
    const indexBuffer = gl.createBuffer();
    if (!vertexColorBuffer || !indexBuffer) {
        console.log('Failed to create buffer objects');
        return -1;
    }

    // Bind buffer for vertex positions and colors
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

    const FSIZE = verticesColors.BYTES_PER_ELEMENT;
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    const a_Color = gl.getAttribLocation(gl.program, 'a_Color');

    // Assign buffer to a_Position
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0);
    gl.enableVertexAttribArray(a_Position);

    // Assign buffer to a_Color
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
    gl.enableVertexAttribArray(a_Color);

    // Bind buffer for indices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices.length;
}

function draw(gl, n, u_ModelMatrix, redSquareY, greenSquareY) {
    // Clear canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Create model matrix instance
    const modelMatrix = new Matrix4();

    // Draw red square on the left
    modelMatrix.setTranslate(0.0, redSquareY, 0.0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0);

    // Draw green square on the right
    modelMatrix.setTranslate(0.0, greenSquareY, 0.0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 6);
}