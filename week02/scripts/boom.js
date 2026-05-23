const userInput = document.querySelector("#favchap");
const addChapterButton = document.querySelector("#add-chapter");
const listElement = document.querySelector("#list");


function AddChapter(e){
    e.preventDefault();

    if (userInput.value.trim() === ""){
        userInput.focus();
        return
    }

    const liElement = document.createElement("li");
    const deleteButton = document.createElement("button");

    liElement.textContent = userInput.value;
    deleteButton.setAttribute("aria-label","Close");
    deleteButton.textContent = "❌";

    liElement.append(deleteButton); 
    listElement.append(liElement);

    deleteButton.addEventListener("click",function(){
        listElement.removeChild(liElement);
        userInput.focus();
    });

    userInput.value = "";

}

addChapterButton.addEventListener("click",AddChapter)




