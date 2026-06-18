function getAppointmentsFromStorage(){
    return JSON.parse(localStorage.getItem("appointments")) || {};
}


function setAppointment(data){
    const appointments = getAppointmentsFromStorage();
    appointments[data.id] = data;
    localStorage.setItem("appointments",JSON.stringify(appointments));
}

function updateAppointment(data){
    let appointments = getAppointmentsFromStorage();
    let updatedAppointments = {};
    for (const appointmentId of Object.keys(appointments)) {
        if(appointmentId === data.id) continue;
        updatedAppointments[appointmentId] = appointments[appointmentId];
    }

    updatedAppointments[data.id] = data;
    delete updatedAppointments[data.id].appointment;
    localStorage.setItem("appointments",JSON.stringify(updatedAppointments));
}

function deleteAppointment(data){
    let appointments = getAppointmentsFromStorage();
    let updatedAppointments = {};
    for (const appointmentId of Object.keys(appointments)) {
        if(appointmentId === data.id) continue;
        updatedAppointments[appointmentId] = appointments[appointmentId];
    }
    localStorage.setItem("appointments",JSON.stringify(updatedAppointments));
}

function existAppointmentInStorage(data){
    appointments = JSON.parse(localStorage.getItem("appointments"));
    if(!appointments || !appointments[data.id]) return false;
    return true;
}