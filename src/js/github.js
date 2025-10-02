import { setting } from './settings.js';

// check if user's github is authenticated
fetch(`http://127.0.0.1:${setting.port}/auth/github/status`, {
    credentials: 'include'
})
.then(res => res.json())
.then(data => {
    if (data.authenticated) {
        console.log("fetching github data");
        getGithubRepos();
        getGithubForks();
        getGithubInbox();
    } else {
        console.log("bruhhh login to github");
        showGithubLogin();
    }
});
function showGithubLogin() {
    const loginBtn = document.getElementById("github-login");
    const repo = document.getElementById("github-repo");
    const fork = document.getElementById("github-fork");
    const inbox = document.getElementById("github-inbox");
    loginBtn.style.display = "block";
    repo.style.display = "none";
    fork.style.display = "none";
    inbox.style.display = "none";

    loginBtn.onclick = () => {
        window.location.href = `http://localhost:${setting.port}/github/login`;
    };
}

function getGithubRepos(){
    fetch(`http://127.0.0.1:${setting.port}/github/repos`, {
        method: 'GET',
        credentials: 'include'
    })
        .then(res => res.json())
        .then(repos => {
            listRepos(repos);
        });
}

function getGithubForks(){
    fetch(`http://127.0.0.1:${setting.port}/github/forks`, {
        method: 'GET',
        credentials: 'include'
    })
        .then(res => res.json())
        .then(forks => {
            listRepos(forks);
        });
}

function getGithubInbox(){
    fetch(`http://127.0.0.1:${setting.port}/github/inbox`, {
        method: 'GET',
        credentials: 'include'
    })
        .then(res => res.json())
        .then(notifications => {
            listInbox(notifications);
        });
}

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
