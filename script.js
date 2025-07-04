let useFahrenheit = false;

function toggleUnit() {
  useFahrenheit = document.getElementById("unitToggle").checked;
  getWeather();
}

function toggleDarkMode() {
  const body = document.body;
  body.classList.toggle("dark");
  const isDark = body.classList.contains("dark");
  document.getElementById("themeToggle").textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

function cToF(c) {
  return Math.round((parseFloat(c) * 9) / 5 + 32);
}

async function getWeather() {
  const loading = document.getElementById("loading");
  const errorMsg = document.getElementById("errorMsg");
  loading.classList.remove("hidden");
  errorMsg.classList.add("hidden");

  let city = document.getElementById("cityInput").value.trim();
  if (!city) {
    try {
      const position = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );
      const { latitude, longitude } = position.coords;
      city = `${latitude},${longitude}`;
    } catch {
      errorMsg.textContent = "Location access denied. Please enter a city.";
      errorMsg.classList.remove("hidden");
      loading.classList.add("hidden");
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

    updateText("temperature", `${temp}${unitSymbol}`);
    updateText("feels", `${feels}${unitSymbol}`);
    updateText("humidity", `${current.humidity}%`);
    updateText("wind", `${current.windspeedKmph} km/h`);
    updateText("description", current.weatherDesc[0].value);
    updateText("uv", current.uvIndex || "N/A");
    updateText("visibility", `${current.visibility} km`);
    updateText("precip", `${current.precipMM} mm`);
    updateText("sunrise", astronomy.sunrise);
    updateText("sunset", astronomy.sunset);
    updateText("cloud", `${current.cloudcover}%`);

    document.getElementById(
      "location"
    ).textContent = `Weather in ${data.nearest_area[0].areaName[0].value}`;
    document.getElementById("result").classList.remove("hidden");
  } catch (err) {
    errorMsg.textContent = "Couldn't fetch weather data.";
    errorMsg.classList.remove("hidden");
  } finally {
    loading.classList.add("hidden");
  }
}

function updateText(id, text) {
  const el = document.getElementById(id);
  el.classList.remove("show");
  setTimeout(() => {
    el.textContent = text;
    el.classList.add("show");
  }, 100);
}

window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    document.getElementById("themeToggle").textContent = "☀️";
  }
  getWeather();
});
