export const grillTemplate = `
<div id="grill-modal" style="
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    cursor: default;
">
    <div style="position: relative; display: inline-block;">
        
        <canvas id="modal-bg-canvas" style="
            display: block;
            image-rendering: pixelated;
            image-rendering: crisp-edges;
        "></canvas>
        <canvas id="close-modal-canvas" style="
            position: absolute;
            top:0;
            right:0;
            z-index: 2;
            image-rendering: pixelated;
            image-rendering: crisp-edges;
        "></canvas>

        <div id="close-hitbox" style="
            position: absolute;
            top: 0;
            right: 0;
            width: 60px; 
            height: 60px;
            z-index: 10;
            cursor: pointer;
            pointer-events: auto;
            user-select: none;
        "></div>

        <div style="
            padding-top:30px;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            display:flex;
            align-items:center;
            justify-content:center;
            gap:20px;
        ">
            <div id="grill-left">
            <canvas id="canvas-sprite" style="
                z-index: 1;
                image-rendering: pixelated;
                image-rendering: crisp-edges;
                pointer-events: auto;
            "></canvas>
            </div>
            <div id="grill-right" style="
                display:flex;
                flex-direction:column;
                align-items:flex-start;
                justify-content:center;
                pointer-events:auto;
            ">
            <div>
            <canvas id="cooked-canvas-sprite" style="
            z-index: 1;
                image-rendering: pixelated;
                image-rendering: crisp-edges;
                cursor: pointer;
                pointer-events: auto;
            ">
            </canvas>
            </div>
            <div style="
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
                pointer-events: auto;
            ">
            <canvas id="slot-1" class="cooking-slot" style="
                z-index: 1;
                image-rendering: pixelated;
                image-rendering: crisp-edges;
                cursor: pointer;
                pointer-events: auto;
            "></canvas>

            <canvas id="slot-2" class="cooking-slot" style="
                z-index: 1;
                image-rendering: pixelated;
                image-rendering: crisp-edges;
                cursor: pointer;
                pointer-events: auto;
            "></canvas>

            <canvas id="slot-3" class="cooking-slot" style="
                z-index: 1;
                image-rendering: pixelated;
                image-rendering: crisp-edges;
                cursor: pointer;
                pointer-events: auto;
            "></canvas>

            <canvas id="slot-4" class="cooking-slot" style="
                z-index: 1;
                image-rendering: pixelated;
                image-rendering: crisp-edges;
                cursor: pointer;
                pointer-events: auto;
            "></canvas>
            </div>
            </div>
        </div>

    </div>
</div>
`;

export const npcConvoTemplate = `
<div id="npc-modal-wrapper" style="
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
">
    <div style="position: relative; width: 508px; height: 276px;">
        
        <canvas id="npc-bg-canvas" style="
            position: absolute; 
            top: 0; 
            left: 0; 
            z-index: 0;
            image-rendering: pixelated;
        "></canvas>

        <div style="position: absolute; top: 12px; right: 12px; z-index: 20; cursor: pointer;">
             <canvas id="close-modal-canvas" width="24" height="24" style="image-rendering: pixelated;"></canvas>
        </div>

        <div style="
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10;
            display: flex;
            padding: 30px; 
            box-sizing: border-box;
            gap: 20px;
            font-family: 'Pixelify Sans', monospace;
        ">
            
             <div style="
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            ">
                <canvas id="npc-sprite" width="100" height="150" style="
                    width: 100px; 
                    height: 150px; 
                    object-fit: contain; 
                    image-rendering: pixelated;
                "></canvas>
            </div>

            <div style="
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow: hidden; 
            ">
                <div id="npc-dialog" style="
                    height: 50px;
                    padding: 10px;
                    padding-bottom:2px;
                    font-size: 18px;
                    color: #3e2723; 
                    font-weight: bold;
                    line-height: 1.2;
                    overflow-y: auto;
                    margin-bottom: 10px;
                "></div>

                <div id="npc-foods" style="
                    display: flex;
                    flex-direction: row;
                    flex: 1;
                    overflow-x: hidden;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 10px;
                    padding-bottom: 5px;
                "></div>

                <div style="display: flex; gap: 15px; height: 40px; margin-top: auto;">
                    
                    <div style="position: relative; flex: 1; cursor: pointer;">
                        <canvas id="refuse-btn-canvas" width="130" height="40" style="
                            width: 100%; 
                            height: 100%; 
                            image-rendering: pixelated;
                        "></canvas>
                    </div>
                    
                    <div style="position: relative; flex: 1; cursor: pointer;">
                        <canvas id="serve-btn-canvas" width="130" height="40" style="
                            width: 100%; 
                            height: 100%; 
                            image-rendering: pixelated;
                        "></canvas>
                    </div>

                </div>
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