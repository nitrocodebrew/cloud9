import {
    searchLocations,
    getWeatherDetails,
    parseHourlyWeather
} from "./weather.js";

import {
    showSearchSuggestions,
    showLoadingPlaceholder,
    showSearchError,
    showCurrentWeatherDetails,
    showAdditionalWeatherDetails,
    showHourlyWeather,
    showWeatherLoading,
    showWeatherError,
    clearWeatherStatus
} from "./ui.js";

import {
    getSearchValue,
    debouncer
} from "./utils.js";

import Cloud9 from "./app.js";

let controller;
let weatherController;
let weatherRequestID = 0;

let currentWeather;

let measurementSystem =
    localStorage.getItem('measurementSystem') ?? 'metric';

function renderWeather() {
    if(!currentWeather) {
        return;
    }

    showCurrentWeatherDetails(currentWeather.current, measurementSystem);

    const hourlyForecast = parseHourlyWeather(currentWeather.hourly);
    showHourlyWeather(hourlyForecast.slice(0, 12), measurementSystem);
    showAdditionalWeatherDetails(currentWeather, measurementSystem);
}

async function handleLocationSelect(latitude, longitude) {
    if(weatherController) {
        weatherController.abort();
    }

    weatherController = new AbortController();

    const requestId = ++weatherRequestID;

    try {
        showWeatherLoading();

        currentWeather = await getWeatherDetails(latitude, longitude, weatherController.signal);

        // Ignore stale responses
        if(requestId !== weatherRequestID) {
            return;
        }

        renderWeather();

        clearWeatherStatus();
    }
    catch(error) {
        if(error.name === 'AbortError') {
            return;
        }

        showWeatherError();
    }
}

const debouncedSearch = debouncer(async (searchQuery) => {
    if(controller) {
        controller.abort();
    }

    controller = new AbortController();

    try {
        showLoadingPlaceholder();

        const locations = await searchLocations(searchQuery, controller.signal);
        showSearchSuggestions(locations, handleLocationSelect);
    }
    catch(error) {
        if(error.name === 'AbortError') {
            return;
        }

        showSearchError();
    }
}, 300);

Cloud9.UI.locationSearch.addEventListener('input', async() => {
    const searchQuery = getSearchValue();

    if(searchQuery.length < 3) {
        return;
    }

    debouncedSearch(searchQuery);
});

Cloud9.UI.unitToggler.addEventListener('click', e => {
    const toggleCelsius = e.target.closest('.use-celsius');
    const toggleFahrenheit = e.target.closest('.use-fahrenheit');

    if(toggleCelsius) {
        measurementSystem = 'metric';
    }
    else if(toggleFahrenheit) {
        measurementSystem = 'us';
    }

    localStorage.setItem('measurementSystem', measurementSystem);
    renderWeather();
});