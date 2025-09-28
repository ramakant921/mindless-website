// spotify.js
import axios from "axios";
import cookie from "cookie";

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

let tokens = {
  access_token: null,
  refresh_token: null,
  expires_at: null, // in ms
};

// Store Token As Cookie
export function setTokens({ access_token, refresh_token, expires_in }) {
  tokens.access_token = access_token;
  tokens.refresh_token = refresh_token || tokens.refresh_token;
  tokens.expires_at = Date.now() + expires_in * 1000; // convert it to ms
}

export function getAccessToken() {
  return tokens.access_token;
}

export function getRefreshToken() {
  return tokens.refresh_token;
}

export function isAccessTokenExpired() {
  return Date.now() > tokens.expires_at;
}

export function setTokenCookies(res) {
  if (!tokens.access_token) return;

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  };

  res.setHeader("Set-Cookie", [
    cookie.serialize("spotify_access_token", tokens.access_token, {
      ...options,
      maxAge: 3600,
    }),
    cookie.serialize("spotify_refresh_token", tokens.refresh_token, {
      ...options,
      maxAge: 30 * 24 * 60 * 60, // expires after 30 days
    }),
  ]);
}

export function loadTokensFromCookies(req) {
  if (!req.headers.cookie) return;

  const parsed = cookie.parse(req.headers.cookie);

  if (parsed.spotify_access_token) {
    tokens.access_token = parsed.spotify_access_token;
  }
  if (parsed.spotify_refresh_token) {
    tokens.refresh_token = parsed.spotify_refresh_token;
  }
}

// Refresh Token
export async function refreshAccessToken() {
  if (!tokens.refresh_token) throw new Error("No refresh token available");

  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: tokens.refresh_token,
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

  setTokens(response.data);
  console.log("Refresh Spotify Token...");
  return tokens.access_token;
}

async function fetchSpotify(endpoint, method = "GET") {
  let token = getAccessToken();

  if (!token || isAccessTokenExpired()) {
    token = await refreshAccessToken();
  }

  const res = await axios(`https://api.spotify.com/${endpoint}`, {
    method,
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
}

export async function getCurrentTrack() {
  try {
    const data = await fetchSpotify("v1/me/player/currently-playing");
    if (!data || Object.keys(data).length === 0) return null;
    return {
      name: data.item?.name,
      artist: data.item?.artists?.map(a => a.name).join(", "),
      image: data.item?.album?.images?.[0]?.url
    };
  } catch (err) {
    console.error("Error fetching current track:", err.response?.data || err.message);
    return null;
  }
}
