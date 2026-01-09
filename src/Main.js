import { startGame,pauseGame, resumeGame, quitGame } from "./GameMechanics.js";
import { hidePauseMenu, hidePauseMenuPage, showPauseMenu, showPauseMenuPage } from "./PauseMenu.js";
import { removeAllCoins, resumeAllCoins } from "./RandomCoinDrops.js";
import { showStartPage,hideStartPage } from "./StartPage.js";

hidePauseMenuPage();
showStartPage();
const startButton = document.getElementById('start-button');

startButton.addEventListener('click', () => {
    hideStartPage();
    startGame();
    showPauseMenu();
});

const pauseButton = document.getElementById('pause-button');

pauseButton.addEventListener('click',()=>{
    pauseGame();
    hidePauseMenu();
    showPauseMenuPage();
})

const resumeButton=document.getElementById('resume-button');

resumeButton.addEventListener('click',()=>{
    resumeGame();
    showPauseMenu();
    hidePauseMenuPage();
})

const quitToMainMenuButton=document.getElementById('quittomainmenu-button');

quitToMainMenuButton.addEventListener('click',()=>{
    quitGame();
    hidePauseMenu();
    hidePauseMenuPage();
    showStartPage();
    removeAllCoins();
})