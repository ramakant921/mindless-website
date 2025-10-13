import { setting, backendURL} from './settings.js';

console.log(backendURL)
const activeTab = document.getElementById("git-inbox");

init();
activeTab.addEventListener("click", () => {
    init();
});

// check if user's github is authenticated
fetch(`${backendURL}/auth/github/status`, {
    credentials: 'include'
})
    .then(res => res.json())
    .then(data => {
        if (data.authenticated) {
            console.log("fetching github data");
            getGithubRepos();
            getGithubForks();
        } else {
            // console.log("bruhhh login to github");
            showGithubLogin();
        }
    });

function init() {
    console.log(activeTab);
    if(activeTab.classList.contains("active")) {
            getGithubInbox();
    }
}

function showGithubLogin() {
    const loginBtn = document.getElementById("github-login");
    const sections = document.querySelectorAll("#github-widget .section");
    sections.forEach((section) => {
        section.style.display = "none";
    });
    loginBtn.style.display = "block";

    loginBtn.onclick = () => {
        window.location.href = `${setting.backendURL}/github/login`;
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
            listForks(forks);
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
        block.classList.add("section-list-item");
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
    // Grab github-inbox section
    const section = document.getElementById("github-inbox");
    section.innerHTML = ""; // this is nasty but; we are badass

    inbox.map(notification => {
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
