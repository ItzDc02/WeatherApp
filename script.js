let useFahrenheit = false;

function toggleUnit() {
  useFahrenheit = document.getElementById("unitToggle").checked;
  getWeather();
}

function toggleDarkMode() {
  const body = document.body;
  body.classList.toggle("dark");
  const isDark = body.classList.contains("dark");
  const toggleBtn = document.getElementById("themeToggle");
  toggleBtn.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

function cToF(c) {
  return Math.round((parseFloat(c) * 9) / 5 + 32);
}

async function getWeather() {
  let city = document.getElementById("cityInput").value.trim();
  if (!city) {
    try {
      const position = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );
      const { latitude, longitude } = position.coords;
      city = `${latitude},${longitude}`;
    } catch {
      alert("Location access denied. Please enter a city name.");
      return;
    }
  }

  const url = `https://wttr.in/${city}?format=j1`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Fetch failed");
    const data = await res.json();

    const current = data.current_condition[0];
    const weather = data.weather[0];
    const astronomy = weather.astronomy[0];

    const unitSymbol = useFahrenheit ? "°F" : "°C";
    const temp = useFahrenheit ? cToF(current.temp_C) : current.temp_C;
    const feels = useFahrenheit ? cToF(current.FeelsLikeC) : current.FeelsLikeC;

    document.getElementById("temperature").textContent = `${temp}${unitSymbol}`;
    document.getElementById("feels").textContent = `${feels}${unitSymbol}`;
    document.getElementById("humidity").textContent = `${current.humidity}%`;
    document.getElementById(
      "wind"
    ).textContent = `${current.windspeedKmph} km/h`;
    document.getElementById("description").textContent =
      current.weatherDesc[0].value;
    document.getElementById("uv").textContent = current.uvIndex || "N/A";
    document.getElementById(
      "visibility"
    ).textContent = `${current.visibility} km`;
    document.getElementById("precip").textContent = `${current.precipMM} mm`;
    document.getElementById("sunrise").textContent = astronomy.sunrise;
    document.getElementById("sunset").textContent = astronomy.sunset;
    document.getElementById("cloud").textContent = `${current.cloudcover}%`;

    document.getElementById(
      "location"
    ).textContent = `Weather in ${data.nearest_area[0].areaName[0].value}`;
    document.getElementById("result").classList.remove("hidden");
  } catch (err) {
    console.error("Error fetching weather:", err);
    alert("Couldn't fetch weather data.");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    document.getElementById("themeToggle").textContent = "☀️";
  }
  getWeather();
});
