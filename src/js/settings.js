export const setting = {
    port: 42069,
    prod: true // production
}

export const backendURL = setting.prod ? "https://backup-mindless-website.onrender.com" : `http://127.0.0.1:${setting.port}`;



