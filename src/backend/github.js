import axios from "axios";
import dotenv from 'dotenv'; // load .env to access our tokens 
dotenv.config();

const token = process.env.GITHUB_TOKEN;

if (!token) {
  console.error("bruh add your .env file with github token init....");
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
