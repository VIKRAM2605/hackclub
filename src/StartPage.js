export function showStartPage(){
    const showPage=document.getElementById('startpage');
    showPage.style.display='block';

    const HideGame=document.getElementById('game-container');
    HideGame.style.display='none';
}
export function hideStartPage(){
    const hidePage=document.getElementById('startpage');
    hidePage.style.display='none';
    
    const showGame=document.getElementById('game-container');
    showGame.style.display='block';
}