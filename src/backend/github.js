import axios from "axios";
import dotenv from 'dotenv'; // load .env to access our tokens 
import querystring from 'querystring';
dotenv.config();

const token = process.env.GITHUB_TOKEN;
const client_id = process.env.GITHUB_CLIENT_ID;
const client_secret = process.env.GITHUB_CLIENT_SECRET;
const redirect_uri = 'http://127.0.0.1:42069/auth/github/callback';

if (!token) {
  console.error("bruh add your .env file with github token init....");
}

export async function getGithubLogin(res) {
    // Randomize the state later
    // let state = generateRandomString(16);
    let state = "thcehnwhetpnegtr";
    let scope = 'repo notifications read:user';

    res.redirect('https://github.com/login/oauth/authorize' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
}

export async function githubCallback(res){
    console.log("in git callback");
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
            "https://githube.com/login/oauth/access_token",
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

        // const { access_token, refresh_token, expires_in } = response.data;
        // setTokenCookies(res, {access_token, refresh_token, expires_in});

        res.redirect('/');

    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ error: "Failed to get tokens" });
    }
}

export async function getGithubRepo() {
    const res = await axios.get("https://api.github.com/user/repos?sort=updated", {
        headers: {
            Authorization: `token ${token}`
        }
    });

    // github api return a object (collection of different data type like variable or array)
    // we access object data with . like response.data (so data is a part of object which is stored in the response var.)
    const repoNames = res.data.map(repo => repo.full_name); // .map is basically return a array where we are appending all the name of the repo)
    return repoNames || null; // return data to our server if there is any data otherwise return null
}

export async function getGithubFork() {
    const res = await axios.get("https://api.github.com/user/repos", {
        headers: {
            Authorization: `token ${token}`
        }
    });

    const forkedRepos = res.data
        .filter(repo => repo.fork)
        .map(repo => repo.full_name);

  return forkedRepos || null;
}

export async function getGithubInbox() {
    const res = await axios.get("https://api.github.com/notifications?all=true", {
        headers: {
            Authorization: `token ${token}`
        }
    });

    const notifications = res.data.map(notification => {
        return {
            title: notification.subject.title,
            repo: notification.repository.full_name
        };
    });

  return notifications || null;
}
