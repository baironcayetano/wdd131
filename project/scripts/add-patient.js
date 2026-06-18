const form = document.querySelector("form");

const previewPatientElements = {
    "fname":{
        id:"fname-span",
        isOptional:false,
    },
    "lname":{
         id:"lname-span",
         isOptional:false,
    },
    "sex":{
        id:"sex-span",
        isOptional:false,
    },
    "age":{
        id:"age-span",
        isOptional:false,
    },
    "phone":{
        id:"phone-span",
        isOptional:false,
    },
    "email":{
        id:"email-span",
        isOptional:true,
    },
    "address":{
        id:"address-span",
        isOptiona:true,
    },
}


function AddPatient(e){
    e.preventDefault();

    const formdata = new FormData(form);
    const data = Object.fromEntries(formdata);
    data.id = `${data.fname}_${data.lname}_${data.age}`;

    if (existPatientInLocalStorage(data)){
        alert("This client already exist")
        return
    }
   
    addPatientToLocalStorage(data);
    clearPreview(previewPatientElements);
    alert("Patient created successfully!");
    e.target.reset();
}

form.addEventListener("input",e=>UpdatePreview(e,previewPatientElements));
form.addEventListener("submit",AddPatient);


