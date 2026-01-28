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


export const npcConvoTemplate = `
<div id="npc-main" style="
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 450px;
    background: #1e1e24;
    color: #e0e0e0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    padding: 0;
    border-radius: 12px;
    border: 1px solid #333;
    z-index: 1000;
    box-shadow: 0 10px 40px rgba(0,0,0,0.6);
    display: flex;
    flex-direction: column;
    overflow: hidden;
">
    <div style="
        display: flex;
        justify-content: flex-end;
        padding: 10px;
        background: #25252d;
        border-bottom: 1px solid #333;
    ">
        <button id="close-modal" style="
            background: transparent;
            border: none;
            color: #888;
            font-size: 18px;
            cursor: pointer;
            font-weight: bold;
            transition: color 0.2s;
        " onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#888'">
            ✕
        </button>
    </div>

    <div id="npc-content" style="
        display: flex;
        padding: 20px;
        gap: 20px;
        align-items: flex-start;
    ">
        <div id="npc-left" style="
            flex-shrink: 0;
            width: 120px;
            height: 120px;
            background: #111;
            border-radius: 8px;
            border: 2px solid #333;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
        ">
            <canvas id="npc-sprite" style="width: 100%; height: 100%; object-fit: contain;"></canvas>
        </div>

        <div id="npc-right" style="
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-height: 120px;
        ">
            <div id="npc-dialog" style="
                background: #2a2a35;
                padding: 10px 12px;
                border-radius: 6px;
                font-size: 14px;
                line-height: 1.4;
                color: #ccc;
                margin-bottom: 15px;
                min-height: 50px;
            ">
            </div>

            <div id="npc-foods" style="margin-bottom: 10px;"></div>

            <div id="serve-div" style="
                display: flex;
                gap: 10px;
                margin-top: auto;
            ">
                <button id="unserve-button" style="
                    flex: 1;
                    padding: 8px;
                    border: none;
                    border-radius: 4px;
                    background: #3a3a45;
                    color: #fff;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: 600;
                    transition: background 0.2s;
                " onmouseover="this.style.background='#4a4a55'" onmouseout="this.style.background='#3a3a45'">
                    Refuse Order
                </button>
                
                <button id="serve-button" style="
                    flex: 1;
                    padding: 8px;
                    border: none;
                    border-radius: 4px;
                    background: #2e8b57;
                    color: #fff;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: 600;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                    transition: background 0.2s;
                " onmouseover="this.style.background='#3cb371'" onmouseout="this.style.background='#2e8b57'">
                    Serve Order
                </button>
            </div>
        </div>
    </div>
</div>
`;

export const shopTemplate = `
<style>
    #shop-items-scroll-container::-webkit-scrollbar {
        display: none;
    }
    #shop-items-scroll-container {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
</style>

<div id="shop-modal">
    <div style="position: relative; width: 392px; height: 596px;">
        
        <canvas id="shop-bg-canvas" style="position: absolute; top: 0; left: 0; z-index: 0;"></canvas>

        <div style="position: relative; z-index: 1; width: 100%; height: 100%; display: flex; flex-direction: column;">
            
            <div style="display: flex; justify-content: flex-end; padding-top: 12px; padding-right: 12px;">
                <canvas id="close-modal"></canvas>
            </div>

            <div style="
                display: flex;
                justify-content: flex-end;
                padding-right: 30px;
                margin-top: 30px;
            ">
                <span style="font-family: 'Pixelify Sans', sans-serif; font-size: 24px; font-weight: bold; color: black;">
                    $ <span id="display-money">0.00</span>
                </span>
            </div> 

            <div id="shop-items-scroll-container" style="
                flex-grow: 1; 
                overflow-y: auto; 
                margin-top: 20px; 
                margin-bottom: 20px; 
                padding-left: 20px;
                padding-right: 10px;
            ">           
                <div id="shop-items-container" style="
                    display: flex; 
                    flex-direction: row; 
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 15px;
                ">
                </div>
            </div>
        </div>
    </div>
</div>
`;