// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = 10.0;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
  '}\n';

  function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Program link error:", gl.getProgramInfoLog(program));
        return null;
    }
    return program;
}


function main() {
    // Retrieve <canvas> element
    var canvas = document.getElementById('webgl');
  
    // Get the rendering context for WebGL
    var gl = canvas.getWebGLContext('webgl');
    if (!gl) {
      console.log('Failed to get the rendering context for WebGL');
      return;
    }
  
    // Initialize shaders
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, VSHADER_SOURCE);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FSHADER_SOURCE);
    if (!vertexShader || !fragmentShader) return;


    var program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return;
    gl.useProgram(program);

    // Define points for a circle using a triangle fan
    var numPoints = 100; // More points make the circle smoother
    var radius = 0.5;
    var circleVertices = [];

    // Add center point of the circle
    circleVertices.push(0.0, 0.0);

    // Calculate the points on the circle's circumference
    for (let i = 0; i <= numPoints; i++) {
        const angle = (i / numPoints) * 2 * Math.PI; // Angle in radians
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        circleVertices.push(x, y);
    }

    // Create a buffer for vertex data
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(circleVertices), gl.STATIC_DRAW);

    // Get the attribute location, enable it
    var a_Position = gl.getAttribLocation(program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    // Set the clear color and clear the canvas
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw the circle using TRIANGLE_FAN mode
    gl.drawArrays(gl.TRIANGLE_FAN, 0, numPoints + 2); // +2 for the center and the last point at the same position as the first
}

main();
