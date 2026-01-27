import { handleStartGame } from "./Main.js";
import { hidePauseMenu } from "./PauseMenu.js";
import { showSettingsPage } from "./Settings.js";

const settingsSprite = new Image();
settingsSprite.src = 'assets/Settings.png';

const inventorySprite = new Image();
inventorySprite.src = 'assets/Inventory.png';

const buttonsSprite = new Image();
buttonsSprite.src = 'assets/Buttons.png';

const imagesLoaded = () => {
    return new Promise((resolve) => {
        let loadedCount = 0;
        const totalImages = 2;
        const onload = () => {
            loadedCount++;
            if (loadedCount === totalImages) resolve();
        };

        if (inventorySprite.complete) loadedCount++;
        else inventorySprite.onload = onload;

        if (buttonsSprite.complete) loadedCount++;
        else buttonsSprite.onload = onload;

        if (loadedCount === totalImages) resolve();
    });
};

export async function showStartPage() {
    let startPage = document.getElementById('start-page');
    if (startPage) {
        startPage.style.display = 'flex';
        return;
    }

    startPage = document.createElement('div');
    startPage.id = 'start-page';
    startPage.style.display = 'flex'
    startPage.style.flexDirection = 'column';
    startPage.style.alignItems = 'center';
    startPage.style.justifyContent = 'center';
    startPage.style.position = 'fixed';
    startPage.style.top = '0';
    startPage.style.left = '0';
    startPage.style.width = '100%';
    startPage.style.height = '100%';

    const startPageBgCanvas = document.createElement('canvas');

    const scale = 6;
    const sourceW = 98;
    const sourceH = 101;

    const dpr = window.devicePixelRatio || 1;
    const logicalW = sourceW * scale;
    const logicalH = sourceH * scale;

    startPageBgCanvas.width = logicalW * dpr;
    startPageBgCanvas.height = logicalH * dpr;

    startPageBgCanvas.style.width = `${logicalW}px`;
    startPageBgCanvas.style.height = `${logicalH}px`;

    const startPageBgctx = startPageBgCanvas.getContext('2d');

    startPageBgctx.scale(dpr, dpr);

    startPageBgctx.imageSmoothingEnabled = false;
    startPageBgctx.mozImageSmoothingEnabled = false;
    startPageBgctx.webkitImageSmoothingEnabled = false;

    const sBtnW = 42;
    const sBtnH = 15;
    const btnX = (sourceW / 2) - (sBtnW / 2);
    const btnY = (sourceH / 2) - (sBtnH / 2);

    const draw = () => {
        startPageBgctx.clearRect(0, 0, logicalW, logicalH);

        startPageBgctx.save();
        startPageBgctx.scale(scale, scale);

        startPageBgctx.drawImage(
            inventorySprite,
            7, 0, sourceW, sourceH,
            0, 0, sourceW, sourceH
        );

        startPageBgctx.drawImage(
            buttonsSprite,
            147, 113, sBtnW, sBtnH,
            btnX, btnY, sBtnW, sBtnH
        );

        startPageBgctx.drawImage(
            buttonsSprite,
            147, 113, sBtnW, sBtnH,
            btnX, btnY + 20, sBtnW, sBtnH
        )

        startPageBgctx.restore();

        startPageBgctx.fillStyle = "black";

        let textX = (btnX + (sBtnW / 2)) * scale;
        let textY = (btnY + (sBtnH / 2) + 0.5) * scale;

        startPageBgctx.font = `bold ${6 * scale}px 'Pixelify Sans', sans-serif`;
        startPageBgctx.textAlign = "center";
        startPageBgctx.textBaseline = "middle";

        startPageBgctx.fillText("Start", textX, textY);

        textY = (btnY + 20 + (sBtnH / 2) + 0.5) * scale;

        startPageBgctx.font = `bold ${6 * scale}px 'Pixelify Sans', sans-serif`;
        startPageBgctx.textAlign = "center";
        startPageBgctx.textBaseline = "middle";

        startPageBgctx.fillText("Settings", textX, textY);

    };

    startPageBgCanvas.addEventListener('click', (event) => {
        const rect = startPageBgCanvas.getBoundingClientRect();

        const mouseX = (event.clientX - rect.left) / scale;
        const mouseY = (event.clientY - rect.top) / scale;

        if (mouseX >= btnX && mouseX <= btnX + sBtnW &&
            mouseY >= btnY && mouseY <= btnY + sBtnH) {
            handleStartGame();
        }
        if (mouseX >= btnX && mouseX <= btnX + sBtnW &&
            mouseY >= btnY + 20 && mouseY <= btnY + sBtnH + 20) {
                showSettingsPage('start')
        }
    });

    startPageBgCanvas.addEventListener('mousemove', (event) => {
        const rect = startPageBgCanvas.getBoundingClientRect();

        const mouseX = (event.clientX - rect.left) / scale;
        const mouseY = (event.clientY - rect.top) / scale;

        const onStartBtn = mouseX >= btnX && mouseX <= btnX + sBtnW &&
            mouseY >= btnY && mouseY <= btnY + sBtnH;

        const onSettingsBtn = mouseX >= btnX && mouseX <= btnX + sBtnW &&
            mouseY >= btnY + 20 && mouseY <= btnY + 20 + sBtnH;

        if (onStartBtn || onSettingsBtn) {
            startPageBgCanvas.style.cursor = 'pointer';
        } else {
            startPageBgCanvas.style.cursor = 'default';
        }
    });

    await document.fonts.ready;
    await imagesLoaded();
    draw();

    startPage.appendChild(startPageBgCanvas);
    document.getElementById('game-container').appendChild(startPage);

    hidePauseMenu();
}

export function hideStartPage() {
    const hidePage = document.getElementById('start-page');
    if (hidePage) hidePage.style.display = 'none';
}