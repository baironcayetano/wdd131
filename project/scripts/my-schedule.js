const calendar = document.getElementById("calendar");

let currentDate = new Date();
let date = new Date();

const dayOfTheWeek = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const months = ["January","February","March","April","May","June","July","August","September","October","November","Dicember"]
const dayNumber = date.getDate();

let selected = {
    day: 0,
    month: 0,
    year: 0,
}

const nextMonthButton = document.getElementById("next");
const lastMonthButton = document.getElementById("back");

const infoContainer = document.getElementById("info");

function getAppointments(month,year){
    return JSON.parse(localStorage.getItem(`ap-${month}-${year}`)) || [];
}

function getMonthCalendar(monthToEval, yearToEval){
    let days = new Date (yearToEval,monthToEval,0);
    return {month:monthToEval,year:yearToEval, days:days.getDate(), startDay:days.getDay()};
}

function createCalendar(month, year){
    month = month ? month :  date.getMonth() + 1;
    year = year ? year : date.getFullYear();
    let monthInfo = getMonthCalendar(month,year);
    let lastMonthInfo = getMonthCalendar(month-1,year);
    let nextMonthInfo = getMonthCalendar(month+1,year);

    //month
    const monthElement = document.getElementsByClassName("monthName")[0];
    let text = `${months[month-1]} (${date.getFullYear()})`;
    if(monthElement.id !== month) monthElement.id = month;
    if(monthElement.textContent !== text) monthElement.textContent = `${months[month-1]} (${date.getFullYear()})`;

    let content = "";
    let count = 0;

    //days empty (begenning)
    let daysEmpty = monthInfo.startDay;
    for (let i = 0; i < daysEmpty; i++) {
        let dayNumber = lastMonthInfo.days-daysEmpty+i;
        let attribute = -dayNumber;
        let element = document.getElementById(`d${count}`);
        element.setAttribute("data",attribute);
        element.classList.add("locked", "last");
        element.textContent = dayNumber;
        count++;
    }

    //days
    for (let i = 0; i < monthInfo.days; i++) {
        let dayNumber = i+1;
        let isToday = month === (currentDate.getMonth()+1) && dayNumber === currentDate.getDate(); 
        let className = isToday ? "day today" : "day";
        if(dayNumber === selected.day && month === selected.month && year === selected.year){
            className += " selected";
        }
        let elementContent = `<div class="${className}" id="${dayNumber}">
            <span class="dayNumber">${dayNumber}</span>
            ${isToday ? `<span class="dayNumber">Today</span>` : ""}
        </div>`;

        let element = document.getElementById(`d${count}`);
        element.classList = className;
        element.setAttribute("data",dayNumber);
        element.innerHTML = elementContent;
        count++;
    }

    let daysLeft = 7 - (count - 7) % 7;
    for (let i = 0; i < daysLeft; i++) {
        let dayNumber = i+1;
        let element = document.getElementById(`d${count}`);
        if(!element.classList.contains("locked")) element.classList.add("locked");
        if(!element.classList.contains("next")) element.classList.add("next");
        element.setAttribute("data",-dayNumber);
        element.innerHTML = `<span class="dayNumber">${dayNumber}</span>`;
        count++;
    }
   
   
}


function getMonth(){
    return parseInt(document.getElementsByClassName("monthName")[0].id) || date.getMonth()+1;
}

function getDayInfo(e){
    let metaDay = e.target.getAttribute("data") || e.target.parentNode.getAttribute("data") || e.target.parentNode.parentNode.getAttribute("data");
    if(Number.isNaN(parseInt(metaDay))) return

    //lastMonth day
    metaDay = parseInt(metaDay);
    if(metaDay < 0 && metaDay <= -10 ) {
        let month = getMonth();
        selected = {
            day:metaDay,
            month: month === 1 ? 12 : getMonth(),
            year: month === 1 ? date.getFullYear() - 1 : date.getFullYear(),
        }
        showLastMonth();
        return
    }
    //nextMonth day
    if(metaDay < 0 && metaDay >= -10){
        let month = getMonth();
        selected = {
            day:metaDay,
            month: month === 12 ? 1 : getMonth(),
            year: month === 12 ? date.getFullYear() + 1 : date.getFullYear(), 
        }
        showNextMonth();
        return
    }

    selected = {
        day:metaDay,
        month: getMonth(),
        year: date.getFullYear(), 
    }

    let prevSelected = document.getElementsByClassName("selected")[0];
    if(prevSelected){
       prevSelected.classList.remove("selected"); 
    }

    document.getElementById(metaDay).classList.add("selected");
    createCalendar(selected.month);
    displayAppointments(metaDay,getMonth(),date.getFullYear());
}


function showLastMonth(){
    let month = getMonth();
    if(month === 1){
        date = new Date(date.getFullYear()-1,11,1);
        document.getElementsByClassName("monthName")[0].id = 12;
        month = getMonth();
    }else{
        month -= 1;
    }
    createCalendar(month);
}

function showNextMonth(){
    let month = getMonth();
    if(month === 12){
       date = new Date(date.getFullYear()+1,0,1); 
       document.getElementsByClassName("monthName")[0].id = 1;
       month = getMonth();
    }else{
        month += 1;
    }
    createCalendar(month);
}

function expandInfo(e){
    let id = e.target.id || e.target.parentNode.id || e.target.parentNode.parentNode.id;
    if(!id || id.indexOf("s-") === -1) return;
    document.getElementById(id).classList.toggle("active");
}

function displayAppointments(day,month,year){
    let appointments = getAppointments(month,year);
    let dayAppt = appointments[day-1];
    if(!dayAppt){
        if(!infoContainer.classList.contains("empty")){
            infoContainer.classList.add("empty");
        }
        infoContainer.innerHTML = `<p>There are not appointments for this day</p>`;
        return
    }

    if(infoContainer.classList.contains("empty")) infoContainer.classList.remove("empty");

    let content = "<ul><h2>Appointments</h2>";
    dayAppt.forEach((appointment,i) => {
        content += `<li class="expand" id="s-${i}">
            <span class="small">name: ${appointment.name} | hour: ${appointment.description.hour}</span>
            <div class="description">
            <span>Description:</span>
            <p><strong>name:</strong> ${appointment.name}</p>
                <p><strong>hour:</strong> ${appointment.description.hour}</p>
                <p><strong>specialist:</strong> ${appointment.description.specialist}</p>
            </div>
        </li>`
    });
    content += "</ul>"
    infoContainer.innerHTML = content;

    let elements = document.getElementsByClassName("expand");
    if(elements){
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            element.addEventListener("click",expandInfo)
            
        }
    }

}

lastMonthButton.addEventListener("click",showLastMonth);
nextMonthButton.addEventListener("click",showNextMonth);

calendar.addEventListener("click",getDayInfo);

createCalendar();