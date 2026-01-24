import { player } from "./CharacterMovement.js";
import { shopTemplate } from "./InteractiveModals.js";
import { createModal } from "./StateManagement.js";

export function initStartPageButton(){
    buildStartPageButton();
}

export function buildStartPageButton(){
    let pageBtn = document.getElementById('main-shop-button-div');
    if(pageBtn) return;
    pageBtn = document.createElement('div');
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
        createModal('shop',shopTemplate,null,null,player);
    }

}

export function showShopBtn(){
    const showShopBtn = document.getElementById('main-shop-button-div');
    if(showShopBtn){
        showShopBtn.style.display = 'block';
    }
}

export function hideShopBtn(){
    const hideShopBtn = document.getElementById('main-shop-button-div');
    if(hideShopBtn){
        hideShopBtn.style.display = 'none';
    }
}