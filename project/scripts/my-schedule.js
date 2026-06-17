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
    let firstDay = new Date(yearToEval, monthToEval,1).getDay();
    return {month:monthToEval,year:yearToEval, days:days.getDate(), startDay:firstDay};
}

function createCalendar(month, year){
    month = month ? month :  date.getMonth();
    year = year ? year : date.getFullYear();
    let monthInfo = getMonthCalendar(month,year);
    let lastMonthInfo = getMonthCalendar(month-1,year);
    let nextMonthInfo = getMonthCalendar(month+1,year);

    //month
    const monthElement = document.getElementsByClassName("monthName")[0];
    let text = `${months[month]} (${date.getFullYear()})`;
    if(monthElement.id !== month) monthElement.id = month;
    if(monthElement.textContent !== text) monthElement.textContent = `${months[month]} (${date.getFullYear()})`;

    let content = "";
    let count = 0;

    let gridTotal = (monthInfo.startDay + monthInfo.days) > 35 ? 42 : 35; 
    let dayNodes = document.getElementsByClassName("day") || [];

    if(dayNodes.length > gridTotal){
        let numToRemove = dayNodes.length - gridTotal;
        for(let i = 0; i < numToRemove; i++){ 
            calendar.removeChild(calendar.lastChild);
        }
    }

    if(dayNodes.length < gridTotal){
        let numToAdd = gridTotal - dayNodes.length;
        for (let i = 0; i < numToAdd; i++) {
            const newNode = document.createElement("div");
            let day = monthInfo.days + i;
            if(day > monthInfo.days){
                day = i;
            }
            let className = (day <= 10) ? "day locked next" :"day";
            newNode.className = className;
            newNode.id = `d-${i+dayNodes.length}`;
            newNode.setAttribute("data",-i);
            newNode.textContent = `${day}`;
            calendar.appendChild(newNode);
        }
    }

    //first days
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
        let isToday = month === currentDate.getMonth() && dayNumber === currentDate.getDate() && year === currentDate.getFullYear(); 
        let className = isToday ? "day today" : "day";
        if(dayNumber === selected.day && month === selected.month && year === selected.year){
            className += " selected";
        }

        let textContent = isToday ? "Today" : "";

        let element = document.getElementById(`d${count}`);

        if(element){
            element.className = className;
            element.setAttribute("data",dayNumber);
            element.textContent = `${dayNumber} ${textContent}`;
        }
        count++;
    }

    //days after
   let dayNextMonth = 1;
   while(count < gridTotal){
     let element = document.getElementById(`d${count}`);

     if(element){
        element.className = "day locked next";
        element.setAttribute("data",-dayNextMonth);
        element.textContent = dayNextMonth;
     }

     dayNextMonth++;
     count++;
   }
}


function getMonth(){
    return parseInt(document.getElementsByClassName("monthName")[0].id) || date.getMonth();
}

function getDayInfo(e){
    let metaDay = e.target.getAttribute("data") || e.target.parentNode.getAttribute("data");
    if(Number.isNaN(parseInt(metaDay))) return

    //lastMonth day
    metaDay = parseInt(metaDay);
    if(metaDay < 0 && metaDay <= -10 ) {
        let month = getMonth();
        selected = {
            day:metaDay,
            month: month === 0 ? 11 : getMonth(),
            year: month === 0 ? date.getFullYear() - 1 : date.getFullYear(),
        }
        showLastMonth();
        return
    }
    //nextMonth day
    if(metaDay < 0 && metaDay >= -10){
        let month = getMonth();
        selected = {
            day:metaDay,
            month: month === 11 ? 0 : getMonth(),
            year: month === 11 ? date.getFullYear() + 1 : date.getFullYear(), 
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

    createCalendar(selected.month);
    displayAppointments(metaDay,getMonth(),date.getFullYear());
}


function showLastMonth(){
    let month = getMonth();
    if(month === 0){
        date = new Date(date.getFullYear()-1,11,1);
        document.getElementsByClassName("monthName")[0].id = 11;
        month = getMonth();
    }else{
        month -= 1;
    }
    createCalendar(month);
}

function showNextMonth(){
    let month = getMonth();
    if(month === 11){
       date = new Date(date.getFullYear()+1,0,1); 
       document.getElementsByClassName("monthName")[0].id = 0;
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