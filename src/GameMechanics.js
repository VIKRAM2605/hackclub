import { currentBalance, addBalance } from "./Wallet.js";
import { pauseAllCoins, randomInt, resumeAllCoins, spawncoin } from "./RandomCoinDrops.js";
import { pauseAllActiveSpills, resumeAllPausedSpills } from "./RandomOilSpillage.js";
import { showShopBtn } from "./ShopPage.js";
import { playCoinSound } from "./MusicAndSound.js";

var spawnInterval = null;
export var UpperBoundForCoin = 120000
export var gameRunning = false;
export function startGame() {
    if (gameRunning) return;
    gameRunning = true;
    document.getElementById('canvas1').style.display = 'block';
    currentBalance(0);
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
        playCoinSound();
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