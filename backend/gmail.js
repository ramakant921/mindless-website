import axios from "axios";
import Utils from "./utils.js";
import cookie from "cookie";
import dotenv from 'dotenv'; // load .env to access our tokens 
import querystring from 'querystring';
dotenv.config();

const client_id = process.env.GOOGLE_CLIENT_ID;
const client_secret = process.env.GOOGLE_CLIENT_SECRET;
const redirect_uri = Utils.redirectURL("gmail");

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

export async function getGmailLogin(res) {
    console.log("in google callback");
    // Randomize the state later
    // let state = generateRandomString(16);
    let state = "thcehnwhetpnegtr";
    let scope = 'https://www.googleapis.com/auth/gmail.readonly';

    res.redirect('https://accounts.google.com/o/oauth2/auth?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state,
            access_type: 'offline',
            prompt: 'consent'
        }));
}

export async function gmailCallback(req, res){
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
            "https://oauth2.googleapis.com/token",
            new URLSearchParams({
                grant_type: "authorization_code",
                code: code,
                client_id: client_id,
                client_secret: client_secret,
                redirect_uri: redirect_uri,
            })
        );

        const { access_token, refresh_token, expires_in} = response.data;
        setGoogleTokenCookies(res, { access_token, refresh_token, expires_in });
        console.log(response.data)

        res.redirect('/');

    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ error: "Failed to get tokens" });
    }
}

// Store Token As Cookie
export function setGoogleTokenCookies(res, { access_token, refresh_token, expires_in }) {
    if (!access_token || !refresh_token) return;

    console.log("saving data......");

    const now = Math.floor(Date.now() / 1000); // convert ms to seconds
    res.setHeader("Set-Cookie", [
        cookie.serialize("google_access_token", access_token, {
            ...cookieOptions,
            maxAge: 30 * 24 * 60 * 60, // expires after 30 days
        }),
        cookie.serialize("google_access_expires_at", now + expires_in, {
            ...cookieOptions,
            maxAge: expires_in, // expires in 1 hour
        }),
        cookie.serialize("google_refresh_token", refresh_token, {
            ...cookieOptions,
            maxAge: 30 * 24 * 60 * 60, // expires after 30 days
        })
    ]);

    console.log("saved data");
}

export function retrieveGoogleTokens(req) {
    if (!req.headers.cookie) {
        console.log("Warning: no cookies to eat");
        return null;
    };

    const parsed = cookie.parse(req.headers.cookie);

    return {
        access_token: parsed.google_access_token || null,
        refresh_token: parsed.google_refresh_token || null,
        expires_at: parsed.google_access_expires_at
        ? Number(parsed.google_access_expires_at) // convert string to int
        : null,
    };
}

export function isGmailAccessTokenExpired(tokens) {
  if (!tokens.expires_at) return true;
  return Math.floor(Date.now() / 1000) > tokens.expires_at;
}

// Refresh Token
export async function refreshGmailAccessToken(res, refresh_token) {
    if (!refresh_token) throw new Error("No refresh token available");

    const response = await axios.post(
        "https://oauth2.googleapis.com/token",
        new URLSearchParams({
            client_id: client_id,
            client_secret: client_secret,
            refresh_token,
            grant_type: "refresh_token",
        })
    );

    const data = response.data;

    // Update cookies
    setGoogleTokenCookies(res, {
        access_token: data.access_token,
        refresh_token: refresh_token, 
        expires_in: data.expires_in,
    });

    return data.access_token;
}

export async function getGmailInbox(req, res) {
    const tokens = retrieveGoogleTokens(req); 

    if (!tokens.access_token || isGmailAccessTokenExpired(tokens)) {
        tokens.access_token = await refreshGmailAccessToken(res, tokens.refresh_token);
    }

    try {
        // It retrieves the message id (just a extra step to handle: bs)
        const listRes = await axios.get(
            "https://gmail.googleapis.com/gmail/v1/users/me/messages", 
            {
                headers: { Authorization: `Bearer ${tokens.access_token}` },
                params: {
                    maxResults: 10,
                }
            }
        );

        if (!listRes.data.messages) return null;

        // Now fetch the detailed version using the ids
        const detailedMessages = await Promise.all(
            listRes.data.messages.map(async (msg) => {
                const detailRes = await axios.get(
                    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`,
                    {
                        headers: { Authorization: `Bearer ${tokens.access_token}` },
                        params: { format: "full" }
                    }
                );

                const payload = detailRes.data.payload;
                const headers = payload.headers;

                const subject = headers.find(h => h.name === "Subject")?.value || "(No Subject)";

                return {
                    id: msg.id,
                    snippet: detailRes.data.snippet, // small content for preview
                    subject,
                };
            })
        );

        console.log(detailedMessages);
        return detailedMessages;

    } catch (err) {
        console.error(
            "Error fetching Inbox:",
            err.response?.data || err.message
        );
        return null;
    }
}

