const apiKey = "YOUR_API_KEY"; // Replace with your OpenWeatherMap API key

const form = document.getElementById("weatherForm");
const input = document.getElementById("cityInput");
const resultDiv = document.getElementById("weatherResult");
const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const locationBtn = document.getElementById("locationBtn");
const toggleBtn = document.getElementById("darkToggle");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = input.value.trim();
  if (city) {
    fetchWeatherByCity(city);
  }
});

locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
    });
  } else {
    alert("Geolocation not supported");
  }
});

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

async function fetchWeatherByCity(city) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();
    showWeather(data);
  } catch {
    alert("Error fetching weather by city.");
  }
}

async function fetchWeatherByCoords(lat, lon) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();
    showWeather(data);
  } catch {
    alert("Error fetching weather by location.");
  }
}

function showWeather(data) {
  if (data.cod === 200) {
    resultDiv.classList.remove("hidden");
    cityName.textContent = `📍 ${data.name}, ${data.sys.country}`;
    temperature.textContent = `🌡️ Temp: ${data.main.temp}°C`;
    condition.textContent = `🌥️ Weather: ${data.weather[0].description}`;
    humidity.textContent = `💧 Humidity: ${data.main.humidity}%`;
    wind.textContent = `💨 Wind: ${data.wind.speed} m/s`;
  } else {
    alert("Weather data not available.");
    resultDiv.classList.add("hidden");
  }
}

const forecastDiv = document.createElement('div');
forecastDiv.id = "forecast";
resultDiv.appendChild(forecastDiv);

async function fetch7DayForecast(lat, lon) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&appid=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    displayForecast(data.daily);
  } catch (error) {
    console.error("Failed to fetch 7-day forecast:", error);
  }
}

function displayForecast(days) {
  const forecastHTML = days.slice(1, 8).map(day => {
    const date = new Date(day.dt * 1000);
    const icon = day.weather[0].icon;
    return \`
      <div class="forecast-day">
        <p>\${date.toDateString()}</p>
        <img src="https://openweathermap.org/img/wn/\${icon}@2x.png" alt="icon">
        <p>🌡️ Max: \${day.temp.max}°C / Min: \${day.temp.min}°C</p>
        <p>💧 \${day.humidity}%</p>
      </div>
    \`;
  }).join("");
  document.getElementById("forecast").innerHTML = \`<h3>7-Day Forecast</h3><div class="forecast-container">\${forecastHTML}</div>\`;
}

// Hook forecast fetch into weather function
function showWeather(data) {
  if (data.cod === 200) {
    resultDiv.classList.remove("hidden");
    cityName.textContent = `📍 ${data.name}, ${data.sys.country}`;
    temperature.textContent = `🌡️ Temp: ${data.main.temp}°C`;
    condition.textContent = `🌥️ Weather: ${data.weather[0].description}`;
    humidity.textContent = `💧 Humidity: ${data.main.humidity}%`;
    wind.textContent = `💨 Wind: ${data.wind.speed} m/s`;
    fetch7DayForecast(data.coord.lat, data.coord.lon);
  } else {
    alert("Weather data not available.");
    resultDiv.classList.add("hidden");
  }
}
