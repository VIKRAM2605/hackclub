import { startGame,pauseGame, resumeGame, quitGame } from "./GameMechanics.js";
import { hidePauseMenu, hidePauseMenuPage, showPauseMenu, showPauseMenuPage } from "./PauseMenu.js";
import { removeAllCoins, resumeAllCoins } from "./RandomCoinDrops.js";
import { pauseAllActiveSpills, resumeAllPausedSpills } from "./RandomOilSpillage.js";
import { hideRetryPage } from "./RetryPage.js";
import { initStartPageButton } from "./ShopPage.js";
import { showStartPage,hideStartPage } from "./StartPage.js";
import { displayBalance, hideBalance } from "./Wallet.js";

hidePauseMenuPage();
showStartPage();
hideBalance();
hideRetryPage();
const startButton = document.getElementById('start-button');

startButton.addEventListener('click', () => {
    hideStartPage();
    startGame();
    showPauseMenu();
    displayBalance();
    initStartPageButton();
});

const pauseButton = document.getElementById('pause-button');

pauseButton.addEventListener('click',()=>{
    pauseGame();
    hidePauseMenu();
    showPauseMenuPage();
    hideBalance();
})

const resumeButton=document.getElementById('resume-button');

resumeButton.addEventListener('click',()=>{
    resumeGame();
    showPauseMenu();
    hidePauseMenuPage();
    displayBalance();
})

const quitToMainMenuButton=document.getElementById('quittomainmenu-button');

quitToMainMenuButton.addEventListener('click',()=>{
    quitGame();
    hidePauseMenu();
    hidePauseMenuPage();
    showStartPage();
    removeAllCoins();
    hideRetryPage();
});
