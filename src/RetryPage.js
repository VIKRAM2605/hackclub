import { handleStartGame, makeRetry } from "./Main.js";
import { endTimer, startTimer } from "./TimeCalculation.js";

let overlayCanvas = null;
let isVisible = false;
let animationId = null;

let retryBtnRegion = { x: 0, y: 0, w: 0, h: 0 };
let quitBtnRegion = { x: 0, y: 0, w: 0, h: 0 };

let mousePos = { x: 0, y: 0 };
let hoveredButton = null;
let finalTimeCache = "00:00";

const COLORS = {
    overlay: 'rgba(0, 0, 0, 0.75)',
    panel: {
        bg: '#eec39a',
        borderOuter: '#2d1e15',
        borderInner: '#8b5e3c',
        accent: '#3e2723'
    },
    text: {
        title: '#d32f2f',
        label: '#5d4037',
        value: '#000000'
    },
    btn: {
        green: { main: '#4caf50', light: '#80e27e', dark: '#087f23', border: '#1b5e20', text: '#fff' },
        red: { main: '#d32f2f', light: '#ff6659', dark: '#9a0007', border: '#5d1010', text: '#fff' }
    }
};

export function showRetryPage() {
    if (isVisible) return;

    const gameCanvas = document.getElementById('canvas1');
    if (!gameCanvas) return;

    finalTimeCache = endTimer();
    isVisible = true;

    if (!overlayCanvas) {
        createOverlayCanvas();
    }

    if (!overlayCanvas.parentNode) {
        document.body.appendChild(overlayCanvas);
    }

    handleResize();

    startRenderLoop();

    window.addEventListener('resize', handleResize);
}

export function hideRetryPage() {
    if (overlayCanvas && overlayCanvas.parentNode) {
        overlayCanvas.parentNode.removeChild(overlayCanvas);
    }
    isVisible = false;
    cancelAnimationFrame(animationId);
    window.removeEventListener('resize', handleResize);
}

function createOverlayCanvas() {
    overlayCanvas = document.createElement('canvas');
    overlayCanvas.id = 'retry-overlay';
    overlayCanvas.style.position = 'absolute';
    overlayCanvas.style.zIndex = '9999';
    overlayCanvas.style.cursor = 'default';

    overlayCanvas.addEventListener('mousemove', (e) => {
        const rect = overlayCanvas.getBoundingClientRect();
        mousePos.x = e.clientX - rect.left;
        mousePos.y = e.clientY - rect.top;

        let nextHover = null;
        if (isInside(mousePos, retryBtnRegion)) nextHover = 'retry';
        else if (isInside(mousePos, quitBtnRegion)) nextHover = 'quit';

        if (hoveredButton !== nextHover) {
            hoveredButton = nextHover;
            overlayCanvas.style.cursor = hoveredButton ? 'pointer' : 'default';
        }
    });

    overlayCanvas.addEventListener('click', () => {
        if (hoveredButton === 'retry') {

            sessionStorage.setItem('isRetry', 'true');
            makeRetry()
            
        } else if (hoveredButton === 'quit') {
            window.location.reload();
        }
    });
}

function handleResize() {
    const gameCanvas = document.getElementById('canvas1');
    if (!gameCanvas || !overlayCanvas) return;

    const rect = gameCanvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    overlayCanvas.style.left = `${rect.left}px`;
    overlayCanvas.style.top = `${rect.top}px`;
    overlayCanvas.style.width = `${rect.width}px`;
    overlayCanvas.style.height = `${rect.height}px`;

    overlayCanvas.width = Math.floor(rect.width * dpr);
    overlayCanvas.height = Math.floor(rect.height * dpr);
}

function startRenderLoop() {
    if (!isVisible) return;
    draw();
    animationId = requestAnimationFrame(startRenderLoop);
}

function draw() {
    if (!overlayCanvas) return;
    const ctx = overlayCanvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const w = overlayCanvas.width / dpr;
    const h = overlayCanvas.height / dpr;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = false;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = COLORS.overlay;
    ctx.fillRect(0, 0, w, h);

    const panelW = Math.max(450, Math.floor(w * 0.5));
    const panelH = Math.max(300, Math.floor(h * 0.4));
    const panelX = Math.floor((w - panelW) / 2);
    const panelY = Math.floor((h - panelH) / 2);

    drawNicePanel(ctx, panelX, panelY, panelW, panelH);

    const centerX = panelX + (panelW / 2);
    let currentY = panelY + 60;

    ctx.textAlign = 'center';
    ctx.fillStyle = COLORS.text.title;
    ctx.font = "bold 48px 'Pixelify Sans', sans-serif";

    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillText("GAME OVER", centerX + 2, currentY + 2);
    ctx.fillStyle = COLORS.text.title;
    ctx.fillText("GAME OVER", centerX, currentY);

    currentY += 60;

    ctx.fillStyle = COLORS.text.label;
    ctx.font = "24px 'Pixelify Sans', sans-serif";
    ctx.fillText("Time Survived", centerX, currentY);

    currentY += 40;

    ctx.fillStyle = COLORS.text.value;
    ctx.font = "bold 40px 'Pixelify Sans', sans-serif";
    ctx.fillText(finalTimeCache, centerX, currentY);

    const btnW = 140;
    const btnH = 45;
    const gap = 30;
    const buttonsY = panelY + panelH - 80;

    const totalBtnW = (btnW * 2) + gap;
    const startX = centerX - (totalBtnW / 2);

    retryBtnRegion = { x: startX, y: buttonsY, w: btnW, h: btnH };
    drawFancyButton(ctx, retryBtnRegion, "RETRY", COLORS.btn.green, hoveredButton === 'retry');

    quitBtnRegion = { x: startX + btnW + gap, y: buttonsY, w: btnW, h: btnH };
    drawFancyButton(ctx, quitBtnRegion, "QUIT", COLORS.btn.red, hoveredButton === 'quit');
}


function drawNicePanel(ctx, x, y, w, h) {

    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(x + 10, y + 10, w, h);

    ctx.fillStyle = COLORS.panel.bg;
    ctx.fillRect(x, y, w, h);

    const lw = 4;

    ctx.fillStyle = COLORS.panel.borderOuter;
    ctx.fillRect(x, y, w, lw); // Top
    ctx.fillRect(x, y + h - lw, w, lw); // Bottom
    ctx.fillRect(x, y, lw, h); // Left
    ctx.fillRect(x + w - lw, y, lw, h); // Right

    ctx.fillStyle = COLORS.panel.borderInner;
    ctx.fillRect(x + lw, y + lw, w - (lw * 2), lw); // Top
    ctx.fillRect(x + lw, y + h - (lw * 2), w - (lw * 2), lw); // Bottom
    ctx.fillRect(x + lw, y + lw, lw, h - (lw * 2)); // Left
    ctx.fillRect(x + w - (lw * 2), y + lw, lw, h - (lw * 2)); // Right

    ctx.fillStyle = COLORS.panel.accent;
    const cornerSize = 8;
    ctx.fillRect(x, y, cornerSize, cornerSize);
    ctx.fillRect(x + w - cornerSize, y, cornerSize, cornerSize);
    ctx.fillRect(x, y + h - cornerSize, cornerSize, cornerSize);
    ctx.fillRect(x + w - cornerSize, y + h - cornerSize, cornerSize, cornerSize);
}

function drawFancyButton(ctx, rect, text, theme, isHovered) {
    const { x, y, w, h } = rect;

    const drawX = x + (isHovered ? 0 : 0);
    const drawY = y + (isHovered ? 2 : 0);

    const drawX_Fixed = x;
    const drawY_Fixed = y + (isHovered ? 2 : 0);

    //Border
    ctx.fillStyle = theme.border;
    ctx.fillRect(drawX_Fixed + 2, drawY_Fixed, w - 4, h);
    ctx.fillRect(drawX_Fixed, drawY_Fixed + 2, w, h - 4);
    ctx.fillRect(drawX_Fixed + 1, drawY_Fixed + 1, w - 2, h - 2);

    ctx.fillStyle = isHovered ? theme.light : theme.main;
    ctx.fillRect(drawX_Fixed + 2, drawY_Fixed + 2, w - 4, h - 4);

    //Highlights
    ctx.fillStyle = theme.light;
    ctx.fillRect(drawX_Fixed + 2, drawY_Fixed + 2, w - 6, 2);
    ctx.fillRect(drawX_Fixed + 2, drawY_Fixed + 2, 2, h - 6);

    //Shadows
    ctx.fillStyle = theme.dark;
    ctx.fillRect(drawX_Fixed + 4, drawY_Fixed + h - 4, w - 6, 2);
    ctx.fillRect(drawX_Fixed + w - 4, drawY_Fixed + 4, 2, h - 6);

    //Text
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = "16px 'Pixelify Sans', sans-serif";

    ctx.fillStyle = theme.border;
    ctx.fillText(text, drawX_Fixed + (w / 2) + 2, drawY_Fixed + (h / 2) + 2);

    //Main Text
    ctx.fillStyle = theme.text;
    ctx.fillText(text, drawX_Fixed + (w / 2), drawY_Fixed + (h / 2));
}

function isInside(pos, rect) {
    return pos.x >= rect.x &&
        pos.x <= rect.x + rect.w &&
        pos.y >= rect.y &&
        pos.y <= rect.y + rect.h;
}
