console.log("Never Gonna Give You Up...");

fetch('http://localhost:3000/spotify/currentTrack', {
    method: 'GET',
})
.then(res => res.json())
.then(track => {
    console.log(track);
    displayCurrentTrack(track);
});

document.getElementById("github-fork").onclick = () => {
  window.location.href = "http://localhost:3000/spotify/login";
};


fetch('http://localhost:3000/github/repos', {
    method: 'GET',
})
.then(res => res.json())
.then(repos => {
    listRepos(repos);
});

fetch('http://localhost:3000/github/forks', {
    method: 'GET',
})
.then(res => res.json())
.then(forks => {
    listRepos(forks);
});

fetch('http://localhost:3000/github/inbox', {
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
