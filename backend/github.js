import axios from "axios";
import cookie from "cookie";
import dotenv from 'dotenv'; // load .env to access our tokens 
import querystring from 'querystring';
dotenv.config();

const client_id = process.env.GITHUB_CLIENT_ID;
const client_secret = process.env.GITHUB_CLIENT_SECRET;
const redirect_uri = 'http://127.0.0.1:42069/auth/github/callback';

// for prod
// const cookieOptions = {
//     httpOnly: true,
//     secure: true, 
//     sameSite: "lax",
//     path: "/",
// };

// for dev
const cookieOptions = {
    httpOnly: true,
    secure: false, // [Warning]: Mr.R make sure to keep it true for prod it's okay for dev
    sameSite: "lax",
    path: "/",
};


export async function getGithubLogin(res) {
    // Randomize the state later
    // let state = generateRandomString(16);
    let state = "thcehnwhetpnegtr";
    let scope = 'repo notifications read:user';

    res.redirect('https://github.com/login/oauth/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
}

export async function githubCallback(req, res){
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
        const response = await axios.get(
            "https://github.com/login/oauth/access_token", 
            {
                params: {
                    client_id: client_id,
                    client_secret: client_secret,
                    code: code,
                    redirect_uri: redirect_uri,
                },
                headers: {
                    "Accept": "application/json",
                    "Accept-Encoding": "application/json",
                },
            }
        );

        const { access_token } = response.data;
        setGithubTokenCookies(res, access_token);

        res.redirect('/');

    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ error: "Failed to get tokens" });
    }
}

// Store Token As Cookie
export function setGithubTokenCookies(res, access_token) {
  if (!access_token) return;

    console.log("saving data......");
  res.setHeader("Set-Cookie", [
    cookie.serialize("github_access_token", access_token, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60, // expires after 30 days
    })
  ]);

    console.log("saved data");
}

export function retrieveGithubTokens(req) {
    if (!req.headers.cookie) {
        console.log("Warning: no cookies to eat");
        return null;
    };

    const parsed = cookie.parse(req.headers.cookie);

    return parsed.github_access_token || null;
}

export async function getGithubRepo(req) {
    const token = retrieveGithubTokens(req); 
    if(!token) return;
    try {
        const res = await axios.get("https://api.github.com/user/repos?sort=updated", {
            headers: {
                Authorization: `token ${token}`
            }
        });

        if (!res) return null;

        // github api return a object (collection of different data type like variable or array)
        // we access object data with . like response.data (so data is a part of object which is stored in the response var.)
        const repoNames = res.data.map(repo => repo.full_name); // .map is basically return a array where we are appending all the name of the repo)
        return repoNames || null; // return data to our server if there is any data otherwise return null
    }
    catch (err) {
        console.error(
            "Error fetching Repos:",
            err.response?.data || err.message
        );
        return null;
    }
}

export async function getGithubFork(req) {
    const token = retrieveGithubTokens(req); 
    if(!token) return;
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

export async function getGithubInbox(req) {
    const token = retrieveGithubTokens(req); 
    if(!token) return;
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
