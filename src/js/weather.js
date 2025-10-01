const PORT = 42069;

function displayWeather(data) {
    const temp = document.getElementById("temp");
    const location = document.getElementById("location");
    const wind = document.getElementById("wind-speed");
    const humidity = document.getElementById("humidity");

    // const tempInC = (data.main.temp - 32) / 1.8
    // temp.innerText = tempInC;
    temp.innerText = data.main.temp;
    location.innerText = data.name;
    wind.innerText = data.wind.speed;
    humidity.innerText = data.main.humidity;

}

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

async function success(pos) {
    const crd = pos.coords;

    console.log("Your current position is:");
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);

    fetch(`http://127.0.0.1:${PORT}/weather`, {
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

    // const data = await weatherRes.text();
    // console.log(data);
    // console.log(weatherRes);
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

navigator.geolocation.getCurrentPosition(success, error, options);
