// Packages
import express, { response } from 'express';
import cors from 'cors';
import querystring from 'querystring';
import axios from 'axios';
import bodyParser from 'body-parser';
import dotenv from 'dotenv'; // load .env to access our tokens 
dotenv.config();

// Modules
import { setTokenCookies, getCurrentTrack } from "./spotify.js";
import { getGithubLogin, githubCallback, getGithubRepo, getGithubFork, getGithubInbox } from "./github.js";
import { getGmailInbox, getGmailLogin, gmailCallback } from './gmail.js';

const weather_api = process.env.WEATHER_API;

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = 'http://127.0.0.1:42069/auth/spotify/callback';

// server init
const app = express(); // express let's us create and run server
app.use(express.static('../'));
// CORS: allows to fetch api (very nasty error, remember it)
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    }),
);
app.use(cors({
    origin: ['http://localhost:42069', 'http://127.0.0.1:42069'],
  credentials: true
}));

// So basically this is our backend server
// and all the app.get listed below are endpoints
// if we hit them they will do their respec. work

app.get('/', (req, res) => {
    res.sendFile(path.resolve('../index.html'));
})

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

app.get("/auth/spotify/callback", async (req, res) => {
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

    const { access_token, refresh_token, expires_in } = response.data;
    setTokenCookies(res, {access_token, refresh_token, expires_in});

    res.redirect('/');

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to get tokens" });
  }
});

app.get('/auth/status', (req, res) => {
    const cookies = req.headers.cookie;
    const isAuthenticated = cookies && cookies.includes('spotify_access_token');
    res.json({ authenticated: isAuthenticated });
});

// --------GITHUB--------
app.get('/github/login', (req, res) => {
    getGithubLogin(res);
});

app.get('/auth/github/callback', (req, res) => {
    githubCallback(req, res);
});

app.get('/auth/github/status', (req, res) => {
    const cookies = req.headers.cookie;
    const isAuthenticated = cookies && cookies.includes('github_access_token');
    res.json({ authenticated: isAuthenticated });
});

// --------GMAIL--------
app.get('/google/login', (req, res) => {
    getGmailLogin(res);
});

app.get('/auth/google/callback', (req, res) => {
    gmailCallback(req, res);
});

app.get('/auth/google/status', (req, res) => {
    const cookies = req.headers.cookie;
    const isAuthenticated = cookies && cookies.includes('google_access_token');
    res.json({ authenticated: isAuthenticated });
});

app.get('/google/inbox', (req, res) => {
    getGmailInbox(req)
        .then(inbox => {
            // console.log("inbox: ", inbox);
            res.json(inbox);
        })
        .catch(error => {
            res.status(500).send(error.message);
        });
});

app.post('/weather', async (req, res) => {
    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${req.body.lat}&lon=${req.body.long}&appid=${weather_api}`
        );

        res.json( response.data);
        console.log(response.data)
        // res.send(response.data);
    }
    catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ error: "Failed to get tokens" });
    }

});

app.get('/spotify/currentTrack', (req, res) => {
    // getCurrentTrack function is imported from the spotify module we wrote
    // it call the spotify api to our requested stuff
    getCurrentTrack(req, res)
        .then(track => { 
            // console.log("track: ", track);
            res.json(track);
        })
        .catch(error => {
            res.status(500).send(error.message);
        });
});

app.get('/github/repos', (req, res) => {
    getGithubRepo(req)
        .then(repos => {
            // console.log("repos: ", repos);
            res.json(repos);
        })
        .catch(error => {
            console.error("Error fetching inbox:", error); 
            res.status(500).send(error.message);
        });
});

app.get('/github/forks', (req, res) => {
    getGithubFork(req)
        .then(repos => {
            // console.log("forks: ", repos);
            res.json(repos);
        })
        .catch(error => {
            res.status(500).send(error.message);
        });
});

app.get('/github/inbox', (req, res) => {
    getGithubInbox(req)
        .then(inbox => {
            // console.log("inbox: ", inbox);
            res.json(inbox);
        })
        .catch(error => {
            res.status(500).send(error.message);
        });
});

// consider port as a communication channel where different services communicate 
const PORT = 42069; // yamate kudasai
app.listen(PORT, () => {
    console.log(`Server Listening Like Google, Meta on port ${PORT}`);
    console.log(`FrontEnd:- http://localhost:${PORT}`);
    console.log(`https://localhost:${PORT}/spotify/login to login to spotify`);
});
