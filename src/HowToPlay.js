const buttonsSprite = new Image();
buttonsSprite.src = 'assets/Buttons.png';

export function drawPixelButton(canvas, text, theme, dpr, scale, isDisabled = false) {
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
        gray: { main: '#555555', light: '#777777', dark: '#333333', border: '#222222', text: '#aaaaaa' }
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

export function showHowToPlay() {
    let howToPlayPage = document.getElementById('how-to-play-page');
    if (howToPlayPage) {
        howToPlayPage.style.display = 'flex';
        return;
    }

    howToPlayPage = document.createElement('div');
    howToPlayPage.id = 'how-to-play-page';
    
    Object.assign(howToPlayPage.style, {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        zIndex: '10000',
        overflowY: 'auto',
        padding: '20px',
        boxSizing: 'border-box'
    });

    const contentContainer = document.createElement('div');
    Object.assign(contentContainer.style, {
        backgroundColor: '#eec39a',
        border: '4px solid #2d1e15',
        borderRadius: '8px',
        padding: '30px',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none' 
    });

    const title = document.createElement('h1');
    title.textContent = 'How to Play';
    Object.assign(title.style, {
        fontFamily: "'Pixelify Sans', sans-serif",
        fontSize: '36px',
        color: '#2d1e15',
        textAlign: 'center',
        marginBottom: '20px',
        marginTop: '0'
    });

    const instructions = document.createElement('div');
    Object.assign(instructions.style, {
        fontFamily: "'Pixelify Sans', sans-serif",
        fontSize: '16px',
        color: '#3e2723',
        lineHeight: '1.8'
    });

    instructions.innerHTML = `
        <h2 style="color: #2d1e15; font-size: 24px; margin-top: 20px; margin-bottom: 10px;">🎮 Controls</h2>
        <p><strong>Movement:</strong> Use <kbd>W/A/S/D</kbd> or <kbd>Arrow Keys</kbd> to move your character around the kitchen.</p>
        <p><strong>Interact with Objects:</strong> Press <kbd>E</kbd> when near cooking stations, stoves, or counters.</p>
        <p><strong>Interact with NPCs:</strong> Press <kbd>F</kbd> when near a customer to take their order.</p>
        <p><strong>Pause Game:</strong> Access the pause menu anytime during gameplay.</p>
        
        <h2 style="color: #2d1e15; font-size: 24px; margin-top: 20px; margin-bottom: 10px;">🍔 Objective</h2>
        <p>Run your restaurant by cooking food and serving customers! Keep your customers happy by fulfilling their orders quickly before their patience runs out.</p>
        
        <h2 style="color: #2d1e15; font-size: 24px; margin-top: 20px; margin-bottom: 10px;">👥 Customers</h2>
        <p><strong>Normal Customers:</strong> Serve them correctly to earn money. If you refuse or they leave angry, you lose health.</p>
        <p><strong>Killer Customers:</strong> These dangerous customers will hurt you if you serve them! Refuse their orders to stay safe.</p>
        <p><strong>Patience Bar:</strong> Watch the green/orange bar above waiting customers. When it runs out, they leave angry!</p>
        
        <h2 style="color: #2d1e15; font-size: 24px; margin-top: 20px; margin-bottom: 10px;">🍳 Cooking</h2>
        <p>1. Walk to a cooking station and press <kbd>E</kbd> to interact.</p>
        <p>2. Select the food item you want to cook.</p>
        <p>3. Wait for the cooking timer to complete.</p>
        <p>4. Your cooked food will be added to your inventory automatically.</p>
        
        <h2 style="color: #2d1e15; font-size: 24px; margin-top: 20px; margin-bottom: 10px;">💰 Economy</h2>
        <p><strong>Earn Money:</strong> Serve customers successfully to earn coins.</p>
        <p><strong>Collect Coins:</strong> Random coins drop around the kitchen - click them to collect!</p>
        <p><strong>Upgrade:</strong> Use your earnings to purchase upgrades in the shop.</p>
        
        <h2 style="color: #2d1e15; font-size: 24px; margin-top: 20px; margin-bottom: 10px;">⚠️ Hazards</h2>
        <p><strong>Oil Spills:</strong> Random oil spills appear on the floor. Walking over them will make you slip and lose control temporarily!</p>
        <p><strong>Health:</strong> You have limited health (shown as hearts in the top-right). Losing all health ends the game.</p>
        
        <h2 style="color: #2d1e15; font-size: 24px; margin-top: 20px; margin-bottom: 10px;">📈 Progression</h2>
        <p>As you serve more customers:</p>
        <ul style="margin-left: 20px;">
            <li>Orders become more complex (multiple items, larger quantities)</li>
            <li>Customer patience decreases</li>
            <li>Customers spawn more frequently</li>
            <li>The killer customer chance increases</li>
        </ul>
        
        <h2 style="color: #2d1e15; font-size: 24px; margin-top: 20px; margin-bottom: 10px;">💡 Tips</h2>
        <ul style="margin-left: 20px;">
            <li>Keep multiple food items ready in advance</li>
            <li>Watch for killer customers - look for suspicious dialogue!</li>
            <li>Don't let customers wait too long or you'll lose health</li>
            <li>Avoid oil spills to maintain control of your character</li>
            <li>Use the shop to buy upgrades that make cooking faster</li>
        </ul>
        
        <p style="text-align: center; margin-top: 30px; font-size: 18px; color: #d32f2f;">
            <strong>Good luck, Chef! 🍳</strong>
        </p>
    `;

    const closeButtonCanvas = document.createElement('canvas');
    closeButtonCanvas.id = 'how-to-play-close-btn';
    Object.assign(closeButtonCanvas.style, {
        marginTop: '20px',
        display: 'block'
    });

    const dpr = window.devicePixelRatio || 1;
    drawPixelButton(closeButtonCanvas, 'CLOSE', 'red', dpr, 1);

    closeButtonCanvas.onclick = () => {
        hideHowToPlay();
    };

    contentContainer.appendChild(title);
    contentContainer.appendChild(instructions);
    contentContainer.appendChild(closeButtonCanvas);
    howToPlayPage.appendChild(contentContainer);
    document.getElementById('game-container').appendChild(howToPlayPage);

    const escapeHandler = (e) => {
        if (e.key === 'Escape') {
            hideHowToPlay();
        }
    };
    document.addEventListener('keydown', escapeHandler);
    howToPlayPage.dataset.escapeHandler = 'attached';
}

export function hideHowToPlay() {
    const howToPlayPage = document.getElementById('how-to-play-page');
    if (howToPlayPage) {
        howToPlayPage.style.display = 'none';
    }
}