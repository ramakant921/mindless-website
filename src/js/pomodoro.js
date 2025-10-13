// Constants
const FULL_DASH_ARRAY = 283;

// Grab Elements
const startPauseBtn = document.getElementById("play-pause");
const dom_Minutes = document.getElementById("pomo-minutes");
const dom_Seconds = document.getElementById("pomo-seconds");

// Pomodoro Settings Event Listener
const pomoSettigns = document.getElementById("pomo-settings");
pomoSettigns.addEventListener("click", (e) => {
    e.stopPropagation();
    showOptions(e);
});

let isRunning = false;
let countdownId = null;
let initialMinutes = 0;
let initialSeconds = 15;
let totalTime = (initialMinutes * 60) + initialSeconds;
let timeElapsed = (initialMinutes * 60) + initialSeconds;

// -------Run Code------
getInitialTime();

startPauseBtn.addEventListener("click", () => {
    if(!isRunning){
        startPauseBtn.src = "../assets/images/pause.png"
        countdownId = setInterval(() => {
            timeElapsed -= 1;
            if(timeElapsed <= 0) {
                const explosionGif = document.createElement("img");
                explosionGif.src = "./assets/images/explosion.gif?cacheBust=" + new Date().getTime(); 
                explosionGif.id = "boom-boom";
                document.body.appendChild(explosionGif);

                // Remove Gif After playing it
                explosionGif.addEventListener("animationend", () => explosionGif.remove());
                setTimeout(() => explosionGif.remove(), 1000); 

                PlayAudio("../assets/audio/explode.wav")

                clearInterval(countdownId);
            }

            let minutes = Math.floor(timeElapsed/60);
            if(minutes<0) minutes = 0;
            const seconds = timeElapsed%60;

            console.log(minutes + ":" + seconds);
            displayTime(minutes, seconds);
            setTimeElapsedDasharray();

            if(timeElapsed <= 10 && timeElapsed > 0) PlayAudio("../assets/audio/beep.wav");
            if(minutes == 0 && seconds == 0){
                PlayAudio("../assets/audio/doublebeep.wav")
                resetTimer();
            }

        }, 1000);

        PlayAudio("../assets/audio/okay_lets_go.wav");
    }

    else {
        startPauseBtn.src = "../assets/images/play.png"
        clearInterval(countdownId);
        countdownId=null;
    }

    isRunning = !isRunning;
    console.log(isRunning);
});

function updateTimeVariables (minutes, seconds) {
    initialMinutes = minutes;
    initialSeconds = seconds;
    totalTime = (initialMinutes * 60) + initialSeconds;
    timeElapsed = (initialMinutes * 60) + initialSeconds;
}

function togglePlayPauseButton() {
    const btn = document.getElementById("play-pause");
    btn.src = "../assets/images/playing.png";
}
                
function resetTimer() {
    clearInterval(countdownId);
    countdownId = null;
    isRunning = false;
    timeElapsed = totalTime;
    updateTimeVariables(initialMinutes, initialSeconds);
    displayTime(initialMinutes, initialSeconds);
    setTimeout(() => {
        setTimeElapsedDasharray(true);
    },1000);
}

// SVG Animation
function calculateTimeFraction() {
  const rawTimeFraction = 1 - timeElapsed / totalTime;
  return rawTimeFraction - (1 / totalTime) * (1 - rawTimeFraction);
}

function setTimeElapsedDasharray(reset=false) {
  const dash = (FULL_DASH_ARRAY * calculateTimeFraction()).toFixed(2);
  document.getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", `${reset ? 0 : dash} ${FULL_DASH_ARRAY}`);
}

function updatePomoTime() {
    const minutes = parseInt(document.getElementById("pomo-opt-minutes").value);
    const seconds = parseInt(document.getElementById("pomo-opt-seconds").value);

    updateTimeVariables(minutes, seconds);
    displayTime(minutes, seconds);

    // Save New Time To Local Storage
    localStorage.setItem("pomo_initial_min", initialMinutes);
    localStorage.setItem("pomo_initial_sec", initialSeconds);
}

function getInitialTime () {
    const minutes = parseInt(localStorage.getItem("pomo_initial_min"));
    const seconds = parseInt(localStorage.getItem("pomo_initial_sec"));

    if (isNaN(minutes) || isNaN(seconds)) return;

    updateTimeVariables(minutes, seconds);

    displayTime(minutes, seconds);
}

// ---------Options----------
function showOptions(e) {
    console.log(e);
    const options = document.getElementById("pomodoro-option");
    const form = document.querySelector("#pomodoro-option form");
    
    // options.style.top = e.layerY + "px";
    // options.style.left = e.layerX + "px";
    options.style.top = e.clientY + "px";
    options.style.left = e.clientX + "px";
    options.style.display = "flex";


    e.stopPropagation(); // make sure it doesn't shy right away

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        updatePomoTime();
        hideOptions();
    });

    const outsideClickHandler = (event) => {
        if (!options.contains(event.target)) {
            hideOptions();
            document.removeEventListener("click", outsideClickHandler); 
        }
    };

    // Close menu if user don't like the options
    document.addEventListener("click", outsideClickHandler);
}

function hideOptions() {
    const options = document.getElementById("pomodoro-option");
    options.style.display = "none";
    options.onchange = null; // remove prev listener 

    // Set Updated Time
    updatePomoTime();
}

function displayTime(minutes, seconds) {
    if(minutes < 10) minutes= "0" + minutes;
    if(seconds < 10) seconds = "0" + seconds;

    dom_Minutes.innerText = minutes;
    dom_Seconds.innerText = seconds;
}

function PlayAudio(filename) {
    new Audio(filename).play();
}
