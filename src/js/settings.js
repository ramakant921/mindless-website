export const setting = {
    port: 42069,
    prod: false // production
}

// export const backendURL = setting.prod ? "https://mindless-website-ramakant921s-projects.vercel.app" : `http://127.0.0.1:${setting.port}`;
export const backendURL = setting.prod ? "https://backup-mindless-website.onrender.com" : `http://127.0.0.1:${setting.port}`;



