import {currentBalance, addBalance} from "./Wallet.js";
import {pauseAllCoins, randomInt, removeAllCoins, resumeAllCoins, spawncoin} from "./RandomCoinDrops.js";

let spawnInterval = null;
let gameRunning = false;
export function startGame() {
    if(gameRunning) return;
    gameRunning=true;
    currentBalance(0);
    
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
}

function coinClickHandler(e) {
    if(!gameRunning) return;
    if(e.target.classList.contains('coin')) {
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
}

export function quitGame(){
    pauseGame();
    removeAllCoins();
}