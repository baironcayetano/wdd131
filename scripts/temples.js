const menuIcon = document.getElementById("menuIcon");
const menu = document.getElementById("menu");

function ActivateMenu(){
    menuIcon.classList.toggle("active");
    menu.classList.toggle("active");
}

menuIcon.addEventListener("click",ActivateMenu);


const today = new Date();
const currentYear = today.getFullYear();
const lastModified = document.lastModified;

const yearElement = document.getElementById("currentYear");
const lastModifiedElement = document.getElementById("lastModified");

yearElement.textContent = currentYear.toString();
lastModifiedElement.textContent = `Last Modification ${lastModified}`;
