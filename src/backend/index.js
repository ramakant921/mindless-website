// Packages
import express from 'express';
import cors from 'cors';
import querystring from 'querystring';
import axios from 'axios';
import nodemon from 'nodemon'; // dev dependency, auto restarts server on file changes
import dotenv from 'dotenv'; // load .env to access our tokens 
dotenv.config();

// Modules
import { setTokens, getCurrentTrack } from "./spotify.js";
import { getGithubRepo, getGithubFork, getGithubInbox } from "./github.js";

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = 'http://127.0.0.1:3000/callback';

// server init
const app = express(); // express let's us create and run server
app.use(cors()); // CORS: allows to fetch api (very nasty error, remember it)

// So basically this is our backend server
// and all the app.get listed below are endpoints
// if we hit them they will do their respec. work

app.get('/spotify/login', (req, res) => {
    // let state = generateRandomString(16);
    let state = "thcehnwhetpnegtr";
    let scope = 'user-read-private user-read-email user-read-currently-playing user-read-playback-state';

    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
});

app.get("/callback", async (req, res) => {
  let code = req.query.code || null;
  let state = req.query.state || null;

  if (state === null) {
    return res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch",
        })
    );
  }

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(client_id + ":" + client_secret).toString("base64"),
        },
      }
    );

      setTokens({
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token,
          expires_in: response.data.expires_in,
      });
    const { access_token, refresh_token } = response.data;

    res.json({ access_token, refresh_token });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to get tokens" });
  }
});

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
