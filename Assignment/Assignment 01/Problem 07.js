function checkDiagonalMatrix() {
    // Get input from the textarea and parse it as a 2D array
    let matrixInput = document.getElementById('matrixInput').value;

    // Try to parse the input string as a 2D array
    let matrix;
    try {
        matrix = JSON.parse(matrixInput);
    } catch (e) {
        document.getElementById('result').textContent = "Invalid matrix format. Please enter a valid 2D array.";
        return;
    }

    // Check if the matrix is a diagonal matrix
    let isDiagonal = true;
    const numRows = matrix.length;

    // Iterate through the matrix
    for (let i = 0; i < numRows; i++) {
        const numCols = matrix[i].length;
        if (numCols !== numRows) {
            document.getElementById('result').textContent = "The matrix is not square!";
            return;
        }

        for (let j = 0; j < numCols; j++) {
            // Check if the element is outside the diagonal and not zero
            if (i !== j && matrix[i][j] !== 0) {
                isDiagonal = false;
                break;
            }
        }
    }

    // Display the result
    if (isDiagonal) {
        document.getElementById('result').textContent = "The matrix is a diagonal matrix.";
    } else {
        document.getElementById('result').textContent = "The matrix is not a diagonal matrix.";
    }
}