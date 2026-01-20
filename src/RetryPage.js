import { endTimer, startTimer } from "./TimeCalculation.js";

export function initRetryPage() {
    retryPage();
}

export function retryPage() {
    let retryPage = document.getElementById('retry-main');
    if (!retryPage) {
        retryPage = document.createElement('div');
        retryPage.id = "retry-main";
        retryPage.innerHTML = `
                <div>
                    <h2>Game Over</h2>
                    <p>Time Survived: <span id="time-display">00:00</span></p>
                    <button id="retry-btn">
                       Retry
                    </button>
                </div>
        `
        document.getElementById('game-container').appendChild(retryPage);
        const retryBtn = document.getElementById('retry-btn');
        if (retryBtn) {
            retryBtn.onclick = () => {
                hideRetryPage();
            }
        }
    }
}

export function hideRetryPage() {
    const retryPage = document.getElementById('retry-main');
    retryPage.style.display = 'none';
}

export function showRetryPage() {
    const retryPage = document.getElementById('retry-main');
    const timeDisplay = document.getElementById('time-display');

    if(retryPage){
        const finalTime = endTimer();

        timeDisplay.innerText = finalTime;
        console.log(finalTime);
    }
    retryPage.style.display = 'block';

     
}

initRetryPage();