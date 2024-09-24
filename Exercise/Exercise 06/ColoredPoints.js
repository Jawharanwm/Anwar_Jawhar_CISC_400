// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = 10.0;\n' +  
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +  // uniform variable for color
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +  
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

  // Get the storage location of a_Position
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Call the function to draw the line
  drawLine(gl, a_Position, u_FragColor);
}

function drawLine(gl, a_Position, u_FragColor) {
  var g_points = [];  // Array to store the points of the line
  var g_colors = [];  // Array to store random colors for each point

  // Example for vertical line (x = constant, y varies)
  var x = 0.0; // Constant x for vertical line
  
  // Example for horizontal line (y = constant, x varies)
  // var y = 0.0; // Constant y for horizontal line
  
  // Generate random colors for each point
  for (var i = -1.0; i <= 1.0; i += 0.05) { // Adjust the increment for smoothness
    if (x !== undefined) {
      // Vertical line: y varies, x is constant
      g_points.push([x, i]);
    } else {
      // Horizontal line: x varies, y is constant
      g_points.push([i, y]);
    }

    // Create random color
    var rgba = [Math.random(), Math.random(), Math.random(), 1.0];
    g_colors.push(rgba);
  }

  // Draw all points
  var len = g_points.length;
  for (var i = 0; i < len; i++) {
    var xy = g_points[i];
    var rgba = g_colors[i];

    // Pass the position of a point to a_Position variable
    gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
    
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    
    // Draw the point
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}
