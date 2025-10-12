import { setting } from './settings.js';

// Change Active Tab (Github/Email) Inbox
const emailInbox = document.getElementById("email-inbox");
const githubInbox = document.getElementById("github-inbox");

// emailInbox.addEventListener("click", () => {
//     emailInbox.classList.remove("active");
//     githubInbox.classList.remove("active");
//
//     emailInbox.classList.add("active");
// });

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

