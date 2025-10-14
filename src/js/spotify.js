import { setting, backendURL } from './settings.js';

// check if user's spotify is authenticated
fetch(`${backendURL}/auth/status`, {
    credentials: 'include'
})
.then(res => res.json())
.then(data => {
    if (data.authenticated) {
        // console.log("fetching spotify data");
        fetchCurrentTrack();

        setInterval(() => {
            fetchCurrentTrack();
        }, 6969); // Fetch Spotify every 6969ms
    } else {
        // console.log("bruhhh login to spotify");
        showSpotifyLogin();
    }
});

function fetchCurrentTrack() {

    fetch(`${backendURL}/spotify/currentTrack`, {
        method: 'GET',
        credentials: 'include'
    })
    .then(res => res.json())
    .then(track => {
        displayCurrentTrack(track);
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
        window.location.href = setting.prod ? `${backendURL}/spotify/login` : `http://localhost:${setting.port}/spotify/login`;
    };
}

function displayCurrentTrack(track) {
    const cover = document.getElementById("spotify-cover");
    const trackName = document.getElementById("track");
    const artist = document.getElementById("artist");

    if(!track || Object.keys(track).length === 0) {
        trackName.innerText = "Nothing";
        artist.innerText = "Zero Batte Sannata";
        return;
    };

    cover.src = track.image
    trackName.innerText = track.name;
    artist.innerText = track.artist;
}
