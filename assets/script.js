// variables
let apiKey = "2b46a1544dbd4dd28d0b708131e2ad41";
// get local storage and put it in a variable as an array || []
let searchedCities = JSON.parse(localStorage.getItem("cityHistory")) || [];

// functions
// retrieve city name from lat/lon info
function handleCoords(searchCity) {
  const fetchUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${apiKey}`;
  // if successful, provied response. If error, show in console
  fetch(fetchUrl)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("There was a problem with the response");
      }
    })
    .then(function (data) {
      handleCurrentWeather(data.coord, data.name);
    })
    .catch((error) => {
      console.log(error);
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
      displayCurrentWeather(data.current, city);
      displayFiveDayForecast(data.daily);
    });
}

// generate searched city name, date, and weather icon
function displayCurrentWeather(currentCityData, cityName) {
  // retrieve weather icon
  let weatherIcon = `https://openweathermap.org/img/wn/${currentCityData.weather[0].icon}.png`;

  // display searched city name, date, weather icon, temp via innerHTML
  document.getElementById("currentWeather").innerHTML = `<div class="box is-size-4"><h2 class="has-text-weight-bold">Today in ${cityName} (${moment
    .unix(currentCityData.dt)
    .format("dddd MMM Do, YYYY")})</h2><div><img src="${weatherIcon}"><p>Forecast: ${currentCityData.weather[0].description}</p><div><div>Temperature: ${Math.round(
    currentCityData.temp
  )}&deg F</div><div>Humidity: ${currentCityData.humidity}%</div><div>Wind Speed: ${currentCityData.wind_speed} mph</div><div>UV Index: <span id="uvi" class="is-size-4">${
    currentCityData.uvi
  }</span></div></div>`;

  // dynamic UVI background: shows green if low, yellow if middling, red if high
  let uviCurrent = currentCityData.uvi;
  //
  if (uviCurrent <= 3.99) {
    document.getElementById("uvi").classList.add("has-background-success", "p-4", "tag");
  } else if (uviCurrent <= 7.99 && uviCurrent >= 4) {
    document.getElementById("uvi").classList.add("has-background-warning", "p-4", "tag");
  } else {
    document.getElementById("uvi").classList.add("has-background-danger", "p-4", "tag");
  }
}

// generates and displays searched city's 5-day forecast
function displayFiveDayForecast(fiveDayData) {
  // slice 8 day info to include only next 5 days
  const cityData = fiveDayData.slice(1, 6);
  // starts function as blank to prevent results buildup
  document.getElementById("fiveDayForecast").innerHTML = "";
  // loop through next 8 days
  cityData.forEach((day) => {
    // fetch weather icons for consecutive days
    let weatherIcon = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
    // display date, weather icon, temp, wind, humidity for five day forecast
    document.getElementById("fiveDayForecast").innerHTML += `<div class="box column has-background-info-dark has-text-white is-2 m-4"><div class="has-text-weight-bold has-text-centered">${moment
      .unix(day.dt)
      .format("dddd MMM Do")}</div><div class="has-text-centered"><img src="${weatherIcon}"></div><div class="pb-3">Forecast: ${
      day.weather[0].description
    }</div><div class="pb-3">Temperature: ${Math.round(day.temp.max)}&deg</div><div class="pb-3">Wind: ${day.wind_speed}mph</div><div>Humidity: ${day.humidity}%</div></div>`;
  });
  // remove hidden class from "5 Day Forecast" title
  document.getElementById("fiveDayTitle").classList.remove("is-hidden");
}

// functionality for city search bar
function handleSearchSubmit(event) {
  // start function blank
  document.getElementById("searchHistory").innerHTML = "";
  event.preventDefault();
  // Grab city name from user input in search field
  const cityName = document.getElementById("searchInput").value.trim();

  // convert all city searches to lower case format
  searchedCities.push(cityName.toLowerCase());
  // filter prev searched cities to eliminate repeats
  if (!searchedCities.includes(cityName)) {
    // push it into the array
  }
  // filter cities to exclude repeat searches
  const filteredSearchedCities = searchedCities.filter((city, index) => {
    return searchedCities.indexOf(city) === index;
  });
  // save searchedCities array back to local storage
  localStorage.setItem("cityHistory", JSON.stringify(filteredSearchedCities));

  // calls function to show search history buttons
  showSearchButtons(filteredSearchedCities);
  // calls function to retrieve city name from lat/lon info
  handleCoords(cityName);
}

function showSearchButtons(cities) {
  // generates button for each previously searched city name
  // onclick, button calls handleCoords function, plugging in prev searched city name for api call
  cities.forEach((city) => {
    document.getElementById(
      "searchHistory"
    ).innerHTML += `<button class="button has-text-weight-semibold is-link is-light is-child is-uppercase m-3 tile js-searchHistoryBtn" onclick="handleCoords('${city}')" data-city=${city}>${city}</button>`;
  });
}

// generates previously searched city name
function handleSearchHistory(event) {
  event.preventDefault();
  // retrieve city name from search input
  const cityName = this.getAttribute("data-city");
  // calls function to retrieve city name from lat/lon info
  handleCoords(cityName);
}

// clear local storage and delete search history buttons
function clearSearchHistory() {
  localStorage.clear();
  document.getElementById("searchHistory").innerHTML = "";
  searchedCities = [];
}

// listeners and calls
// show local storage buttons
showSearchButtons(searchedCities);
// search for city
document.getElementById("searchForm").addEventListener("submit", handleSearchSubmit);
// click button to clear search history
document.getElementById("clearSearchBtn").addEventListener("click", clearSearchHistory);
