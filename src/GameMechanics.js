import { currentBalance, addBalance } from "./Wallet.js";
import { pauseAllCoins, randomInt, removeAllCoins, resumeAllCoins, spawncoin } from "./RandomCoinDrops.js";
import { pauseAllActiveSpills, removeAllActiveSpills, resumeAllPausedSpills } from "./RandomOilSpillage.js";
import { showHealth } from "./HealthStateManagement.js";

let spawnInterval = null;
export let gameRunning = false;
export function startGame() {
    if (gameRunning) return;
    gameRunning = true;
    currentBalance(0);
    showHealth();
    document.body.addEventListener('click', coinClickHandler);

    // Start spawning coins
    spawnInterval = setInterval(() => {
        spawncoin();
    }, randomInt(60000, 120000));
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
        addBalance(randomInt(1, 5));
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
    pauseGame();
    removeAllCoins();
    removeAllActiveSpills();
}