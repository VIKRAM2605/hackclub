let startTime = 0;
let endTime = 0;

export function startTimer() {
    startTime = Date.now();
}

export function endTimer() {
    endTime = Date.now()
    const timeSpent = endTime - startTime;
    return formatTime(timeSpent);
}

export function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const padMin = minutes < 10 ? '0' + minutes : minutes;
    const padSec = seconds < 10 ? '0' + seconds : seconds;

    return `${minutes}m:${seconds}s`;
}

export function playTimeTillNow(){
    const timeSpent = Date.now() - startTime;
    return formatTime(timeSpent); 
}