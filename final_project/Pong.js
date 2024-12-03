// Vertex Shader Source Code
const VSHADER_SOURCE = `
attribute vec4 a_Position;
void main() {
  gl_Position = a_Position;
}
`;

// Fragment Shader Source Code
const FSHADER_SOURCE = `
precision mediump float;
uniform vec4 u_Color;
void main() {
  gl_FragColor = u_Color;
}
`;

function main() {
  const canvas = document.getElementById("webgl");
  const scoreDisplay = document.getElementById("score");
  const gl = getWebGLContext(canvas);
  if (!gl) {
    console.error("WebGL not supported.");
    return;
  }

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.error("Failed to initialize shaders.");
    return;
  }

  const a_Position = gl.getAttribLocation(gl.program, "a_Position");
  const u_Color = gl.getUniformLocation(gl.program, "u_Color");

  if (a_Position < 0 || !u_Color) {
    console.error("Failed to get attribute/uniform location.");
    return;
  }

  // Paddle and ball positions and dimensions
  let leftPaddleY = 0;
  let rightPaddleY = 0;
  const paddleWidth = 0.02, paddleHeight = 0.2;
  let ballX = 0, ballY = 0, ballSpeedX = 0.01, ballSpeedY = 0.01;

  let leftScore = 0;
  let rightScore = 0;

  // Object to track key states
  const keys = {};
  window.addEventListener("keydown", (e) => (keys[e.key] = true));
  window.addEventListener("keyup", (e) => (keys[e.key] = false));

  // Create a buffer object for storing vertex data
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  function drawRectangle(x, y, width, height, color) {
    const vertices = new Float32Array([
      x, y,
      x + width, y,
      x, y + height,
      x, y + height,
      x + width, y,
      x + width, y + height,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.uniform4fv(u_Color, color);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  // Function to update the game state
  function update() {
    if (keys["w"] && leftPaddleY + paddleHeight / 2 < 1) leftPaddleY += 0.02;
    if (keys["s"] && leftPaddleY - paddleHeight / 2 > -1) leftPaddleY -= 0.02;
    if (keys["ArrowUp"] && rightPaddleY + paddleHeight / 2 < 1) rightPaddleY += 0.02;
    if (keys["ArrowDown"] && rightPaddleY - paddleHeight / 2 > -1) rightPaddleY -= 0.02;

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY + 0.02 > 1 || ballY - 0.02 < -1) ballSpeedY = -ballSpeedY;

    if (
      ballX - 0.02 < -0.98 &&
      ballY > leftPaddleY - paddleHeight / 2 &&
      ballY < leftPaddleY + paddleHeight / 2
    ) {
      ballSpeedX = -ballSpeedX;
    }

    if (
      ballX + 0.02 > 0.98 &&
      ballY > rightPaddleY - paddleHeight / 2 &&
      ballY < rightPaddleY + paddleHeight / 2
    ) {
      ballSpeedX = -ballSpeedX;
    }

    if (ballX < -1) {                 //Checking if passed borders
      rightScore++;
      resetBall();
    } else if (ballX > 1) {
      leftScore++;
      resetBall();
    }

    scoreDisplay.textContent = `${leftScore}|${rightScore}`;
  }

  function resetBall() {
    ballX = 0;
    ballY = 0;
    ballSpeedX = 0.01 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 0.01 * (Math.random() > 0.5 ? 1 : -1);
  }

  function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    drawRectangle(-1 + paddleWidth, leftPaddleY - paddleHeight / 2, paddleWidth, paddleHeight, [1, 1, 1, 1]);
    drawRectangle(1 - 2 * paddleWidth, rightPaddleY - paddleHeight / 2, paddleWidth, paddleHeight, [1, 1, 1, 1]);
    drawRectangle(ballX - 0.02, ballY - 0.02, 0.04, 0.04, [1, 0, 0, 1]);

    update();
    requestAnimationFrame(render);
  }

  gl.clearColor(0, 0, 0, 1);
  render();         //render loop
}
