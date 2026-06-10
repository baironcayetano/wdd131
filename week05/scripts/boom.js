const userInput = document.querySelector("#favchap");
const addChapterButton = document.querySelector("#add-chapter");
const listElement = document.querySelector("#list");

function getChapterList(){
    return JSON.parse(localStorage.getItem("boomList"));
}

let chaptersArray = getChapterList() || [];

function setChapterList(){
    localStorage.setItem("boomList",JSON.stringify(chaptersArray))
}

function deleteChapter(chapter){
    chapter = chapter.slice(0, chapter.length - 1);
    chaptersArray = chaptersArray.filter((value) => value !== chapter)
    setChapterList();
}


function renderItem(item){
    const liElement = document.createElement("li");
    const deleteButton = document.createElement("button");

    liElement.textContent = item;
    deleteButton.setAttribute("aria-label","Close");
    deleteButton.textContent = "❌";

    liElement.append(deleteButton); 
    listElement.append(liElement);

    deleteButton.addEventListener("click",function(){
        deleteChapter(liElement.textContent);
        listElement.removeChild(liElement);
        userInput.focus();
    });
}

function displayList(){
    if(chaptersArray.length >= 1) chaptersArray.forEach((value,i) => {
        if(value.length >= 1) renderItem(value,i)
    });
}

function AddChapter(e){
    e.preventDefault();

    if (userInput.value.trim() === "" || userInput.value.length === 0){
        userInput.focus();
        return
    }

    chaptersArray.push(userInput.value);
    setChapterList();
    renderItem(userInput.value);
    userInput.value = "";

}

addChapterButton.addEventListener("click",AddChapter)
displayList();




