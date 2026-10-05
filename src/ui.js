import Cloud9 from "./app.js";
import { getWeatherDetails } from "./weather.js";

function $(selector, target = document) {
    return target.querySelector(selector);
}

function createHtmlElement(tag, parentElement, attrs = {}) {
    const htmlElement = document.createElement(tag);

    for(const [key, value] of Object.entries(attrs)) {
        if(key in htmlElement) {
            htmlElement[key] = value;
        }
        else {
            htmlElement.setAttribute(key, value);
        }
    }

    return parentElement.appendChild(htmlElement);
}

function showCurrentWeatherDetails(currentForecast) {
    Cloud9.UI.currentTemp.textContent = `${currentForecast.temperature_2m}℃`;
    Cloud9.UI.currentApparentTemp.textContent = `${currentForecast.apparent_temperature}℃`;
    Cloud9.UI.currentWind.textContent = `${currentForecast.wind_speed_10m}km/h`;
}

function showSearchSuggestions(locations) {
    Cloud9.UI.searchSuggestions.innerHTML = '';

    if(locations.length === 0) {
        Cloud9.UI.searchSuggestions.textContent = 'No locations found.';
        return;
    }

    locations.forEach((loc) => {
        const suggestion = createHtmlElement('button', Cloud9.UI.searchSuggestions, {
            type: 'button',
            className: 'location-suggestion',
            textContent: `${loc.name}, ${loc.admin1}, ${loc.country}`,
            'data-latitude': loc.latitude,
            'data-longitude': loc.longitude,
        });

        suggestion.addEventListener('click', async e => {
            const { latitude, longitude } = e.currentTarget.dataset;

            const currentWeather = await getWeatherDetails(latitude, longitude);
            showCurrentWeatherDetails(currentWeather.current);
            console.log(currentWeather.current);
        });
    });
}

function showLoadingPlaceholder() {
    Cloud9.UI.searchSuggestions.textContent = 'Loading...';
}

function showSearchError() {
    Cloud9.UI.searchSuggestions.textContent = 'Unable to search locations. Please try again.';
}



export { 
    $, 
    createHtmlElement, 
    showSearchSuggestions, 
    showLoadingPlaceholder, 
    showSearchError,
    showCurrentWeatherDetails,
};

