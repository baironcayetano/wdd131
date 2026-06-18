const patientSelector = document.getElementById("patient");
const form = document.querySelector("form");

previewAppointmentElements = {
    "title":{
        id:"title-span",
        isOptional:false,
    },
    "patient":{
         id:"patient-span",
         isOptional:false,
    },
    "date":{
        id:"date-span",
        isOptional:false,
    },
    "time":{
        id:"hour-span",
        isOptional:false,
    },
    "description":{
        id:"description-span",
        isOptional:true,
    }
}

function UpdateClientListSelector(){
    for(const patient of Object.values(getPatientsFromLocalStorage())) {
        let newOption = document.createElement("option");
        newOption.value = `${patient.fname}_${patient.lname}`;
        newOption.textContent = `${patient.fname} ${patient.lname}  (${patient.age})`;
        patientSelector.appendChild(newOption);
    }
}


function Submit(e){
    e.preventDefault();
    
    const formdata = new FormData(form);
    const data = Object.fromEntries(formdata);
    data.id = `${data.title.split(" ").join("_")}_${data.patient.split(" ").join("_")}_${data.time}`;
    
    if(existAppointmentInStorage(data)){
        alert("This appointment already exist")
        return
    }

    setAppointment(data);
    clearPreview(previewAppointmentElements);
    alert("Appointment created successfully!");
    e.target.reset();
}

UpdateClientListSelector();
form.addEventListener("input",e=>UpdatePreview(e,previewAppointmentElements))
form.addEventListener("submit",Submit)
