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

//this function returns the quantity of days of a month 
//and also the first day of the month
function getMonthCalendar(monthToEval, yearToEval){
    let days = new Date (yearToEval,monthToEval+1,0);
    let firstDay = new Date(yearToEval, monthToEval,1).getDay();
    return {days:days.getDate(), startDay:firstDay};
}

//this function creates a new day node
function newDayNode(textContent,id,attribute,...classes){
    const div = document.createElement("div");
    div.textContent = `${textContent}`;
    div.id = id;
    div.setAttribute("data",attribute);
    div.classList.add(...classes);
    return div;
}

//updates any node
function updateNode(id, textContent, attribute, ...classes){
    const node = document.getElementById(id);
    node.textContent = `${textContent}`;
    node.setAttribute("data",attribute);
    node.classList.add(...classes);
    if(classes.indexOf("locked") === -1){
       node.classList.remove("locked","next","last");
    }

    if(classes.indexOf("selected") === -1){
        node.classList.remove("selected");
    }

    if(classes.indexOf("today") === -1){
        node.classList.remove("today");
    }
}

//updates the calendar
function createCalendar(month, year){
    month = (month === undefined) ? currentDate.getMonth() : month;
    year = (year === undefined) ? currentDate.getFullYear() : year;

    //Getting the next month and year

    //-- Next Month Information --
    //if it is Dicember then it should turn into January of next Year 
    //or in other words nextMonth === 11 then nextMonth = 0 and nextMonthYear += 1

    let nextMonth = 0;
    let nextMonthYear = 0
    if(month === 11){
        nextMonth = 0;
        nextMonthYear = year + 1;
    }else{
        nextMonth = month+1;
        nextMonthYear = year;
    }

    //--- Last Month Information
    //if it is January then it shold turn into Dicember of last year
    //or in other words lastMonth === 0 then lastMonth = 11 and lastMonthYear -=1  

    let lastMonth = 0;
    let lastMonthYear = 0;
    if(month === 0){
        lastMonth = 11;
        lastMonthYear = year - 1;
    }else{
        lastMonth = month - 1;
        lastMonthYear = year;
    }

    //Getting information about the months 
    let lastMonthInfo = getMonthCalendar(lastMonth,lastMonthYear);
    let nextMonthInfo = getMonthCalendar(nextMonth,nextMonthYear);
    let monthInfo = getMonthCalendar(month,year);

    //Inserting the current month and year as a title in the calendar
    //Note: if the month is the same it should not change
    //      the id is the number of the month from 0 - 11
    //      the textContent is the month name and year

    const monthElement = document.getElementsByClassName("monthName")[0];
    let monthTitleText = `${months[month]} (${year})`;

    if(parseInt(monthElement.id) !== month) monthElement.id = month;
    if(monthElement.textContent !== monthTitleText) monthElement.textContent = monthTitleText;


    //number of days inserted into the calendar
    let daysInserted = 0;

    //total of day elements needed in the calendar
    // 35 for month of 5 weeks and 42 for months of 6 weeks 
    let gridTotal = (monthInfo.startDay + monthInfo.days) > 35 ? 42 : 35; 

    //dayNodes inserted currently in the calendar
    let dayNodes = document.getElementsByClassName("day") || [];

    //if the quantity of nodes inserted is more than what it's needed, delete the remaning nodes
    if(dayNodes.length > gridTotal){
        let numToRemove = dayNodes.length - gridTotal;
        for(let i = 0; i < numToRemove; i++){ 
            calendar.removeChild(calendar.lastChild);
        }
    }

    //if the quantity of nodes inserted is less than what it's needed, add some extra nodes.
    let needUpdateNextD = true;
    if(dayNodes.length < gridTotal){
        needUpdateNextD = false;
        let counter = 0;
        let leftDays = dayNodes.length - monthInfo.days - monthInfo.startDay;
        if(leftDays < 0){
            for(let i=0; i < (-leftDays); i++){
                let day = monthInfo.days + leftDays + i+1;  
                let nodeData = {
                    textContent: `${day}`,
                    attribute: `${day}`,
                    classes:["day"],
                    id:`d${monthInfo.days+monthInfo.startDay+leftDays + i}`,
                }
                calendar.appendChild(newDayNode(nodeData.textContent,nodeData.id, nodeData.attribute, ...nodeData.classes))
            }
            leftDays = 0;
        }

        leftDays = gridTotal - dayNodes.length;
        if(leftDays > 0){
            for(let i=0; i < leftDays; i++){
                let nodeData = {
                    textContent:`${i+1}`,
                    attribute: `${-(i+1)}`,
                    classes:["day","locked","next"],
                    id:`d${monthInfo.days+monthInfo.startDay+i}`
                }

                calendar.appendChild(newDayNode(nodeData.textContent,nodeData.id, nodeData.attribute, ...nodeData.classes))
            }
        }
    }

    //first days of last month
    let daysEmpty = monthInfo.startDay;
    for (let i = 0; i < daysEmpty; i++) {

        let nodeData = {
            //here it is going to calculate the day like this:
            //days - daysNeeded + 1 (one because i starts at 0) + i 
            textContent: `${(lastMonthInfo.days - daysEmpty + 1) + i}`,

            //using negative numbers as attribute to differenciate the days of the month shown 
            //vs days from the month after and before the month shown 
            attribute: `-${(lastMonthInfo.days - daysEmpty + 1) + i}`,

            classes:["locked","last"],
            id:`d${daysInserted}`,
        }
        

        //updating the node id, attribute and classes 
        updateNode(nodeData.id,nodeData.textContent,nodeData.attribute,...nodeData.classes);

        //go to the next one
        daysInserted++;
    }

    //days
    for (let i = 0; i < monthInfo.days; i++) {

        let nodeData = {
            id:`d${daysInserted}`,
            textContent: `${i+1}`,
            attribute:`${i}`,
            classes:["day"],
        }
        
        //if the node represents de current day then it should add a special class called today
        if(month===currentDate.getMonth() && i+1 === currentDate.getDate() && year === currentDate.getFullYear()){
            nodeData.classes.push("today")
            nodeData.textContent += "\nToday"
        }

        //if the node is the selected element then it should add a special class called selected
        if(i === selected.day && month === selected.month && year === selected.year){
            nodeData.classes.push("selected");
        }

        updateNode(nodeData.id,nodeData.textContent,nodeData.attribute,...nodeData.classes)
        daysInserted++;
    }

    //days of next month
    //This will run when gridTotal < 42 because when gridTotal = 42 
    //the sentences that are written up will create the needed nodes to reach 42
    //en then add the required data to them.
    if(needUpdateNextD){
        let counter = 1;
        while(daysInserted < gridTotal){
            let nodeData = {
                classes: ["day","locked","next"],
                textContent: `${counter}`,
                attribute:`-${counter}`,
                id:`d${daysInserted}`
            }
            updateNode(nodeData.id,nodeData.textContent,nodeData.attribute,...nodeData.classes);
            counter++;
            daysInserted++;
        }
    }
}


function getMonth(){
    return parseInt(document.getElementsByClassName("monthName")[0].id) || date.getMonth();;
}

function getDayInfo(e){
    let metaDay = e.target.getAttribute("data") || e.target.parentNode.getAttribute("data");
    if(Number.isNaN(parseInt(metaDay))) return

    metaDay = parseInt(metaDay);
    let currentMonth = getMonth();
    let currentYear = date.getFullYear();

    //if a day of last month has been clicked
    if(e.target.classList.contains("last") || e.target.parentNode.classList.contains("last")){
        let targetMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        let targetYear = currentMonth === 0 ? currentYear - 1 : currentYear;

        selected = {
            day: Math.abs(metaDay)-1,
            month:targetMonth,
            year: targetYear
        }

        date = new Date(targetYear, targetMonth, 1);
        createCalendar(targetMonth, targetYear);
        displayAppointments(selected.day+1,targetMonth, targetYear);
        return;
    }

    //if a day of nexth month has been clicked
    if(e.target.classList.contains("next") || e.target.parentNode.classList.contains("next")){
        let targetMonth = currentMonth === 11 ? 0 : currentMonth + 1;
        let targetYear = currentMonth === 11 ? currentYear + 1 : currentYear;

        selected = {
            day: Math.abs(metaDay)-1,
            month:targetMonth,
            year: targetYear
        }

        date = new Date(targetYear, targetMonth, 1);
        createCalendar(targetMonth, targetYear);
        displayAppointments(selected.day+1,targetMonth, targetYear);
        return;
    }
    
    //else
    selected = {
        day:metaDay,
        month: currentMonth,
        year: currentYear, 
    }

    let prevSelected = document.getElementsByClassName("selected")[0];
    if(prevSelected){
       prevSelected.classList.remove("selected"); 
    }

    createCalendar(selected.month, selected.year);
    displayAppointments(selected.day + 1, selected.month, selected.year);
}


function showLastMonth(){
    let month = getMonth();
    if(month === 0){
        date = new Date(date.getFullYear()-1,11,1);
        document.getElementsByClassName("monthName")[0].id = 11;
    }else{
        date = new Date(date.getFullYear(),month-1,1);
    }
    createCalendar(date.getMonth(), date.getFullYear());
}

function showNextMonth(){
    let month = getMonth();
    if(month === 11){
       date = new Date(date.getFullYear() + 1, 0, 1); 
    } else {
        date = new Date(date.getFullYear(), month + 1, 1);
    }
    createCalendar(date.getMonth(), date.getFullYear())
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