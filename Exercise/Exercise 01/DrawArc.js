function main() {
    // Retrieve <canvas> element
    var canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }

    // Get the rendering context for 2DCG 
    var ctx = canvas.getContext('2d');
    // Draw a circle
    ctx.arc(100, 75, 50, 0, 2 * Math.PI);
    // Set a blue color 
    ctx.fill(120, 10, 150, 150);
}
