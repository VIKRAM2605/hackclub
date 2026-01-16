export const grillTemplate = `
<div id="grill-main" style="
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
    height: 200px;
    background: #2a2a2a;
    padding: 20px;
    border-radius: 10px;
    z-index: 1000;
    display: flex;
    gap: 20px;
    box-shadow: 0 0 20px rgba(0,0,0,0.8);
    display:flex;
    flex-direction:column;
">
<div>
<button id="close-modal">
X
</button>
</div>
<div id="grill-content"
style="
display:flex;
align-items:center;
justify-content:center;
"
>
  <div id="grill-left" style="flex: 1;">
    <canvas id="canvas-sprite" style="width: 100%; height: 200px; border: 1px solid #555;"></canvas>
  </div>

  <div id="grill-right" style="flex: 1;">
    <canvas id="cooked-canvas-sprite" style="width: 100%; height: 20px; border: 1px solid #555; margin-bottom: 10px;"></canvas>
    <div id="slots" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
      <canvas id="slot-1" style="width: 100%; height: 80px; border: 2px solid #666; cursor: pointer;"></canvas>
      <canvas id="slot-2" style="width: 100%; height: 80px; border: 2px solid #666; cursor: pointer;"></canvas>
      <canvas id="slot-3" style="width: 100%; height: 80px; border: 2px solid #666; cursor: pointer;"></canvas>
      <canvas id="slot-4" style="width: 100%; height: 80px; border: 2px solid #666; cursor: pointer;"></canvas>
    </div>
  </div>
  </div>
</div>

<div id="modal-backdrop" style="
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.7);
    z-index: 999;
"></div>
`;
