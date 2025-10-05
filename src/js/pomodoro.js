const startPauseBtn = document.getElementById("weather-hero");

let isRunning = false;
let countdownId = null;
let min = 0;
let sec = 15;
let totalTime = (min * 60) + sec;

startPauseBtn.addEventListener("click", () => {
    console.log(isRunning);
    if(!isRunning){
        countdownId = setInterval(() => {
            if(totalTime == 0) {
                const explosionGif = document.createElement("img");
                explosionGif.src = "./assets/images/explosion.gif?cacheBust=" + new Date().getTime(); 
                explosionGif.id = "boom-boom";
                document.body.appendChild(explosionGif);
                PlayAudio("../assets/audio/explode.wav")

                clearInterval(countdownId);
            }

            totalTime -= 1;

            const minute = Math.floor(totalTime/60);
            if(minute<0) minute = 0;
            const second = totalTime%60;

            console.log(minute + ":" + second);

            if(totalTime <= 10 && totalTime > 0) PlayAudio("../assets/audio/beep.wav");
            if(minute == 0 && second == 0){
                PlayAudio("../assets/audio/doublebeep.wav")
            }

        }, 1000);

        PlayAudio("../assets/audio/okay_lets_go.wav");
    }

    else {
        clearInterval(countdownId);
        countdownId=null;
    }

    isRunning = !isRunning;
    console.log(isRunning);
});

function PlayAudio(filename) {
    new Audio(filename).play();
}
