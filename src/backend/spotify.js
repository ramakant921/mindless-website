// these token expire in 1 hours so we would need to refesh it whenever it expires
// i'll work on this tommorow
// today i'll implement github widget
const token = 'BQBdvTX51BTslaIxHp2IJihjcL6bVLtoLVTPvMX-F709hVcejt-2v2k8H1LZ0mQI4pxJrwqaFfgY97xWgD2GaKNbb0hvosVZGw_kVU-UyZkC8w5mtljg6QOttGbJW3B80zz6aUnthmU6ousVcjzTE7PP34RwOPtCZcIO9-H6ZH5nK65FIu1AWRYyUL6r9SOnIuAgf9MhBMbWnaYTJC9-yF7lhVnS2_rMGbYuAq5WIGKCF5SM48hlFj21hWonW2-VKJX9OHaYEkhRB8FE3cXPGXdL6seUAp6JEBDaPAhCtiK-ef6Nh-RSUk8ocklfcOks';
async function fetchWebApi(endpoint, method) {
    const res = await fetch (`https://api.spotify.com/${endpoint}`, {
        method,
        headers: {
            Authorization: `Bearer ${token}`,
        },
        redirect: 'follow'
    });
    return await res.json();
}

export async function getCurrentTrack() {
    const data = await fetchWebApi('v1/me/player/currently-playing', 'GET');
    console.log(data);
    return data?.item || null;
}
