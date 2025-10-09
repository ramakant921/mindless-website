import { setting } from './settings.js';

const activeTab = document.getElementById("email-inbox");
init();
activeTab.addEventListener("click", () => {
    console.log("heeee");
    init();
});

function init(){
    console.log(activeTab);
    if(activeTab.classList.contains("active")) {
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
                    showEmailLogin();
                }
            });
    }
}

function showEmailLogin() {
    const loginBtn = document.getElementById("email-login");
    const inbox = document.getElementById("github-inbox");
    loginBtn.style.display = "block";

    loginBtn.onclick = () => {
        window.location.href = `http://localhost:${setting.port}/google/login`;
    };
}
console.log(`http://localhost:${setting.port}/google/login`)

function getGmailInbox(){
    console.log("hey");
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
        const section = document.getElementById("github-inbox");

        const block = document.createElement("div");
        block.classList.add("blocks");

        const blockRepo= document.createElement("p");
        blockRepo.classList.add("gmail-block-title");

        const blockMsg = document.createElement("p");

        blockRepo.innerText = notification.subject;
        blockMsg.innerText = notification.snippet;

        // append blockRepoTitle to block 
        block.appendChild(blockRepo);
        block.appendChild(blockMsg);
        // append block to gmail-inbox section
        section.appendChild(block);
    })
}
