
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
    retryPage.style.display = 'block';
}

initRetryPage();