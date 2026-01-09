import { startGame,pauseGame } from "./GameMechanics.js";
import { showStartPage,hideStartPage } from "./StartPage.js";

showStartPage();

const startButton = document.getElementById('start-button');

startButton.addEventListener('click', () => {
    hideStartPage();
    startGame();
});