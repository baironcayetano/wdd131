const formulario = document.querySelector("form");

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

function getPatientsFromLocalStorage(){
    return JSON.parse(localStorage.getItem("patients")) || {};
}

function addPatientToLocalStorage(data){
    const patients = getPatientsFromLocalStorage();
    patients[data.id] = data;
    localStorage.setItem("patients",JSON.stringify(patients));
}

function existPatientInLocalStorage(data){
    patients = JSON.parse(localStorage.getItem("patients"));
    if(!patients || !patients[data.id]) return false;
    return true;
}

function AddPatient(e){
    e.preventDefault();

    const form = new FormData(formulario);
    const data = Object.fromEntries(form);
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

formulario.addEventListener("input",e=>UpdatePreview(e,previewPatientElements));
formulario.addEventListener("submit",AddPatient);


