// variables
let apiKey = "2b46a1544dbd4dd28d0b708131e2ad41";
// functions
// retrieve city name from lat/lon info
function handleCoords(searchCity) {
  const fetchUrl = `http://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${apiKey}`;

  fetch(fetchUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      handleCurrentWeather(data.coord, data.name);
    });
}

// retrieve weather app data (city)
function handleCurrentWeather(coordinates, city) {
  const lat = coordinates.lat;
  const lon = coordinates.lon;
  const fetchUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=imperial&appid=${apiKey}`;

  fetch(fetchUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      displayCurrentWeather(data.current, city);
      displayFiveDayForecast(data.daily);
    });
}

// generate searched city name, date, and weather icon
function displayCurrentWeather(currentCityData, cityName) {
  // retrieve weather icon
  let weatherIcon = `http://openweathermap.org/img/wn/${currentCityData.weather[0].icon}.png`;
  // TODO: add humidity, wind, UV Index info
  // TODO: create dynamic background for UV index by adding class based on value (low = green background, high = orange background)
  // display searched city name, date, weather icon, temp
  document.getElementById("currentWeather").innerHTML = `<h2>${cityName} ${moment.unix(currentCityData.dt).format("dddd MMM Do, YYYY")} <img src="${weatherIcon}"></h2> <div>Temp: ${
    currentCityData.temp
  }&deg F</div>`;
}

function displayFiveDayForecast(fiveDayData) {
  const cityData = fiveDayData.slice(1, 6);
  document.getElementById("fiveDayForecast").innerHTML = "";
  // loop through next 8 days
  cityData.forEach((day) => {
    let weatherIcon = `http://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
    // TODO: add temp, wind, humidity - don't forget unit symbols (deg, %, etc)
    // display date, weather icon,
    document.getElementById("fiveDayForecast").innerHTML += `<div><div>${moment.unix(day.dt).format("dddd MMM Do")}</div><div><img src="${weatherIcon}"></div></div>`;
  });
}

function handleSearchSubmit(event) {
  const cityName = document.getElementById("searchInput").value.trim();
  document.getElementById("searchHistory").innerHTML += `<button class="js-searchHistory" data-city=${cityName}>${cityName}</button>`;
  event.preventDefault();
  handleCoords(cityName);
}

function handleSearchHistory(event) {
  event.preventDefault();
  const cityName = this.getAttribute("data-city");
  handleCoords(cityName);
}

// listeners
// search for city
document.getElementById("searchForm").addEventListener("submit", handleSearchSubmit);
// on page load, show any past cities searched
document.querySelector("#searchHistory").addEventListener("click", handleSearchHistory);
// click on city to show weather
// call functions
