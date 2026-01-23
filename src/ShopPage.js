import { shopTemplate } from "./InteractiveModals.js";
import { createModal } from "./StateManagement.js";

export function initStartPageButton(){
    buildStartPageButton();
}

export function buildStartPageButton(){
    const pageBtn = document.createElement('div');
    pageBtn.id = "main-shop-button-div";
    pageBtn.innerHTML = `
        <div>
            <button id="shop-button">
                shop
            </button>
        </div>
                        `;
    document.getElementById('game-container').appendChild(pageBtn);
    const shopBtn = document.getElementById('shop-button');

    shopBtn.onclick=()=>{
        createModal('shop',shopTemplate,)
    }

}