function calculateArea() {
    const radiusInput = document.getElementById('radius').value;
    const radius = parseFloat(radiusInput);

    // Calculate the area if the radius is valid
    if (!isNaN(radius) && radius >= 0) {
        const area = Math.PI * Math.pow(radius, 2);
        document.getElementById('area').textContent = area.toFixed(2); // Show area rounded to 2 decimal places
    } else {
        // Clear the area output if input is invalid
        document.getElementById('area').textContent = "";
    }
}

calculateArea()