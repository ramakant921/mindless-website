import axios from "axios";
import cookie from "cookie";

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

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

// Store Token As Cookie
export function setTokenCookies(res, { access_token, refresh_token, expires_in }) {
  if (!access_token || !refresh_token) return;

    console.log("saving data......");

    console.log("saving data......");
    const now = Math.floor(Date.now() / 1000); // convert ms to seconds
  res.setHeader("Set-Cookie", [
    cookie.serialize("spotify_access_token", access_token, {
      ...cookieOptions,
      maxAge: expires_in, // expires in 1 hour
    }),
    cookie.serialize("spotify_access_expires_at", now + expires_in, {
      ...cookieOptions,
      maxAge: expires_in, // expires in 1 hour
    }),
    cookie.serialize("spotify_refresh_token", refresh_token, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60, // expires after 30 days
    }),
  ]);

    console.log("saved data");
}

export function loadTokensFromCookies(req) {
    if (!req.headers.cookie) {
        console.log("Warning: no cookies to eat");
        return null;
    };

    const parsed = cookie.parse(req.headers.cookie);

    return {
        access_token: parsed.spotify_access_token || null,
        refresh_token: parsed.spotify_refresh_token || null,
        expires_at: parsed.spotify_access_expires_at
        ? Number(parsed.spotify_access_expires_at) // convert string to int
        : null,
    };
}

export function isAccessTokenExpired(tokens) {
  if (!tokens.expires_at) return true;
  return Math.floor(Date.now() / 1000) > tokens.expires_at;
}

// Refresh Token
export async function refreshAccessToken(res, refresh_token) {
    if (!refresh_token) throw new Error("No refresh token available");

    const response = await axios.post(
        "https://accounts.spotify.com/api/token",
        new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: refresh_token,
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

    const data = response.data;

    // Update cookies
    setTokenCookies(res, {
        access_token: data.access_token,
        refresh_token: refresh_token, 
        expires_in: data.expires_in,
    });

    return data.access_token;
}

async function fetchSpotify(req, res, endpoint, method = "GET") {
    let tokens = loadTokensFromCookies(req);

    if (!tokens.access_token || isAccessTokenExpired(tokens)) {
        tokens.access_token = await refreshAccessToken(res, tokens.refresh_token);
    }

    const apiRes = await axios(`https://api.spotify.com/${endpoint}`, {
        method,
        headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    return apiRes.data;
}

export async function getCurrentTrack(req, res) {
    try {
        const data = await fetchSpotify(req, res, "v1/me/player/currently-playing");
        console.log(data);
        if (!data) return null;

        return {
            name: data.item?.name,
            artist: data.item?.artists?.map(a => a.name).join(", "),
            image: data.item?.album?.images?.[0]?.url
        };
    }
    catch (err) {
        console.error(
            "Error fetching current track:",
            err.response?.data || err.message
        );
        return null;
    }
}
