let looprun = true;

function updateDate() {
    if (looprun) {
        document.getElementById('dateTime').textContent = Date();
    }
}

const loopInterval = setInterval(updateDate, 1000);

updateDate();

document.body.addEventListener('click', function() {
    console.log("Screen clicked! Stopping the loop...");
    looprun = false; // This stops the loop from running further

    //clear the interval entirely if you want to stop it completely
    clearInterval(loopInterval);
    
});        