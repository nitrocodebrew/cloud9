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
import Storage from "./storage.js";

let controller;
let weatherController;
let weatherRequestID = 0;
let currentWeather;
let currentLocation;

const DEFAULT_LOCATION_KEY = 'defaultLocation';
const storage = new Storage();
let measurementSystem = storage.get('measurementSystem') ?? 'metric';
let timeFormat = storage.get('timeFormat') ?? '24'; 

updateToggleState(Cloud9.UI.unitToggler, measurementSystem, 'unit');
updateToggleState(Cloud9.UI.timeToggler, timeFormat, 'timeFormat');


function updateToggleState(toggle, active, dataAttr) {
    const buttons = toggle.querySelectorAll('button');

    buttons.forEach(button => {
        button.classList.toggle('active', button.dataset[dataAttr] === active);
    });
}

function renderWeather() {
    if(!currentWeather) {
        return;
    }

    showCurrentWeatherDetails(currentWeather.current, measurementSystem);

    const hourlyForecast = parseHourlyWeather(currentWeather.hourly, currentWeather.current.time);
    showHourlyWeather(hourlyForecast.slice(0, 12), measurementSystem, timeFormat);
    showAdditionalWeatherDetails(currentWeather, measurementSystem, timeFormat);
}

async function handleLocationSelect(location) {
    const { latitude, longitude, name } = location;

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

        currentLocation = location;

        Cloud9.UI.weatherContainer.hidden = false;
        Cloud9.UI.searchSuggestions.hidden = true;
        Cloud9.UI.locationName.textContent = name;

        updateDefaultLocationButton(location);
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

function getDefaultLocation() {
    const savedLocation = storage.get(DEFAULT_LOCATION_KEY);

    if(!savedLocation) {
        return null;
    }

    try {
        return JSON.parse(savedLocation);
    }
    catch {
        storage.remove(DEFAULT_LOCATION_KEY);
        return null;
    }
}

function updateDefaultLocationButton(location) {
    const defaultLocation = getDefaultLocation();

    const isDefault = defaultLocation && Number(defaultLocation.latitude) === Number(location.latitude) && Number(defaultLocation.longitude) === Number(location.longitude);

    Cloud9.UI.defaultLocationBtn.hidden = false;

    if(isDefault) {
        Cloud9.UI.defaultLocationBtn.textContent = '★ Default Location';
        Cloud9.UI.defaultLocationBtn.disabled = true;
    }
    else {
        Cloud9.UI.defaultLocationBtn.textContent = '☆ Set as Default Location';
        Cloud9.UI.defaultLocationBtn.disabled = false;
    }
}

function setDefaultLocation(location) {
    const saved = storage.set(DEFAULT_LOCATION_KEY, JSON.stringify({
        name: location.name,
        admin1: location.admin1,
        country: location.country,
        latitude: location.latitude,
        longitude: location.longitude,
    }));

    if(saved) {
        updateDefaultLocationButton(location);
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

    Cloud9.UI.searchSuggestions.hidden = false;

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

    storage.set('measurementSystem', measurementSystem);
    updateToggleState(Cloud9.UI.unitToggler, measurementSystem, 'unit');
    renderWeather();
});

Cloud9.UI.timeToggler.addEventListener('click', e => {
    const toggle24 = e.target.closest('.use-24');
    const toggle12 = e.target.closest('.use-12');

    if(toggle24) {
        timeFormat = '24';
    }
    else if(toggle12) {
        timeFormat = '12';
    }

    storage.set('timeFormat', timeFormat);
    updateToggleState(Cloud9.UI.timeToggler, timeFormat, 'timeFormat');
    renderWeather();
});

Cloud9.UI.defaultLocationBtn.addEventListener('click', () => {
    if(!currentLocation) {
        return;
    }

    setDefaultLocation(currentLocation);
});

const defaultLocation = getDefaultLocation();

if(defaultLocation) {
    handleLocationSelect(defaultLocation);
}

Cloud9.UI.preferencesButton.addEventListener('click', () => {
    Cloud9.UI.preferencesDialog.showModal();
});

Cloud9.UI.preferencesDialog.addEventListener('click', e => {
    if(e.target === Cloud9.UI.preferencesDialog) {
        Cloud9.UI.preferencesDialog.close();
    }
});

Cloud9.UI.locationSearchForm.addEventListener('submit', e => e.preventDefault());