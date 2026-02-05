import { pauseGame, resumeGame } from "./GameMechanics.js";
import { makeRetry } from "./Main.js";
import { playClickSound } from "./MusicAndSound.js";
import { showSettingsPage } from "./Settings.js";
import { playTimeTillNow } from "./TimeCalculation.js";

const closeSprite = new Image();
closeSprite.src = 'assets/Main_tiles.png';

const imagesLoaded = () => {
    return new Promise((resolve) => {
        let loadedCount = 0;
        const totalImages = 1;
        const onload = () => {
            loadedCount++;
            if (loadedCount === totalImages) resolve();
        };

        if (closeSprite.complete) loadedCount++;
        else closeSprite.onload = onload;

        if (loadedCount === totalImages) resolve();
    });
};

function drawPixelButton(canvas, text, theme, dpr, scale, isDisabled = false) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const logicalW = 130;
    const logicalH = 40;

    canvas.width = logicalW * dpr * scale;
    canvas.height = logicalH * dpr * scale;
    canvas.style.width = `${logicalW}px`;
    canvas.style.height = `${logicalH}px`;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr * scale, dpr * scale);
    ctx.imageSmoothingEnabled = false;

    const colors = {
        green: { main: '#4caf50', light: '#80e27e', dark: '#087f23', border: '#1b5e20', text: '#fff' },
        red: { main: '#d32f2f', light: '#ff6659', dark: '#9a0007', border: '#5d1010', text: '#fff' },
        gray: { main: '#555555', light: '#777777', dark: '#333333', border: '#222222', text: '#aaaaaa' },
        blue: { main: '#2196f3', light: '#64b5f6', dark: '#0d47a1', border: '#1565c0', text: '#fff' },
        orange: { main: '#ff9800', light: '#ffb74d', dark: '#e65100', border: '#bf360c', text: '#fff' }
    };

    let p = isDisabled ? colors.gray : colors[theme];
    if (!p) p = colors.gray;

    const w = logicalW;
    const h = logicalH;

    ctx.clearRect(0, 0, w, h);

    // Border
    ctx.fillStyle = p.border;
    ctx.fillRect(2, 0, w - 4, h);
    ctx.fillRect(0, 2, w, h - 4);
    ctx.fillRect(1, 1, w - 2, h - 2);
    // Main Body
    ctx.fillStyle = p.main;
    ctx.fillRect(2, 2, w - 4, h - 4);
    // Highlights
    ctx.fillStyle = p.light;
    ctx.fillRect(2, 2, w - 6, 2);
    ctx.fillRect(2, 2, 2, h - 6);
    // Shadows
    ctx.fillStyle = p.dark;
    ctx.fillRect(4, h - 4, w - 6, 2);
    ctx.fillRect(w - 4, 4, 2, h - 6);

    ctx.fillStyle = p.text;
    ctx.font = "16px 'Pixelify Sans', sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = p.border;
    ctx.fillText(text, (w / 2) + 2, (h / 2) + 2);
    ctx.fillStyle = p.text;
    ctx.fillText(text, w / 2, h / 2);

    canvas.style.cursor = isDisabled ? 'not-allowed' : 'pointer';
}

export function pauseButton() {

    let pauseBtn = document.createElement('div');
    pauseBtn.id = 'pause-btn-main';
    pauseBtn.style.position = 'absolute';
    pauseBtn.style.cursor = 'pointer';

    document.getElementById('game-container').appendChild(pauseBtn);

    const updatePosition = () => {
        const rect = document.getElementById('canvas1').getBoundingClientRect();

        const gameX = 10;
        const gameY = 10;

        const scale = 2.3;

        const finalLeft = rect.left + (gameX * scale);
        const finalTop = rect.top + (gameY * scale);

        pauseBtn.style.left = `${finalLeft}px`;
        pauseBtn.style.top = `${finalTop}px`;
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);

    const pauseBtnSprite = new Image();
    pauseBtnSprite.src = 'assets/pause-Photoroom.png';

    const pauseCanvas = document.createElement('canvas');
    const pausectx = pauseCanvas.getContext('2d');

    pauseCanvas.width = 40;
    pauseCanvas.height = 40;

    const drawButton = () => {
        pausectx.drawImage(
            pauseBtnSprite,
            80, 80, 65, 64,
            0, 0, 40, 40
        );
    };

    if (pauseBtnSprite.complete) {
        drawButton();
    } else {
        pauseBtnSprite.onload = drawButton;
    }

    pauseBtn.appendChild(pauseCanvas);

    pauseCanvas.addEventListener('click', (e) => {
        playClickSound();
        e.stopPropagation();
        hidePauseBtn();
        pauseGame();
        showPauseMenu();
    })
}

export function hidePauseBtn() {
    let pauseBtn = document.getElementById('pause-btn-main');
    if (pauseBtn) {
        pauseBtn.style.display = 'none';
    }
}

export function showPauseBtn() {
    let pauseBtn = document.getElementById('pause-btn-main');
    if (pauseBtn) {
        pauseBtn.style.display = 'block';
    }
}

export async function showPauseMenu() {
    await imagesLoaded();

    let pauseOverlay = document.createElement('div');
    pauseOverlay.id = 'pause-menu';
    Object.assign(pauseOverlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        zIndex: '1000',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(2px)'
    });

    let pauseModal = document.createElement('div');
    Object.assign(pauseModal.style, {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '400px',
        padding: '40px 20px',
        backgroundColor: '#eec39a',
        borderRadius: '12px',
        border: '4px solid #5D4037',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
    });

    const title = document.createElement('div');
    title.textContent = 'PAUSED';
    Object.assign(title.style, {
        fontFamily: "'Pixelify Sans', sans-serif",
        fontSize: '48px',
        fontWeight: 'bold',
        color: '#5D4037',
        marginBottom: '10px',
        textShadow: '3px 3px 0px rgba(0,0,0,0.1)'
    });
    pauseModal.appendChild(title);

    const timeText = document.createElement('div');
    timeText.textContent = 'Time Played';
    Object.assign(timeText.style, {
        fontFamily: "'Pixelify Sans', sans-serif",
        fontSize: '16px',
        color: '#5D4037',
        marginBottom: '5px'
    });
    pauseModal.appendChild(timeText);

    const timeValue = document.createElement('div');
    timeValue.textContent = playTimeTillNow();
    Object.assign(timeValue.style, {
        fontFamily: "'Pixelify Sans', sans-serif",
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#5D4037',
        marginBottom: '30px'
    });
    pauseModal.appendChild(timeValue);

    const dpr = window.devicePixelRatio || 1;

    const btnContainer = document.createElement('div');
    Object.assign(btnContainer.style, {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        alignItems: 'center'
    });

    const resumeBtn = document.createElement('canvas');
    drawPixelButton(resumeBtn, 'RESUME', 'green', dpr, 1);
    resumeBtn.onclick = () => {
        playClickSound();
        resumeGame();
        hidePauseMenu();
        showPauseBtn();
    };

    const settingsBtn = document.createElement('canvas');
    drawPixelButton(settingsBtn, 'SETTINGS', 'blue', dpr, 1);
    settingsBtn.onclick = () => {
        playClickSound();
        showSettingsPage('pause');
    };

    const quitBtn = document.createElement('canvas');
    drawPixelButton(quitBtn, 'QUIT', 'red', dpr, 1);
    quitBtn.onclick = () => {
        hidePauseMenu();
        playClickSound();
        localStorage.setItem("isRetry", "false");
        makeRetry();
    };

    btnContainer.appendChild(resumeBtn);
    btnContainer.appendChild(settingsBtn);
    btnContainer.appendChild(quitBtn);
    pauseModal.appendChild(btnContainer);

    const closeCanvas = document.createElement('canvas');
    const closeW = 9;
    const closeH = 9;
    const closeScale = 4;
    const closeLogicalW = closeW * closeScale;
    const closeLogicalH = closeH * closeScale;

    closeCanvas.width = closeLogicalW * dpr;
    closeCanvas.height = closeLogicalH * dpr;
    Object.assign(closeCanvas.style, {
        width: `${closeLogicalW}px`,
        height: `${closeLogicalH}px`,
        position: 'absolute',
        top: '15px',
        right: '15px',
        cursor: 'pointer'
    });

    const closectx = closeCanvas.getContext('2d');
    closectx.imageSmoothingEnabled = false;
    closectx.scale(dpr * closeScale, dpr * closeScale);

    closectx.drawImage(
        closeSprite,
        356, 291, closeW, closeH,
        0, 0, closeW, closeH
    );

    closeCanvas.onclick = () => {
        playClickSound();
        resumeGame();
        hidePauseMenu();
        showPauseBtn();
    };

    pauseModal.appendChild(closeCanvas);

    pauseOverlay.appendChild(pauseModal);
    document.getElementById('game-container').appendChild(pauseOverlay);
}

export function hidePauseMenu() {
    const pauseMenu = document.getElementById('pause-menu');
    if (pauseMenu) {
        pauseMenu.remove();
    }
}