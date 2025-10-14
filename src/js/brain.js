import { setting } from './settings.js';

// Play Audio On Hover
const settigns = document.getElementById("settings-inner");
const socialIcons = document.querySelectorAll(".social-icon");

settigns.addEventListener("mouseenter", () => {
    PlayAudio("../assets/audio/gear.mp3");
});

socialIcons.forEach((icon) => {
    icon.addEventListener("mouseenter", () => {
        PlayAudio("../assets/audio/icon-hover.wav");
    });
});

function PlayAudio(filename) {
    new Audio(filename).play();
}

