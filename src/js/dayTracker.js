let date = new Date();
let firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
console.log(firstDay);

// Run
listDays();

// Func me daddy
function totalDays(){
    let date = new Date();
    let totalDays = new Date(date.getFullYear(), date.getMonth()+1, 0).getDate();
    return totalDays;
}

function listDays(){
    const dayGrid = document.getElementById("day-tracker-grid");

    // pad inital empty days
    for(let i=1; i<firstDay; ++i){
        console.log(i);
        const cell = document.createElement("div");
        cell.classList.add("day-cell", "disabled-day");

        dayGrid.appendChild(cell);
    }
    
    // interactive days
    for(let i=0; i<totalDays(); ++i){
        let cell = document.createElement("div");
        cell.classList.add("day-cell", "good-day");

        cell.addEventListener("click", showOptions);

        dayGrid.appendChild(cell);
    }
}

function showOptions(day) {
    const options = document.getElementById("day-option");
    options.focus();
    options.size = options.options.length;
    options.click();
    
    options.style.top = day.layerY + "px";
    options.style.left = day.layerX + "px";
    options.style.display = "block";

    options.onchange = (e) => setDayType(e, day.target);

    day.stopPropagation(); // make sure it doesn't shy away right away

    // Close menu if user don't like the options
    document.addEventListener("click", hideOptions, { once: true });
}

function setDayType(e, day) {
    console.log("day clicked:", day);
    console.log("selected:", e.target.value);

    day.classList.remove("good-day", "mid-day", "bad-day");
    day.classList.add(e.target.value);

    hideOptions();
}

function hideOptions() {
    const options = document.getElementById("day-option");
    options.style.display = "none";
    options.onchange = null; // remove prev listener 
}
