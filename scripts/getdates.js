const currentYear = document.getElementById("currentyear");
const today = new Date();

currentYear.innerText = `${today.getFullYear()}`;

const lastModified = document.getElementById("lastModified");
lastModified.innerText = document.lastModified;
