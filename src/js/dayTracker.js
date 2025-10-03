let date = new Date();
let firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
console.log(firstDay);

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
    console.log("running")

    // pad inital empty days
    let emptyDays=1;
    for(; emptyDays<firstDay; ++emptyDays){
        console.log(emptyDays);
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
                const trophy = document.createElement("img");
                trophy.src = "../images/trophy.png";
                cell.appendChild(trophy);
            }
            cell.classList.add("day-cell", data[idx]);
        }
        else cell.classList.add("day-cell", "vacant-day");
        cell.dataset.date = idx;

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

function setDayType(selectedType, day) {
    day.classList.remove("good-day", "mid-day", "bad-day", "vacant-day");
    day.classList.add(selectedType);
    if(selectedType == "good-day") {
        const trophy = document.createElement("img");
        trophy.src = "../images/trophy.png";
        day.appendChild(trophy);
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
