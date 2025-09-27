console.log("Never Gonna Give You Up...");

// fetch('http://localhost:3000/spotify/currentTrack', {
//     method: 'GET',
// })
// .then(res => res.json())
// .then(track => {
//     console.log(track);
// });

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
        block.innerText = notification;

        // append block to github-inbox section
        section.appendChild(block);
    })
}
