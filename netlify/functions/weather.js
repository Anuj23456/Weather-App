const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const location = event.queryStringParameters.location;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!location) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing location parameter' })
    };
  }

  try {
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`
    );

    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`
    );

    const weatherData = await weatherRes.json();
    const forecastData = await forecastRes.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        current: weatherData,
        forecast: forecastData
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch weather data' })
    };
  }
};

