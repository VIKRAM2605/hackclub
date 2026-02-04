import { resetPlayer } from "./CharacterMovement.js";
import { startGame, pauseGame, resumeGame, quitGame } from "./GameMechanics.js";
import { resetHealth } from "./HealthStateManagement.js";
import { resetNpcState } from "./NpcStateManagement.js";
import { pauseButton, showPauseMenu } from "./PauseMenu.js";
import { activeCoins, removeAllCoins, resumeAllCoins } from "./RandomCoinDrops.js";
import { activeSpills, pauseAllActiveSpills, removeAllActiveSpills, resumeAllPausedSpills } from "./RandomOilSpillage.js";
import { hideRetryPage } from "./RetryPage.js";
import { initStartPageButton } from "./ShopPage.js";
import { showStartPage, hideStartPage } from "./StartPage.js";
import { resetState, State } from "./StateManagement.js";
import { resetCookedFoodCount } from "./TotalCookedFoods.js";
import { displayBalance, hideBalance, initWallet } from "./Wallet.js";


hideBalance();
export function makeRetry() {
    if (sessionStorage.getItem('isRetry') === 'true') {
        sessionStorage.removeItem('isRetry');
        hideRetryPage();
        handleStartGame();
        removeAllCoins();
        removeAllActiveSpills();
        resetState();
        resetCookedFoodCount();
        resetNpcState();
        resetPlayer();
        resetHealth();
        initWallet(500);

        let modal = document.getElementById('npc-modal-overlay');
        if (modal){
            modal.remove();
        }
        modal = document.getElementById('cooking-modal-overlay');
        if (modal){
            modal.remove();
        }

    } else {
        showStartPage();
    }
}

export function handleStartGame() {
    hideStartPage();
    startGame();
    initStartPageButton();
    pauseButton()
}

makeRetry();

