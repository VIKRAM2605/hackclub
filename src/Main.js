import { startGame, pauseGame, resumeGame, quitGame } from "./GameMechanics.js";
import { showPauseMenu } from "./PauseMenu.js";
import { removeAllCoins, resumeAllCoins } from "./RandomCoinDrops.js";
import { pauseAllActiveSpills, resumeAllPausedSpills } from "./RandomOilSpillage.js";
import { hideRetryPage } from "./RetryPage.js";
import { initStartPageButton } from "./ShopPage.js";
import { showStartPage, hideStartPage } from "./StartPage.js";
import { displayBalance, hideBalance } from "./Wallet.js";

showStartPage();
hideBalance();
hideRetryPage();
const startButton = document.getElementById('start-button');


export function handleStartGame() {
        hideStartPage();
        startGame();
        initStartPageButton();
}

const pauseButton = document.getElementById('pause-button');

pauseButton.addEventListener('click', () => {
    pauseGame();
    showPauseMenu();
})

