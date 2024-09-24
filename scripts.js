const apiKey = 'd3e1a6d4468a8819de7625a952e08b1c';

// Function to detect day or night and change background
function setDayNightBackground() {
    const hour = new Date().getHours();
    const body = document.body;

    if (hour >= 6 && hour < 18) {
        body.style.backgroundImage = "url('day-background.jpg')"; // Add a link to your day image
    } else {
        body.style.backgroundImage = "url('night-background.jpg')"; // Add a link to your night image
    }
}

// Function to get weather by user input city
function getWeatherByCity() {
    const city = document.getElementById('city-input').value.trim();
    if (city) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        fetchWeather(apiUrl);
    } else {
        alert('Please enter a valid city name.');
    }
}

// Function to get weather by dropdown city selection
function getWeatherByCitySelection() {
    const city = document.getElementById('city-select').value;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    fetchWeather(apiUrl);
}

// Function to get weather based on user's geolocation
function getWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
                fetchWeather(apiUrl);
            },
            error => {
                console.error('Error fetching geolocation:', error);
                alert('Unable to fetch your location.');
            }
        );
    } else {
        alert('Geolocation is not supported by your browser.');
    }
}

// Function to fetch weather data
function fetchWeather(apiUrl) {
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            document.getElementById('current-weather-data').innerHTML = `<p>Error: ${error.message}</p>`;
        });
}

// Function to display weather data
function displayWeather(data) {
    const currentWeatherElement = document.getElementById('current-weather-data');
    const locationElement = document.getElementById('location');

    const { temp } = data.main;
    const weatherDescription = data.weather[0].description;
    const icon = data.weather[0].icon;
    const city = data.name;

    locationElement.textContent = city;
    currentWeatherElement.innerHTML = `
        <p>Temperature: ${temp.toFixed(1)} °C</p>
        <p>Condition: ${capitalizeFirstLetter(weatherDescription)}</p>
        <img src="http://openweathermap.org/img/wn/${icon}.png" alt="${weatherDescription}" class="weather-icon">
    `;

    get5DayForecast(city);
}

// Function to get 5-day forecast
function get5DayForecast(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => display5DayForecast(data))
        .catch(error => console.error('Error fetching 5-day forecast:', error));
}

// Function to display 5-day forecast
function display5DayForecast(data) {
    const forecastContainer = document.getElementById('forecast-data');
    forecastContainer.innerHTML = '';

    const dailyForecasts = data.list.filter((item, index) => index % 8 === 0);

    dailyForecasts.forEach(forecast => {
        const temp = forecast.main.temp.toFixed(1);
        const weatherDescription = forecast.weather[0].description;
        const icon = forecast.weather[0].icon;
        const date = new Date(forecast.dt_txt).toLocaleDateString();

        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');
        forecastItem.innerHTML = `
            <h4>${date}</h4>
            <img src="http://openweathermap.org/img/wn/${icon}.png" alt="${weatherDescription}" class="weather-icon">
            <p>${temp} °C</p>
            <p>${capitalizeFirstLetter(weatherDescription)}</p>
        `;
        forecastContainer.appendChild(forecastItem);
    });
}

// Helper function to capitalize first letter of string
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Initialize app with geolocation and background settings
window.onload = () => {
    setDayNightBackground();
    getWeatherByLocation();
};
