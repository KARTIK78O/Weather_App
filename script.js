const cityinput = document.querySelector(".city-input");
const searchbtn = document.querySelector(".search-btn");
const weatherInfoSection = document.querySelector(".weather-info");
const notFoundSection = document.querySelector(".not-found");
const searchCitySection = document.querySelector(".search-city");
const apikey = "3d2220581faf14228137343a6ea039b7";

searchbtn.addEventListener("click", () => {
  if (cityinput.value.trim() != "") {
    updateWeatherInfo(cityinput.value);
    cityinput.value = "";
    cityinput.blur();
  }
});

cityinput.addEventListener("keydown", (event) => {
  if (event.key == "Enter" && cityinput.value.trim() != '') {
    updateWeatherInfo(cityinput.value);
    cityinput.value = "";
    cityinput.blur();
  }
});

async function getFetchData(endPoint, city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apikey}&units=metric`;
  const response = await fetch(apiUrl);
  return response.json();
}

async function updateWeatherInfo(city) {
  const weatherData = await getFetchData("weather", city);

  if (weatherData.cod != 200) {
    ShowDisplaySection(notFoundSection);
    return;
  }

  console.log(weatherData);
  
  ShowDisplaySection(weatherInfoSection)
}

function ShowDisplaySection(section) {
  [weatherInfoSection, searchCitySection, notFoundSection]
  .forEach(secton => section.style.dislay = 'none'

  )
  section.style.dislay = 'flex'
}
