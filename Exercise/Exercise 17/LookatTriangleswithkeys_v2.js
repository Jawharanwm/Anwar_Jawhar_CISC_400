var ANGLE_STEP = 45.0;

// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'uniform mat4 u_ViewMatrix;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_ProjMatrix;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;\n' + // Apply projection matrix
  '  v_Color = a_Color;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
  '}\n';

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
    console.log('Failed to intialize shaders.');
    return;
  }

  // Set the vertex coordinates and color
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // Get storage locations of matrices
  var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  var u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');

  if (!u_ViewMatrix || !u_ModelMatrix || !u_ProjMatrix) { 
    console.log('Failed to get the storage locations of matrices');
    return;
  }

  // Initialize the projection matrix
  var projMatrix = new Matrix4();
  var g_near = 0.0, g_far = 2.0;
  projMatrix.setOrtho(-1.0, 1.0, -1.0, 1.0, g_near, g_far);

  // Pass the projection matrix to the vertex shader
  gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

  // Current rotation angle and model/view matrices
  var currentAngle = 0.0;
  var modelMatrix = new Matrix4();
  var viewMatrix = new Matrix4();

  // Register keydown event handler
  document.onkeydown = function(ev) { 
    keydown(ev, gl, n, u_ViewMatrix, viewMatrix, currentAngle, modelMatrix, u_ModelMatrix); 
  };

  // Animation loop
  var tick = function() {
    currentAngle = animate(currentAngle);  // Update the rotation angle
    draw(gl, n, u_ViewMatrix, viewMatrix, currentAngle, modelMatrix, u_ModelMatrix); // Draw
    requestAnimationFrame(tick, canvas); // Request the next frame
  };
  tick();
}

function initVertexBuffers(gl) {
  var verticesColors = new Float32Array([
    // Vertex coordinates and color
    0.0,  0.5,   0.0,  0.4,  0.4,  1.0,  // The front blue one 
    -0.5, -0.5,   0.0,  0.4,  0.4,  1.0,
     0.5, -0.5,   0.0,  1.0,  0.4,  0.4,  
  ]);
  var n = 3;

  var vertexColorbuffer = gl.createBuffer();  
  if (!vertexColorbuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorbuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  var FSIZE = verticesColors.BYTES_PER_ELEMENT;
  
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
  gl.enableVertexAttribArray(a_Position); 

  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if (a_Color < 0) {
    console.log('Failed to get the storage location of a_Color');
    return -1;
  }
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  gl.enableVertexAttribArray(a_Color);  

  return n;
}

var g_eyeX = 0.20, g_eyeY = 0.25, g_eyeZ = 0.25; 
function keydown(ev, gl, n, u_ViewMatrix, viewMatrix, currentAngle, modelMatrix, u_ModelMatrix) {
  if(ev.keyCode == 39) { // Right arrow key
    g_eyeX += 0.01;
  } else if (ev.keyCode == 37) { // Left arrow key
    g_eyeX -= 0.01;
  } else { return; }
  draw(gl, n, u_ViewMatrix, viewMatrix, currentAngle, modelMatrix, u_ModelMatrix);    
}

function draw(gl, n, u_ViewMatrix, viewMatrix, currentAngle, modelMatrix, u_ModelMatrix) {
  modelMatrix.setRotate(-currentAngle, 0, 0, 1); // Rotation

  viewMatrix.setLookAt(g_eyeX, g_eyeY, g_eyeZ, 0, 0, 0, 0, 1, 0);

  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLES, 0, n);
}

var g_last = Date.now();
function animate(angle) {
  var now = Date.now();
  var elapsed = now - g_last;
  g_last = now;
  var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
  return newAngle %= 360;
}