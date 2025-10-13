import { setting } from './settings.js';

const activeTab = document.getElementById("email-inbox");
activeTab.addEventListener("click", () => {
    console.log("gmail accessed");
    init();
});

function init(){
    // if(activeTab.classList.contains("active")) {
        // check if user's google is authenticated
        fetch(`http://127.0.0.1:${setting.port}/auth/google/status`, {
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                if (data.authenticated) {
                    console.log("fetching google data");
                    getEmailInbox();
                } else {
                    console.log("bruhhh login to google");
                    showEmailLogin();
                }
            });
    // }
}

function showEmailLogin() {
    const loginBtn = document.getElementById("email-login");
    loginBtn.style.display = "block";

    loginBtn.onclick = () => {
        window.location.href = `http://localhost:${setting.port}/google/login`;
    };
}

function getEmailInbox(){
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
    // Grab gmail-inbox section
    const section = document.getElementById("github-inbox");
    section.innerHTML = ""; // this is nasty but; we are badass

    inbox.map(notification => {
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
