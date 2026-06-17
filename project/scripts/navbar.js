const menuIcon = document.getElementById("menuIcon");
const menu = document.getElementById("menu");

function menuController(){
    menuIcon.classList.toggle("active");
    menu.classList.toggle("active");
}

menuIcon.addEventListener("click",menuController)