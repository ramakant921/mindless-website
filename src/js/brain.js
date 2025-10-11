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


// check if user's spotify is authenticated
fetch(`http://127.0.0.1:${setting.port}/auth/status`, {
    credentials: 'include'
})
.then(res => res.json())
.then(data => {
    if (data.authenticated) {
        // console.log("fetching spotify data");
        fetchCurrentTrack();
    } else {
        // console.log("bruhhh login to spotify");
        showSpotifyLogin();
    }
});

function fetchCurrentTrack() {
    fetch(`http://127.0.0.1:${setting.port}/spotify/currentTrack`, {
        method: 'GET',
        credentials: 'include'
    })
    .then(res => res.json())
    .then(track => {
        console.log(track);
        if (track) {
            displayCurrentTrack(track);
        }
    })
    .catch(error => console.error("Error:", error));
}


function showSpotifyLogin() {
    const loginBtn = document.getElementById("spotify-login");
    const nowPlaying = document.getElementById("now-playing");
    const coverWrapper = document.getElementById("cover-wrapper");
    loginBtn.style.display = "block";
    nowPlaying.style.display = "none";
    coverWrapper.style.display = "none";

    loginBtn.onclick = () => {
        window.location.href = `http://localhost:${setting.port}/spotify/login`;
    };
}

function displayCurrentTrack(track) {
    const widget = document.getElementById("spotify-widget-content");
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
