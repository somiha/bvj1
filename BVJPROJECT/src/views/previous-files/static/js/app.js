const ham = document.querySelector("#hamburger");
const nav = document.querySelector("#nav");

let isOpen = true;
document.querySelector("#hamburger").addEventListener('click', ()=>{
    if(isOpen){
        nav.style.left = "0";
        
    }else{
        nav.style.left = "-105%";
    }
    isOpen = !isOpen;
});