const apiKey = '4ee8870ce105e5efb3e646d2cd0455b5';
const weatherDataDiv = document.getElementById('weatherData');
const extendedForecastDiv = document.getElementById('extendedForecast');
const recentCitiesDiv = document.getElementById('recentCities');
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const currentLocationBtn = document.getElementById('currentLocationBtn');

// Retrieve recent cities from local storage or initialize an empty array
let recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];

// Event listener for the search button
searchBtn.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
        fetchWeatherData(city);
        updateRecentCities(city);
    } else {
        alert('Please enter a city name.');
    }
});

// Event listener for the current location button
currentLocationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            fetchWeatherDataByCoords(latitude, longitude);
        }, () => {
            alert('Unable to retrieve your location.');
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});
// Event listener for the dropdown menu
recentCitiesDropdown.addEventListener('change', (event) => {
    const selectedCity = event.target.value;
    if (selectedCity) {
        fetchWeatherData(selectedCity); // Fetch weather data for the selected city
    }
});

// Function to fetch weather data by city name
function fetchWeatherData(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => displayWeatherData(data))
        .catch(() => alert('Failed to retrieve weather data.'));
}

function fetchWeatherDataByCoords(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => displayWeatherData(data))
        .catch(() => alert('Failed to retrieve weather data.'));
}

// Function to fetch and display extended forecast for a city

function fetchExtendedForecast(city) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => displayExtendedForecast(data))
        .catch(() => alert('Failed to retrieve extended forecast.'));
}

// Function to display current weather data
function displayWeatherData(data) {
    const { name, main, weather, wind } = data;
    const icon = weather[0].icon;
    weatherDataDiv.innerHTML = `
        <h2 class="text-2xl font-bold">${name}</h2>
        <p>Temperature: ${main.temp} °C</p>
        <p>Humidity: ${main.humidity} %</p>
        <p>Wind Speed: ${wind.speed} m/s</p>
        <img src="http://openweathermap.org/img/wn/${icon}.png" alt="${weather[0].description}">
    `;
    fetchExtendedForecast(name);
}

// Function to display extended forecast data
function displayExtendedForecast(data) {
    extendedForecastDiv.innerHTML = data.list.slice(0, 5).map(forecast => {
        const { dt_txt, main, weather, wind } = forecast;
        const icon = weather[0].icon;
        return `
            <div class="mt-2 p-2 border rounded">
                <p>${dt_txt}</p>
                <p>Temperature: ${main.temp} °C</p>
                <p>Humidity: ${main.humidity} %</p>
                <p>Wind Speed: ${wind.speed} m/s</p>
                <img src="http://openweathermap.org/img/wn/${icon}.png" alt="${weather[0].description}">
            </div>
        `;
    }).join('');
}

// Function to update the list of recent cities
function updateRecentCities(city) {
    if (!recentCities.includes(city)) {
        recentCities.push(city);
        if (recentCities.length > 5) {
            recentCities.shift();
        }
        localStorage.setItem('recentCities', JSON.stringify(recentCities));
    }
    displayRecentCities(); // Update the dropdown menu
}

// Function to display recent cities in the dropdown menu
function displayRecentCities() {
    recentCitiesDropdown.innerHTML = recentCities.map(city => `
        <option value="${city}">${city}</option>
    `).join('');
    recentCitiesDropdown.classList.toggle('hidden', recentCities.length === 0);
}

// Initial call to display recent cities on page load
displayRecentCities();
