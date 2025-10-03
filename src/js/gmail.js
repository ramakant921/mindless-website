import { setting } from './settings.js';

// check if user's google is authenticated
fetch(`http://127.0.0.1:${setting.port}/auth/google/status`, {
    credentials: 'include'
})
.then(res => res.json())
.then(data => {
    if (data.authenticated) {
        console.log("fetching google data");
        getGmailInbox();
    } else {
        console.log("bruhhh login to google");
        // showGoogleLogin();
    }
});

// function showGithubLogin() {
//     const loginBtn = document.getElementById("github-login");
//     const repo = document.getElementById("github-repo");
//     const fork = document.getElementById("github-fork");
//     const inbox = document.getElementById("github-inbox");
//     loginBtn.style.display = "block";
//     repo.style.display = "none";
//     fork.style.display = "none";
//     inbox.style.display = "none";
//
//     loginBtn.onclick = () => {
//         window.location.href = `http://localhost:${setting.port}/github/login`;
//     };
// }
console.log(`http://localhost:${setting.port}/google/login`)

function getGmailInbox(){
    fetch(`http://127.0.0.1:${setting.port}/google/inbox`, {
        method: 'GET',
        credentials: 'include'
    })
        .then(res => res.json())
        .then(notifications => {
            console.log(notifications);
            listGmailInbox(notifications);
        });
}

function listGmailInbox(inbox) {
    inbox.map(notification => {
        // Grab gmail-inbox section
        const section = document.getElementById("gmail-inbox");

        const block = document.createElement("div");
        block.classList.add("blocks");

        const blockRepo= document.createElement("p");
        blockRepo.classList.add("gmail-block-title");

        const blockMsg = document.createElement("p");

        blockRepo.innerText = notification.repo;
        blockMsg.innerText = notification.title;

        // append blockRepoTitle to block 
        block.appendChild(blockRepo);
        block.appendChild(blockMsg);
        // append block to gmail-inbox section
        section.appendChild(block);
    })
}
