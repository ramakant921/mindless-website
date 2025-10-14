import dotenv from 'dotenv';
dotenv.config();

class Utils {
  static isProd() {
    return process.env.PROD_ENV === 'true';  // set PROD_ENV=true on Render
  }

  static frontendURL() {
    if (this.isProd()) {
      return process.env.FRONTEND_URL_PROD || 'https://mindless-dashboard.web.app';
    } else {
      return process.env.FRONTEND_URL_DEV || 'http://127.0.0.1:42069';
    }
  }

  static backendURL() {
    if (this.isProd()) {
      return 'https://backup-mindless-website.onrender.com';
    } else {
      return 'http://127.0.0.1:42069';
    }
  }

  static redirectURL(appName) {
      // backend url
      const DOMAIN = this.isProd() ? 'https://backup-mindless-website.onrender.com' : 'http://127.0.0.1:42069';
      switch (appName){
          case "github":
              return `${DOMAIN}/auth/github/callback`;
          case "spotify":
              return `${DOMAIN}/auth/spotify/callback`;
          case "gmail":
              return `${DOMAIN}/auth/google/callback`;
          default:
              return null;
      }
  }
}

export default Utils;

