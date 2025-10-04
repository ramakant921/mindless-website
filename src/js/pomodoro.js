let duration = 25 * 60;
let timeLeft = duration;
let timerInterval = null;
let isRunning = false;


const timerDisplay = document.getElementById("timer");
const playPauseBtn = document.getElementById("playPause");
const activeCircle = document.getElementById("activeCircle");


function updateDisplay() {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      timerDisplay.textContent =
        `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

      const progress = (duration - timeLeft) / duration;
      const clipValue = 100 - progress * 100;
      activeCircle.style.clipPath = `inset(${clipValue}% 0 0 0)`;
    }

    function toggleTimer() {
      if (isRunning) {
        clearInterval(timerInterval);
        playPauseBtn.textContent = "▶Play";
      } else {
        timerInterval = setInterval(() => {
          if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
          } else {
            clearInterval(timerInterval);
            isRunning = false;
            playPauseBtn.textContent = "▶play";
          }
        }, 1000);
        playPauseBtn.textContent = "⏸Pause";
      }
      isRunning = !isRunning;
    }

    
    playPauseBtn.addEventListener("click", toggleTimer);
    updateDisplay();