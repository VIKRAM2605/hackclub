import {currentBalance, addBalance} from "./Wallet.js";
import {randomInt, spawncoin} from "./RandomCoinDrops.js";

let spawnInterval = null;

export function startGame() {
    currentBalance(0);
    
    document.body.addEventListener('click', coinClickHandler);
    
    // Start spawning coins
    spawnInterval = setInterval(() => {
        spawncoin();
    }, randomInt(5000, 10000));
}

export function pauseGame() {
    clearInterval(spawnInterval);
}

function coinClickHandler(e) {
    if(e.target.classList.contains('coin')) {
        addBalance(randomInt(1, 5));
        e.target.remove();
    }
}
