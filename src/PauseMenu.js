import { quitGame, resumeGame } from "./GameMechanics.js";
import { removeAllCoins } from "./RandomCoinDrops.js";
import { hideRetryPage } from "./RetryPage.js";
import { showSettingsPage } from "./Settings.js";
import { showStartPage } from "./StartPage.js";
import { playTimeTillNow } from "./TimeCalculation.js";

const settingsSprite = new Image();
settingsSprite.src = 'assets/Settings.png';

const inventorySprite = new Image();
inventorySprite.src = 'assets/Inventory.png';

const buttonsSprite = new Image();
buttonsSprite.src = 'assets/Buttons.png';

const sliderSprite = new Image();
sliderSprite.src = 'assets/slider-Photoroom.png';

const imagesLoaded = () => {
    return new Promise((resolve) => {
        let loadedCount = 0;
        const totalImages = 4;
        const onload = () => {
            loadedCount++;
            if (loadedCount === totalImages) resolve();
        };

        if (inventorySprite.complete) loadedCount++;
        else inventorySprite.onload = onload;

        if (buttonsSprite.complete) loadedCount++;
        else buttonsSprite.onload = onload;

        if (settingsSprite.complete) loadedCount++;
        else settingsSprite.onload = onload;

        if (sliderSprite.complete) loadedCount++;
        else sliderSprite.onload = onload;


        if (loadedCount === totalImages) resolve();
    });
};

export async function showPauseMenu() {

    let pauseMenu = document.createElement('div');
    pauseMenu.id = 'pause-menu';

    Object.assign(pauseMenu.style, {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        zIndex: '1000',
        cursor: 'default'
    });

    const pauseSpriteLocation = {
        btn: { x: 196, y: 162, w: 39, h: 13 },
        closeBtn: { x: 144, y: 112, w: 25, h: 16 }
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const scale = 4;
    const sourceW = 98;
    const sourceH = 149;

    const dpr = window.devicePixelRatio || 1;
    const logicalW = sourceW * scale;
    const logicalH = sourceH * scale;

    canvas.width = logicalW * dpr;
    canvas.height = logicalH * dpr;

    canvas.style.width = `${logicalW}px`;
    canvas.style.height = `${logicalH}px`;

    ctx.scale(dpr, dpr);

    ctx.imageSmoothingEnabled = false;

    const centerXForBtn = (sourceW / 2) - (pauseSpriteLocation['btn'].w / 2);
    const centerYForBtn = (sourceH / 2) - (pauseSpriteLocation['btn'].h / 2);

    const centerYForBtnOffset = -1;

    const centerXForText = (sourceW / 2) - (10 / 2);
    const centerYForText = (sourceH / 2) - (10 / 2);

    const draw = () => {

        ctx.clearRect(0, 0, logicalW, logicalH);

        ctx.save();

        ctx.scale(scale, scale);

        ctx.drawImage(
            settingsSprite,
            7, 0, sourceW, sourceH,
            0, 0, sourceW, sourceH
        );

        ctx.drawImage(
            inventorySprite,
            pauseSpriteLocation['closeBtn'].x, pauseSpriteLocation['closeBtn'].y, pauseSpriteLocation['closeBtn'].w, pauseSpriteLocation['closeBtn'].h,
            sourceW - pauseSpriteLocation['closeBtn'].w, 0, pauseSpriteLocation['closeBtn'].w, pauseSpriteLocation['closeBtn'].h
        )

        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.font = `bold 10px 'Pixelify Sans', sans-serif`;

        ctx.fillText("Time Played", centerXForText + 5, centerYForText - 40)
        ctx.fillText(`${playTimeTillNow()}`, centerXForText + 5, centerYForText - 20);

        const btn = pauseSpriteLocation['btn'];

        ctx.drawImage(
            settingsSprite,
            btn.x, btn.y, btn.w, btn.h,
            centerXForBtn, centerYForBtn, btn.w, btn.h
        );

        ctx.drawImage(
            settingsSprite,
            btn.x, btn.y, btn.w, btn.h,
            centerXForBtn, centerYForBtn + 25, btn.w, btn.h
        );

        ctx.drawImage(
            settingsSprite,
            btn.x, btn.y, btn.w, btn.h,
            centerXForBtn, centerYForBtn + 50, btn.w, btn.h
        );

        ctx.font = `bold 6px 'Pixelify Sans', sans-serif`;


        ctx.fillText("Resume", centerXForBtn + (btn.w / 2), centerYForBtn + centerYForBtnOffset + (btn.h / 2) + 0.5);

        ctx.fillText("Settings", centerXForBtn + (btn.w / 2), centerYForBtn + 25 + centerYForBtnOffset + (btn.h / 2) + 0.5);

        ctx.fillText("Quit", centerXForBtn + (btn.w / 2), centerYForBtn + 50 + centerYForBtnOffset + (btn.h / 2) + 0.5);

        ctx.restore();
    }

    await imagesLoaded();
    draw();

    pauseMenu.appendChild(canvas);
    document.getElementById('game-container').appendChild(pauseMenu);

    const getGameMousePos = (e) => {
        const rect = canvas.getBoundingClientRect();

        const mouseX = (e.clientX - rect.left) / scale;
        const mouseY = (e.clientY - rect.top) / scale;

        return { x: mouseX, y: mouseY };
    };

    canvas.addEventListener('mousedown', (e) => {
        const pos = getGameMousePos(e);

        const btn = pauseSpriteLocation['btn'];

        if (pos.x >= centerXForBtn && pos.x <= centerXForBtn + btn.w &&
            pos.y >= centerYForBtn && pos.y <= centerYForBtn + btn.h) {
            resumeGame();
            hidePauseMenu();
        }
        if (pos.x >= centerXForBtn && pos.x <= centerXForBtn + btn.w &&
            pos.y >= centerYForBtn + 25 && pos.y <= centerYForBtn + 25 + btn.h) {
            showSettingsPage();
        }
        if (pos.x >= centerXForBtn && pos.x <= centerXForBtn + btn.w &&
            pos.y >= centerYForBtn + 50 && pos.y <= centerYForBtn + 50 + btn.h) {
            quitGame();
            removeAllCoins();
            hideRetryPage();
            showStartPage();
            hidePauseMenu();
        }
        if (pos.x >= sourceW - pauseSpriteLocation['closeBtn'].w + 12 && pos.x <= sourceW &&
            pos.y >= 0 && pos.y <= 0 + pauseSpriteLocation['closeBtn'].h) {
            hidePauseMenu();
        }
    });

    canvas.addEventListener('mousemove', (e) => {
        const pos = getGameMousePos(e);
        const btn = pauseSpriteLocation['btn'];
        const closeBtn = pauseSpriteLocation['closeBtn'];

        const onResume = pos.x >= centerXForBtn && pos.x <= centerXForBtn + btn.w &&
            pos.y >= centerYForBtn && pos.y <= centerYForBtn + btn.h;

        const onSettings = pos.x >= centerXForBtn && pos.x <= centerXForBtn + btn.w &&
            pos.y >= centerYForBtn + 25 && pos.y <= centerYForBtn + 25 + btn.h;

        const onQuit = pos.x >= centerXForBtn && pos.x <= centerXForBtn + btn.w &&
            pos.y >= centerYForBtn + 50 && pos.y <= centerYForBtn + 50 + btn.h;

        const onClose = pos.x >= sourceW - closeBtn.w + 12 && pos.x <= sourceW &&
            pos.y >= 0 && pos.y <= closeBtn.h;

        canvas.style.cursor = (onResume || onSettings || onQuit || onClose) ? 'pointer' : 'default';
    });
}

export function hidePauseMenu() {
    const pauseMenu = document.getElementById('pause-menu');
    if (pauseMenu) {
        pauseMenu.remove();
    }
}