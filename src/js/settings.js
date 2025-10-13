export const setting = {
    port: 42069,
    prod: false // production
}

export const backendURL = setting.prod ? "https://mindless-website-ramakant921s-projects.vercel.app" : `http://127.0.0.1:${setting.port}`;



