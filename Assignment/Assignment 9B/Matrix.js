// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
  '}\n';

//Additon function for two matrices
function AddMatrix(Matrix1, Matrix2){

    if (Matrix1.length !== Matrix2.length || Matrix1[0].length !== Matrix2[0].length) {
        throw new Error("Matrices must have the same dimensions.");
    }

    return Matrix1.map((row, i) => row.map((val, j) => val + Matrix2[i][j]));

}

// Scalar function for a matrix
function ScalarMulti(scalar, matrix) {
    if (typeof scalar !== "number") {
        throw new Error("The first input must be a number (scalar).");
    }
    if (!Array.isArray(matrix) || matrix.length === 0) {
        throw new Error("The second input must be a non-empty 2D array.");
    }

    return matrix.map(row => row.map(value => value * scalar));

}

// Multiplication function of two matrices
function multiplyMatrices(Matrix1, Matrix2) {
    if (!Array.isArray(Matrix1) || !Array.isArray(Matrix2) || Matrix1.length === 0 || Matrix2.length === 0) {
        throw new Error("Both inputs must be non-empty 2D arrays.");
    }

    const rowsA = Matrix1.length;
    const colsA = Matrix1[0].length;
    const rowsB = Matrix2.length;
    const colsB = Matrix2[0].length;

    if (colsA !== rowsB) {
        throw new Error("Number of columns in Matrix A must match number of rows in Matrix B.");
    }

    let result = Array(rowsA).fill().map(() => Array(colsB).fill(0));

    for (let i = 0; i < rowsA; i++) {
        for (let j = 0; j < colsB; j++) {
            for (let k = 0; k < colsA; k++) {
                result[i][j] += Matrix1[i][k] * Matrix2[k][j];
            }
        }
    }

    return result;
}


function main() {
  // Retrieve <canvas> element
    const canvas = document.getElementById('webgl');

    // Use 2D context for drawing on canvas
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error("Failed to get 2D context");
        return;
    }

    // Example matrices
    const Mat1 = [
        [1, 2],
        [3, 4]
    ];
    const Mat2 = [
        [5, 6],
        [7, 8]
    ];

    const scalar = 2;

    const addedMatrices = AddMatrix(Mat1, Mat2);
    const scalarMultipliedMatrix = ScalarMulti(scalar, Mat1);
    const multipliedMatrices = multiplyMatrices(Mat1, Mat2);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Display matrices and results on canvas
    ctx.font = '16px Arial';
    ctx.fillStyle = 'black';

    // Print Matrix A
    ctx.fillText('Matrix 1:', 10, 20);
    printMatrix(ctx, Mat1, 10, 40);

    // Print Matrix B
    ctx.fillText('Matrix 2:', 200, 20);
    printMatrix(ctx, Mat2, 200, 40);

    // Print added matrices
    ctx.fillText('Matrix 1 + Matrix 2:', 10, 120);
    printMatrix(ctx, addedMatrices, 10, 140);

    // Print scalar multiplied matrix
    ctx.fillText('Scalar (2) * Matrix 1:', 200, 120);
    printMatrix(ctx, scalarMultipliedMatrix, 200, 140);

    // Print multiplied matrices
    ctx.fillText('Matrix 1 * Matrix 2:', 10, 220);
    printMatrix(ctx, multipliedMatrices, 10, 240);
}

// Helper function to print matrices on canvas
function printMatrix(ctx, matrix, x, y) {
    matrix.forEach((row, i) => {
        row.forEach((val, j) => {
            ctx.fillText(val, x + j * 30, y + i * 20);
        });
    });
}


