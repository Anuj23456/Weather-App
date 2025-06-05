document.getElementById('weather-form').addEventListener('submit', function (event) {
  event.preventDefault();
  const location = document.getElementById('location').value.trim();
  if (location) {
    getWeather(location);
  }
});

async function getWeather(location) {
  const apiKey = '786dfe56017ae4a386ab03326e5e8a00'; // Replace in production
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;

  document.getElementById('loading').style.display = 'block';
  document.getElementById('current-weather').innerHTML = '';
  document.getElementById('forecast').innerHTML = '';

  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(currentWeatherUrl),
      fetch(forecastUrl)
    ]);

    if (!currentRes.ok || !forecastRes.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const currentData = await currentRes.json();
    const forecastData = await forecastRes.json();

    displayCurrentWeather(currentData);
    displayForecast(forecastData);
  } catch (error) {
    document.getElementById('current-weather').innerHTML = `<p>Error: ${error.message}</p>`;
  } finally {
    document.getElementById('loading').style.display = 'none';
  }
}

function displayCurrentWeather(data) {
  const icon = getWeatherIcon(data.weather[0].main);
  document.getElementById('current-weather').innerHTML = `
    <h3>${data.name}</h3>
    <img src="${icon}" alt="${data.weather[0].description}">
    <p><strong>${data.main.temp}°C</strong></p>
    <p>${data.weather[0].description}</p>
    <p>Humidity: ${data.main.humidity}%</p>
  `;
}

function displayForecast(data) {
  const container = document.getElementById('forecast');
  const grouped = data.list.reduce((acc, forecast) => {
    const date = new Date(forecast.dt * 1000).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(forecast);
    return acc;
  }, {});

  Object.entries(grouped).forEach(([date, forecasts]) => {
    const avgTemp = (
      forecasts.reduce((acc, f) => acc + f.main.temp, 0) / forecasts.length
    ).toFixed(1);
    const avgHumidity = (
      forecasts.reduce((acc, f) => acc + f.main.humidity, 0) / forecasts.length
    ).toFixed(1);
    const icon = getWeatherIcon(forecasts[0].weather[0].main);
    const desc = forecasts[0].weather[0].description;

    container.innerHTML += `
      <div class="weather-day">
        <h4>${date}</h4>
        <img src="${icon}" alt="${desc}">
        <p>${avgTemp}°C</p>
        <p>${desc}</p>
        <p>Humidity: ${avgHumidity}%</p>
      </div>
    `;
  });
}

function getWeatherIcon(condition) {
  switch (condition.toLowerCase()) {
    case 'clear':
      return 'https://cdn-icons-png.flaticon.com/128/869/869869.png';
    case 'clouds':
      return 'https://cdn-icons-png.flaticon.com/128/414/414825.png';
    case 'rain':
      return 'https://cdn-icons-png.flaticon.com/128/414/414974.png';
    case 'snow':
      return 'https://cdn-icons-png.flaticon.com/128/414/414956.png';
    case 'thunderstorm':
      return 'https://cdn-icons-png.flaticon.com/128/1146/1146869.png';
    default:
      return 'https://cdn-icons-png.flaticon.com/128/1163/1163624.png';
  }
}
