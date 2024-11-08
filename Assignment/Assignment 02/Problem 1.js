// HelloPoint1.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = 
  'uniform float u_Time;\n' +
  'uniform float u_Direction;\n' +         // New uniform to control direction
  'void main() {\n' +
  '  float x = mod(u_Time * 0.5 * u_Direction, 2.0) - 1.0; \n' + // Move x with direction control
  '  float y = sin(u_Time) * 0.5; \n' +    // Oscillate y with a sine wave
  '  gl_Position = vec4(x, y, 0.0, 1.0);\n' +
  '  gl_PointSize = 8.0;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);\n' + // Set the point color
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
    console.log('Failed to initialize shaders.');
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Get the storage location of u_Time and u_Direction
  var u_Time = gl.getUniformLocation(gl.program, 'u_Time');
  var u_Direction = gl.getUniformLocation(gl.program, 'u_Direction');
  if (u_Time < 0 || u_Direction < 0) {
    console.log('Failed to get the storage location of u_Time or u_Direction');
    return;
  }

  // Animation parameters
  var time = 0;
  var speed = 0.05;
  var direction = 1.0;  // Initial direction to the right

  function draw() {
    // Update the time
    time += speed;

    // Reverse direction if the point hits the border
    if (Math.abs((time * 0.5) % 2.0 - 1.0) > 0.99) {
      direction = -direction;
    }

    // Pass the time and direction to the shader
    gl.uniform1f(u_Time, time);
    gl.uniform1f(u_Direction, direction);

    // Clear canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw the point
    gl.drawArrays(gl.POINTS, 0, 1);

    // Request the next frame
    requestAnimationFrame(draw);
  }

  draw();
}