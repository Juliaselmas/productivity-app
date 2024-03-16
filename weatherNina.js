const apiKey = "5e5d17a1ee152cc65e1a76adce1ff6ef";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q="


const searchBox = document.querySelector('.search input');
const searchBtn = document.querySelector('.search button');
const weatherIcon = document.querySelector('.weather-icon');
const errorDisplay = document.querySelector('.error');
const weatherDisplay = document.querySelector('.weather');
const cityDisplay = document.querySelector('.city');
const tempDisplay = document.querySelector('.temp');
const humidityDisplay = document.querySelector('.humidity');
const windDisplay = document.querySelector('.wind');

// Funktion för att hämta väderikonens sökväg baserat på väderförhållanden
function getWeatherIconPath(weatherMain) {
    switch (weatherMain) {
        case "Clouds":
            return "image/clouds.png";
        case "Clear":
            return "image/clear.png";
        case "Rain":
            return "image/rain.png";
        case "Drizzle":
            return "image/drizzle.png";
        case "Mist":
            return "image/mist.png";
        case "Snow":
            return "image/snow.png";
        default:
            return "";
    }
}

// Funktion för att visa väderinformation
function displayWeather(data) {
    cityDisplay.innerHTML = data.name;
    tempDisplay.innerHTML = Math.round(data.main.temp) + '°C';
    humidityDisplay.innerHTML = data.main.humidity + "%";
    windDisplay.innerHTML = data.wind.speed + 'km/h';
    
    const iconPath = getWeatherIconPath(data.weather[0].main);
    if (iconPath) {
        weatherIcon.src = iconPath;
    }

    weatherDisplay.style.display = "block";
    errorDisplay.style.display = "none";
}

// Funktion för att visa felmeddelande
function displayError() {
    errorDisplay.style.display = "block";
    weatherDisplay.style.display = "none";
}

// Funktion för att kontrollera väder
async function checkWeather(city) {
    try {
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
        if (!response.ok) {
            throw new Error('Could not fetch data');
        }
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        displayError();
    }
}

// Lyssnare för sökknappen
searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});