// Packages
import express from 'express';
import cors from 'cors';
import nodemon from 'nodemon'; // dev dependency, auto restarts server on file changes
// Modules
import { getCurrentTrack } from "./spotify.js";
import { getGithubRepo, getGithubFork, getGithubInbox } from "./github.js";

// server init
const app = express(); // express let's us create and run server
app.use(cors()); // CORS: allows to fetch api (very nasty error, remember it)

// So basically this is our backend server
// and all the app.get listed below are endpoints
// if we hit them they will do their respec. work
app.get('/spotify/currentTrack', (req, res) => {
    // getCurrentTrack function is imported from the spotify module we wrote
    // it call the spotify api to our requested stuff
    getCurrentTrack()
    .then(track => { 
        console.log("track: ", track);
        res.json(track);
    })
    .catch(error => {
        res.status(500).send(error.message);
    });
});

app.get('/github/repos', (req, res) => {
    getGithubRepo().then(repos => {
        console.log("repos: ", repos);
        res.json(repos);
    }).catch(error => {
        console.error("Error fetching inbox:", error); 
        res.status(500).send(error.message);
    });
});

app.get('/github/forks', (req, res) => {
    getGithubFork().then(repos => {
        console.log("forks: ", repos);
        res.json(repos);
    }).catch(error => {
        res.status(500).send(error.message);
    });
});

app.get('/github/inbox', (req, res) => {
    getGithubInbox().then(inbox => {
        console.log("inbox: ", inbox);
        res.json(inbox);
    }).catch(error => {
        res.status(500).send(error.message);
    });
});

// consider port as a communication channel where different services communicate 
const port = 3000; // this is the port where our server will run
app.listen(port, () => {
    console.log(`Server Listening Like Google, Meta on port ${port}`);
    console.log(`http://localhost:${port}`);
    console.log(`http://localhost:${port}/spotify/currentTrack`); // endpoint to get current track
});
