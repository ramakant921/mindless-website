import { setting } from './settings.js';

showGithubLogin();
function showGithubLogin() {
    const loginBtn = document.getElementById("github-login");
    // const coverWrapper = document.getElementById("cover-wrapper");
    // loginBtn.style.display = "block";
    // nowPlaying.style.display = "none";
    // coverWrapper.style.display = "none";

    loginBtn.onclick = () => {
        window.location.href = `http://localhost:${setting.port}/github/login`;
    };
}

function displayCurrentTrack(track) {
    const widget = document.getElementById("spotify-widget");
    const coverWrapper = document.getElementById("cover-wrapper");

    const cover = document.createElement("img");
    cover.id = "spotify-cover";
    cover.src = track.image

    const trackName = document.createElement("p");
    trackName.id = "track";
    trackName.innerText = track.name;

    const artist = document.createElement("p");
    artist.id = "artist";
    artist.innerText = track.artist;

    coverWrapper.appendChild(cover);

    widget.appendChild(coverWrapper);
    widget.appendChild(trackName);
    widget.appendChild(artist);
}
