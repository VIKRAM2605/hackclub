import { currentBalance, addBalance, initWallet } from "./Wallet.js";
import { pauseAllCoins, randomInt, removeAllCoins, resumeAllCoins, spawncoin } from "./RandomCoinDrops.js";
import { pauseAllActiveSpills, removeAllActiveSpills, resumeAllPausedSpills } from "./RandomOilSpillage.js";
import { showHealth } from "./HealthStateManagement.js";
import { hideRetryPage } from "./RetryPage.js";
import { hideShopBtn, showShopBtn } from "./ShopPage.js";

let spawnInterval = null;
export let UpperBoundForCoin = 120000
export let gameRunning = false;
export function startGame() {
    if (gameRunning) return;
    gameRunning = true;
    document.getElementById('canvas1').style.display = 'block';
    currentBalance(0);
    showHealth();
    document.body.addEventListener('click', coinClickHandler);
    showShopBtn();

    // Start spawning coins
    spawnInterval = setInterval(() => {
        spawncoin();
    }, randomInt(60000, UpperBoundForCoin));
}

export function pauseGame() {
    gameRunning = false;
    clearInterval(spawnInterval);
    pauseAllCoins();
    pauseAllActiveSpills(performance.now())

}

function coinClickHandler(e) {
    if (!gameRunning) return;
    if (e.target.classList.contains('coin')) {
        addBalance(randomInt(30, 100));
        e.target.remove();
    }
}

export function resumeGame() {
    // Restart interval without reinitializing everything
    gameRunning = true;
    resumeAllCoins();
    spawnInterval = setInterval(() => {
        spawncoin();
    }, randomInt(60000, 120000));
    resumeAllPausedSpills(performance.now())

}

export function quitGame() {
    window.location.reload()
}