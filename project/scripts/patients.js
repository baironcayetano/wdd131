function getPatientsFromLocalStorage(){
    return JSON.parse(localStorage.getItem("patients")) || {};
}

function addPatientToLocalStorage(data){
    const patients = getPatientsFromLocalStorage();
    patients[data.id] = data;
    localStorage.setItem("patients",JSON.stringify(patients));
}

function existPatientInLocalStorage(data){
    const patients = JSON.parse(localStorage.getItem("patients"));
    if(!patients || !patients[data.id]) return false;
    return true;
}

function findPatientLike(name){
    const patients = JSON.parse(localStorage.getItem("patients"));
    for (const patientName of Object.keys(patients)) {
        if(patientName.includes(name)) return patients[patientName];
    }
    return null;
}