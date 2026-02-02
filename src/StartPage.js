import { handleStartGame } from "./Main.js";
import { hidePauseMenu } from "./PauseMenu.js";
import { showSettingsPage } from "./Settings.js";
import { showHowToPlay } from "./HowToPlay.js";

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

    // Text
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

export async function showStartPage() {
    let startPage = document.getElementById('start-page');
    if (startPage) {
        startPage.style.display = 'flex';
        return;
    }

    startPage = document.createElement('div');
    startPage.id = 'start-page';
    
    Object.assign(startPage.style, {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        background: '#f5f5dc',
        zIndex: '9999'
    });

    const bgCanvas = document.createElement('canvas');
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
    Object.assign(bgCanvas.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        zIndex: '1'
    });

    const bgCtx = bgCanvas.getContext('2d');
    bgCtx.fillStyle = 'rgba(139, 69, 19, 0.1)'; 
    
    const patternSize = 20;
    for (let x = 0; x < bgCanvas.width; x += patternSize) {
        for (let y = 0; y < bgCanvas.height; y += patternSize) {
            if ((x + y) % (patternSize * 2) === 0) {
                bgCtx.fillRect(x, y, patternSize, patternSize);
            }
        }
    }

    startPage.appendChild(bgCanvas);

    const contentContainer = document.createElement('div');
    Object.assign(contentContainer.style, {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '40px',
        zIndex: '2',
        position: 'relative'
    });

    const title = document.createElement('div');
    title.textContent = 'COOKING SIM';
    Object.assign(title.style, {
        fontFamily: "'Pixelify Sans', sans-serif",
        fontSize: '80px',
        fontWeight: 'bold',
        color: '#5D4037',
        textShadow: '4px 4px 0px #8D6E63, 2px 2px 0px rgba(0,0,0,0.1)',
        letterSpacing: '4px',
        marginBottom: '20px'
    });

    const subtitle = document.createElement('div');
    subtitle.textContent = '🍳 Master the Kitchen 🍔';
    Object.assign(subtitle.style, {
        fontFamily: "'Pixelify Sans', sans-serif",
        fontSize: '24px',
        color: '#795548',
        textShadow: '1px 1px 0px rgba(255,255,255,0.5)',
        marginBottom: '20px'
    });

    const buttonContainer = document.createElement('div');
    Object.assign(buttonContainer.style, {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        alignItems: 'center'
    });

    const dpr = window.devicePixelRatio || 1;

    const startBtn = document.createElement('canvas');
    startBtn.id = 'start-btn-canvas';
    drawPixelButton(startBtn, 'START GAME', 'green', dpr, 1);
    startBtn.onclick = () => handleStartGame();

    const howToPlayBtn = document.createElement('canvas');
    howToPlayBtn.id = 'howtoplay-btn-canvas';
    drawPixelButton(howToPlayBtn, 'HOW TO PLAY', 'blue', dpr, 1);
    howToPlayBtn.onclick = () => showHowToPlay();

    const settingsBtn = document.createElement('canvas');
    settingsBtn.id = 'settings-btn-canvas';
    drawPixelButton(settingsBtn, 'SETTINGS', 'orange', dpr, 1);
    settingsBtn.onclick = () => showSettingsPage('start');

    buttonContainer.appendChild(startBtn);
    buttonContainer.appendChild(howToPlayBtn);
    buttonContainer.appendChild(settingsBtn);

    contentContainer.appendChild(title);
    contentContainer.appendChild(subtitle);
    contentContainer.appendChild(buttonContainer);

    startPage.appendChild(contentContainer);

    await document.fonts.ready;
    
    document.getElementById('game-container').appendChild(startPage);

    hidePauseMenu();
}

export function hideStartPage() {
    const hidePage = document.getElementById('start-page');
    if (hidePage) hidePage.style.display = 'none';
}