const today = new Date();
const currentYear = today.getFullYear();
const lastModified = document.lastModified;

const yearElement = document.getElementById("currentyear");
const lastModifiedElement = document.getElementById("lastModified");

yearElement.textContent = currentYear.toString();
lastModifiedElement.textContent = `Last Modification ${lastModified}`;



