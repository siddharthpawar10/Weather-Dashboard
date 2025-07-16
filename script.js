// Replace with your OpenWeatherMap API key
const API_KEY = 'a8880aa4866cae11796bf279281aa9f6';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

async function searchWeather() {
    const cityInput = document.getElementById('cityInput');
    const city = cityInput.value.trim();

    if (!city) {
        alert('Please enter a city name');
        return;
    }

    try {
        // Fetch current weather
        const currentWeather = await getCurrentWeather(city);
        displayCurrentWeather(currentWeather);

        // Fetch forecast
        const forecast = await getForecast(city);
        displayForecast(forecast);
    } catch (error) {
        alert('Error fetching weather data. Please try again.');
        console.error('Error:', error);
    }
}

async function getCurrentWeather(city) {
    const response = await fetch(
        `${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`
    );
    if (!response.ok) throw new Error('City not found');
    return await response.json();
}

async function getForecast(city) {
    const response = await fetch(
        `${BASE_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`
    );
    if (!response.ok) throw new Error('Forecast not found');
    return await response.json();
}

function displayCurrentWeather(data) {
    document.getElementById('cityName').textContent = data.name;
    document.getElementById('temperature').textContent = 
        `Temperature: ${Math.round(data.main.temp)}°C`;
    document.getElementById('humidity').textContent = 
        `Humidity: ${data.main.humidity}%`;
    document.getElementById('conditions').textContent = 
        `Conditions: ${data.weather[0].main}`;
    document.getElementById('weatherIcon').src = 
      `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

function displayForecast(data) {
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';

    // Get one forecast per day (every 8th item as the API returns 3-hour forecasts)
    const dailyForecasts = data.list.filter((item, index) => index % 8 === 0);

    dailyForecasts.forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

        const forecastDay = document.createElement('div');
        forecastDay.className = 'forecast-day';
        forecastDay.innerHTML = `
            <div>${dayName}</div>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="Weather Icon">
            <div>${Math.round(day.main.temp)}°C</div>
            <div>${day.weather[0].main}</div>
        `;

        forecastContainer.appendChild(forecastDay);
    });
}