// Vertex shader program
var VSHADER_SOURCE = 
  'attribute vec4 a_Position;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = 20.0;\n' +  // Point size, though we're drawing a circle now, not a point
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);\n' + // Set the circle color
  '}\n';

var circleVertices = [];
var numSegments = 30; // Number of segments to approximate the circle

function generateCircleVertices(radius) {
  for (let i = 0; i < numSegments; i++) {
    let angle = (i / numSegments) * 2 * Math.PI;
    let x = radius * Math.cos(angle);
    let y = radius * Math.sin(angle);
    circleVertices.push(x, y, 0.0); // Add vertex coordinates for the circle
  }
}

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

  // Create the circle vertices
  generateCircleVertices(0.1);  // Circle radius set to 0.1

  // Create a buffer and put the circle vertices into it
  var circleBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, circleBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(circleVertices), gl.STATIC_DRAW);

  // Get the storage location of a_Position
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Point to the circle buffer
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  // Initial position and radius constraints
  let x = 0.0, y = 0.0; // Start at the center of canvas
  const radius = 0.1;   // Set the radius of the circle
  const speed = 0.005;   // Movement step size

  // Function to generate a random direction for movement
  function getRandomDirection() {
    return (Math.random() * 2 - 1) * speed; // Random value between -speed and speed
  }

  // Function to animate the movement
  function draw() {
    // Generate random direction
    let dx = getRandomDirection();
    let dy = getRandomDirection();

    // Check boundaries to keep the circle within the canvas
    if (x + dx > 1.0 - radius || x + dx < -1.0 + radius) dx = -dx;
    if (y + dy > 1.0 - radius || y + dy < -1.0 + radius) dy = -dy;

    // Update the position
    x += dx;
    y += dy;

    // Update the position in the vertex buffer
    var updatedVertices = [];
    for (let i = 0; i < numSegments; i++) {
      let angle = (i / numSegments) * 2 * Math.PI;
      let newX = x + radius * Math.cos(angle);
      let newY = y + radius * Math.sin(angle);
      updatedVertices.push(newX, newY, 0.0); // Add updated vertices for the new position
    }

    // Update the buffer with new vertices
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(updatedVertices), gl.STATIC_DRAW);

    // Clear the canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw the circle using the vertices
    gl.drawArrays(gl.TRIANGLE_FAN, 0, numSegments);

    // Request the next frame
    requestAnimationFrame(draw);
  }

  // Start the animation
  draw();
}