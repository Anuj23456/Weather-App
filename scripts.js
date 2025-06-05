document.getElementById('weather-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const location = document.getElementById('location').value.trim();
    if (location) {
        getWeather(location);
    }
});

async function getWeather(location) {
    const apiKey = '786dfe56017ae4a386ab03326e5e8a00'; // Replace if needed
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;

    try {
        const [currentWeatherResponse, forecastResponse] = await Promise.all([
            fetch(currentWeatherUrl),
            fetch(forecastUrl)
        ]);

        if (currentWeatherResponse.ok && forecastResponse.ok) {
            const currentWeatherData = await currentWeatherResponse.json();
            const forecastData = await forecastResponse.json();
            displayCurrentWeather(currentWeatherData);
            displayForecast(forecastData);
        } else {
            alert('Unable to fetch weather data. Please check the location and try again.');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data. Please try again later.');
    }
}

function displayCurrentWeather(data) {
    const weatherDiv = document.getElementById('current-weather');
    const weatherIcon = getWeatherIcon(data.weather[0].main);
    weatherDiv.innerHTML = `
        <h3>Current Weather in ${data.name}</h3>
        <img src="${weatherIcon}" alt="${data.weather[0].description}" class="weather-icon">
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>${data.weather[0].description}</p>
    `;
}

function displayForecast(data) {
    const forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = '<h3>5-Day Forecast</h3>';

    const forecastByDay = data.list.reduce((acc, forecast) => {
        const date = new Date(forecast.dt * 1000).toLocaleDateString();
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(forecast);
        return acc;
    }, {});

    for (const [date, forecasts] of Object.entries(forecastByDay)) {
        const avgTemp = (forecasts.reduce((acc, forecast) => acc + forecast.main.temp, 0) / forecasts.length).toFixed(1);
        const avgHumidity = (forecasts.reduce((acc, forecast) => acc + forecast.main.humidity, 0) / forecasts.length).toFixed(1);
        const description = forecasts[0].weather[0].description;
        const weatherIcon = getWeatherIcon(forecasts[0].weather[0].main);

        forecastDiv.innerHTML += `
            <div class="weather-day">
                <p>${date}</p>
                <img src="${weatherIcon}" alt="${description}" class="weather-icon">
                <p>Temp: ${avgTemp}°C</p>
                <p>Humidity: ${avgHumidity}%</p>
                <p>${description}</p>
            </div>
        `;
    }
}

function getWeatherIcon(weather) {
    switch (weather.toLowerCase()) {
        case 'clear':
            return 'images/clear.png';
        case 'clouds':
            return 'images/clouds.png';
        case 'rain':
            return 'images/rain.png';
        case 'snow':
            return 'images/snow.png';
        case 'thunderstorm':
            return 'images/thunderstorm.png';
        default:
            return 'images/default.png';
    }
}
