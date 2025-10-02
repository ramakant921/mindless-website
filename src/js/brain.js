import { setting } from './settings.js';

// check if user's spotify is authenticated
fetch(`http://127.0.0.1:${setting.port}/auth/status`, {
    credentials: 'include'
})
.then(res => res.json())
.then(data => {
    if (data.authenticated) {
        console.log("fetching spotify data");
        fetchCurrentTrack();
    } else {
        console.log("bruhhh login to spotify");
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

fetch(`http://localhost:${setting.port}/github/repos`, {
    method: 'GET',
})
.then(res => res.json())
.then(repos => {
    listRepos(repos);
});

fetch(`http://localhost:${setting.port}/github/forks`, {
    method: 'GET',
})
.then(res => res.json())
.then(forks => {
    listRepos(forks);
});

fetch(`http://localhost:${setting.port}/github/inbox`, {
    method: 'GET',
})
.then(res => res.json())
.then(notifications => {
    listInbox(notifications);
});

function listRepos(repos) {
    repos.map(repo => {
        // Grab github-repo section
        const section = document.getElementById("github-repo");

        // dynamically create div and add class and text
        const block = document.createElement("div");
        block.classList.add("blocks");
        block.innerText = repo;

        // append block to github-repo section
        section.appendChild(block);
    })
}

function listForks(repos) {
    repos.map(repo => {
        // Grab github-fork section
        const section = document.getElementById("github-fork");

        const block = document.createElement("div");
        block.classList.add("blocks");
        block.innerText = repo;

        // append block to github-fork section
        section.appendChild(block);
    })
}

function listInbox(inbox) {
    inbox.map(notification => {
        // Grab github-inbox section
        const section = document.getElementById("github-inbox");

        const block = document.createElement("div");
        block.classList.add("blocks");

        const blockRepo= document.createElement("p");
        blockRepo.classList.add("github-block-title");

        const blockMsg = document.createElement("p");

        blockRepo.innerText = notification.repo;
        blockMsg.innerText = notification.title;

        // append blockRepoTitle to block 
        block.appendChild(blockRepo);
        block.appendChild(blockMsg);
        // append block to github-inbox section
        section.appendChild(block);
    })
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
