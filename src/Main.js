import { resetPlayer } from "./CharacterMovement.js";
import { startGame } from "./GameMechanics.js";
import { resetHealth } from "./HealthStateManagement.js";
import { startBgMusic } from "./MusicAndSound.js";
import { resetNpcState } from "./NpcStateManagement.js";
import { pauseButton } from "./PauseMenu.js";
import { removeAllCoins } from "./RandomCoinDrops.js";
import { removeAllActiveSpills } from "./RandomOilSpillage.js";
import { hideRetryPage } from "./RetryPage.js";
import { initStartPageButton } from "./ShopPage.js";
import { showStartPage, hideStartPage } from "./StartPage.js";
import { resetState } from "./StateManagement.js";
import { resetCookedFoodCount } from "./TotalCookedFoods.js";
import { hideBalance, initWallet } from "./Wallet.js";


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
        if (modal) {
            modal.remove();
        }
        modal = document.getElementById('cooking-modal-overlay');
        if (modal) {
            modal.remove();
        }

    } else if (sessionStorage.getItem('isRetry') === 'false') {
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
        if (modal) {
            modal.remove();
        }
        modal = document.getElementById('cooking-modal-overlay');
        if (modal) {
            modal.remove();
        }
        showStartPage();
    }else{
         showStartPage();
    }
}

export function handleStartGame() {
    hideStartPage();
    startGame();
    initStartPageButton();
    pauseButton();
    startBgMusic();
}

makeRetry();

