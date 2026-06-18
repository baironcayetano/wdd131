const patientSelector = document.getElementById("patient");
const appointmentSelector = document.getElementById("appointment");
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



function UpdateAppointmentSelector(){

    let appointmentSelectorChildren = appointmentSelector.getElementsByTagName("option");

    //deleting all previous nodes
    for (let i = 0; i < appointmentSelectorChildren.length; i++) {
        const element = appointmentSelector.lastChild;
        element.remove();
    }
    

     if(Object.values(getAppointmentsFromStorage()).length === 0 && appointmentSelector.getElementsByTagName("option").length === 0){
        let newOption = document.createElement("option");
        newOption.selected = true;
        newOption.disabled = true;
        newOption.textContent = "-- Select --";
        appointmentSelector.appendChild(newOption);
    }

    for(const appointment of Object.values(getAppointmentsFromStorage())) {
        let newOption = document.createElement("option");
        newOption.value = `${appointment.title} ${appointment.patient} ${appointment.time}`;
        newOption.setAttribute("value",newOption.value);
        newOption.textContent = `${appointment.title} - ${appointment.patient} (${appointment.date} | ${appointment.time})`;
        appointmentSelector.appendChild(newOption);
    }

    firstRun = false;
}

function UpdateClientListSelector(){
    for(const patient of Object.values(getPatientsFromLocalStorage())) {
        let newOption = document.createElement("option");
        newOption.value = `${patient.fname} ${patient.lname}`;
        newOption.setAttribute("value",newOption.value);
        newOption.textContent = `${patient.fname} ${patient.lname}  (${patient.age})`;
        patientSelector.appendChild(newOption);
    }
}


function UpdateForm(e){
    let target = e.target;
    if(!target || target.id !== "appointment") return

    UpdateClientListSelector();
    let button = document.getElementById("delete-appointment");
    if(button.hasAttribute("disabled")){
        button.classList.remove("disabled");
        button.removeAttribute("disabled");
    }

    let id = (target.value).split(" ").join("_");
    const date = getAppointmentsFromStorage()[id]

    if(!date) return;

    for(const data of Object.entries(date)) {
        //This will ingnore the id of the appointment
        if(data[0] === "id") continue;
        
        let element = document.getElementById(data[0]);
        if(data[0] === "patient"){
            element.value = data[1].split("_").join(" ");
            continue;
        }

        element.value = data[1];
    }
}

function Submit(e){
    e.preventDefault();
    
    const formdata = new FormData(form);
    const data = Object.fromEntries(formdata);
    data.id = `${data.title.split(" ").join("_")}_${data.patient.split(" ").join("_")}_${data.time}`;

    updateAppointment(data);
    clearPreview(previewAppointmentElements);
    alert("Appointment edited successfully!");
    UpdateAppointmentSelector();
    form.reset()
}

function Delete(e){
    e.preventDefault();

    const formdata = new FormData(form);
    const data = Object.fromEntries(formdata);
    
    if(!data || !data.title || !data.patient || !data.time || document.getElementById("delete-appointment").hasAttribute("disabled")){
        alert("You need to pick an appointment");
        return;
    }
    
    if(data.title.length <= 0 || data.patient.split(" ").join("_").length <= 0 && data.time.length <= 0){
        alert("You need to pick an appointment");
        return;
    }

    data.id = data.id = `${data.title.split(" ").join("_")}_${data.patient.split(" ").join("_")}_${data.time}`;
    deleteAppointment(data);
    UpdateAppointmentSelector();
    form.reset()
    alert("Appointment deleted successfully!");
    return
}

UpdateAppointmentSelector();

form.addEventListener("input",UpdateForm);
form.addEventListener("submit",Submit)
document.getElementById("delete-appointment").addEventListener("click",Delete);