let date = new Date();
let today = date.getDate();
let firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();

// Run
listDays();
// storeData();
retrieveData();

// Func me daddy
function totalDays(){
    let date = new Date();
    let totalDays = new Date(date.getFullYear(), date.getMonth()+1, 0).getDate();
    return totalDays;
}

function listDays(){
    const dayGrid = document.getElementById("day-tracker-grid");
    if(!retrieveData()) {
        storeData();
    }
    const data = retrieveData();

    // pad inital empty days
    let emptyDays=1;
    for(; emptyDays<firstDay; ++emptyDays){
        const cell = document.createElement("div");
        cell.classList.add("day-cell", "disabled-day");

        dayGrid.appendChild(cell);
    }
    
    // interactive days
    let idx=1;
    for(; idx<=totalDays(); ++idx){
        let cell = document.createElement("div");
        if(data[idx]) {
            if(data[idx] == "good-day"){
                addTrophy(cell);
            }
            cell.classList.add("day-cell", data[idx]);
        }
        else cell.classList.add("day-cell", "vacant-day");
        cell.dataset.date = idx;
        
        if(idx==today) {
            if(cell.classList.contains("vacant-day")){
                cell.classList.add("today");
                cell.innerText = "?";
                cell.title = "Input Today's Data";
            }
        }

        if(idx > today) {
            cell.classList.add("action-not-allowed")
        }

        cell.addEventListener("click", showOptions);

        dayGrid.appendChild(cell);
    }

    // pad last empty days
    for(; idx<=35-emptyDays+1; ++idx){
        const cell = document.createElement("div");
        cell.classList.add("day-cell", "disabled-day");

        dayGrid.appendChild(cell);
    }
}

function showOptions(day) {
    const options = document.getElementById("day-option");
    const dayOptionType = document.querySelectorAll(".day-option-type");
    
    options.style.top = day.layerY + "px";
    options.style.left = day.layerX + "px";
    options.style.display = "block";

    dayOptionType.forEach(option => {
        option.onclick = (e) => setDayType(e.target.dataset.option, day.target);
    })

    day.stopPropagation(); // make sure it doesn't shy right away

    // Close menu if user don't like the options
    document.addEventListener("click", hideOptions, { once: true });
}

function addTrophy(day){
        const trophy = document.createElement("img");
        trophy.src = "../assets/images/trophy.png";
        trophy.style.pointerEvents = "none";
        trophy.style.opacity = 0.9;
        day.appendChild(trophy);
}

function setDayType(selectedType, day) {
    day.innerText=""; // remove the ? from today's cell
    day.classList.remove("today");
    day.classList.remove("good-day", "mid-day", "bad-day", "vacant-day");
    day.classList.add(selectedType);
    if(selectedType == "good-day") {
        addTrophy(day);
    }

    updateData(day.dataset.date, selectedType);

    hideOptions();
}

function hideOptions() {
    const options = document.getElementById("day-option");
    options.style.display = "none";
    options.onchange = null; // remove prev listener 
}

function storeData(data={}) {
    if(Object.keys(data).length === 0) {
        for(let day=1; day<=totalDays(); ++day){
            data[day] = "";
        }
    }

    localStorage.setItem("day_data", JSON.stringify(data));
}

function retrieveData() {
    let data = JSON.parse(localStorage.getItem("day_data"));
    return data ? data : null;
}

function updateData(date, type) {
    const data = retrieveData();
    if(!data) return;

    data[date] = type;

    storeData(data);
}
