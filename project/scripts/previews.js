function UpdatePreview(e,previewElements){
    const target = e.target;
    if(!previewElements[target.id]) return;
    const previewId = previewElements[target.id].id;

    const element = document.getElementById(previewId);
    if(target.value.length === 0){
        element.textContent = "Not specified";
        if(previewElements[target.id].isOptional)element.classList.add("empty-optional");
        else element.classList.add("empty");
        return
    }

    element.classList.remove("empty","empty-optional");
    element.textContent = `${target.value}`;

    return
}


function clearPreview(previewElements){

    for (const previewElement of Object.values(previewElements)) {
        const element = document.getElementById(previewElement.id);
        if(previewElement.isOptional){
            element.classList.add("empty-optional");
            element.textContent = "Optional";
            continue;
        }
            element.classList.add("empty");
            element.textContent = "Not specified";
        
    }
    
}