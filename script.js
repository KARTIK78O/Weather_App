const cityinput = document.querySelector(".city-input");
const searchbtn = document.querySelector(".search-btn");

const weatherInfoSection = document.querySelector(".weather-info");
const searchCitySection = document.getElementById("search-city-section");
const notFoundSection = document.getElementById("not-found-section");

const apikey = "3d2220581faf14228137343a6ea039b7";

const countryTxt = document.querySelector(".country-txt");
const tempTxt = document.querySelector(".temp-txt");
const conditionTxt = document.querySelector(".condition-txt");
const humidityValueTxt = document.querySelector(".humidity-value-txt");
const windValueTxt = document.querySelectorAll(".humidity-value-txt")[1]; // wind
const weatherSummaryImg = document.querySelector(
  ".weather-summary-container img"
);
const currentDateTxt = document.querySelector(".current-date-txt"); 
const forecastItemscontainer = document.querySelector(
  ".forecast-item-container"
);

// Event Listeners
searchbtn.addEventListener("click", () => {
  if (cityinput.value.trim() !== "") {
    updateWeatherInfo(cityinput.value);
    cityinput.value = "";
    cityinput.blur();
  }
});

cityinput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && cityinput.value.trim() !== "") {
    updateWeatherInfo(cityinput.value);
    cityinput.value = "";
    cityinput.blur();
  }
});

// API call
async function getFetchData(endPoint, city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apikey}&units=metric`;
  const response = await fetch(apiUrl);
  return response.json();
}

// Weather icon logic
function getWeatherIcon(id) {
  if (id <= 232) return "thunderstorm.svg";
  if (id <= 321) return "drizzle.svg";
  if (id <= 531) return "rain.svg";
  if (id <= 781) return "atmosphere.svg";
  if (id === 800) return "clear.svg";
  return "clouds.svg";
}

// Date formatter
function getCurrentDate() {
  const currentDate = new Date();
  const options = {
    weekday: "short",
    day: "2-digit",
    month: "short",
  };
  return currentDate.toLocaleDateString("en-GB", options);
}

// Main Function
async function updateWeatherInfo(city) {
  const weatherData = await getFetchData("weather", city);

  if (weatherData.cod != 200) {
    ShowDisplaySection(notFoundSection);
    return;
  }

  const {
    name: country,
    main: { temp, humidity },
    weather: [{ id, main }],
    wind: { speed },
  } = weatherData;

  countryTxt.textContent = country;
  tempTxt.textContent = Math.round(temp) + "℃";
  conditionTxt.textContent = main;
  humidityValueTxt.textContent = humidity + "%";
  windValueTxt.textContent = speed + "M/s";
  currentDateTxt.textContent = getCurrentDate();
  weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`;
  await updateForecastsInfo(city);
  ShowDisplaySection(weatherInfoSection);
}

async function updateForecastsInfo(city) {
  const forecastsData = await getFetchData("forecast", city);
  const timeTaken = "12:00:00";
  const todayDate = new Date().toISOString().split("T")[0];

  forecastItemscontainer.innerHTML = "";
  forecastsData.list.forEach((forecastsWeather) => {
    if (
      forecastsWeather.dt_txt.includes(timeTaken) &&
      !forecastsWeather.dt_txt.includes(todayDate)
    ) {
      updateForecastsItems(forecastsWeather);
    }
  });
}

function updateForecastsItems(weatherData) {
  console.log(weatherData);

  const {
    dt_txt: date,
    weather: [{ id }],
    main: { temp },
  } = weatherData;

  const dateTaken = new Date(date)
  const dateOption = {
    day:'2-digit',
    month:'short'
  }

  const dateResult = dateTaken.toLocaleDateString('en-US',dateOption)

  const forecastItem = `<div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
            <img
              src="assets/weather/${getWeatherIcon(id)}"
              class="forecast-item-img"
            />
            <h5 class="forecast-item-temp">${Math.round(temp)+ '°C'}</h5>
          </div>`;

          forecastItemscontainer.insertAdjacentHTML(`beforeend`, forecastItem )
}

// Section toggle logic
function ShowDisplaySection(sectionToShow) {
  [weatherInfoSection, searchCitySection, notFoundSection].forEach(
    (section) => {
      section.style.display = "none";
    }
  );
  sectionToShow.style.display = "flex";
}

// Show "Search Your City" screen by default
ShowDisplaySection(searchCitySection);
