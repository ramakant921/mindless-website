import { setting, backendURL } from './settings.js';

function displayWeather(data) {
    const temp = document.getElementById("temp");
    const location = document.getElementById("location");
    const wind = document.getElementById("wind-speed");
    const humidity = document.getElementById("humidity");

    const tempInC = Math.floor(data.main.temp - 273.15); // Kelvin -> Celsius
    temp.innerText = tempInC;
    location.innerText = data.name;
    wind.innerText = data.wind.speed;
    humidity.innerText = data.main.humidity;

    const weatherType = data.weather[0].main;
    console.log(weatherType);
    const weatherIcon = document.getElementById("weather-icon");
    switch (weatherType) {
        case "Clear":
            weatherIcon.src = "../assets/images/sunny.png"
            break;
        case "Rain":
            weatherIcon.src = "../assets/images/rainy.png"
            break;
    }
}

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

async function success(pos) {
    const crd = pos.coords;

    const endpoint = backendURL;
    fetch(`${endpoint}/weather`, {
        method: "POST",
        body: JSON.stringify({lat: crd.latitude, long: crd.longitude}),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then(res => res.json())
        .then(data => {
            displayWeather(data);
        });
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

navigator.geolocation.getCurrentPosition(success, error, options);
