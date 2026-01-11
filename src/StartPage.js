import { hidePauseMenu } from "./PauseMenu.js";

export function showStartPage(){
    const showPage=document.getElementById('startpage');
    showPage.style.display='block';

    hidePauseMenu();
}
export function hideStartPage(){
    const hidePage=document.getElementById('startpage');
    hidePage.style.display='none';
    
}