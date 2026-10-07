import Cloud9 from "./app.js";
import { 
    getWindDirection, 
    formatHour, 
    formatWeatherTime,
    celsiusToFahrenheit,
    formatWindSpeed,
    kmhToMph,
    formatTemperature,
    formatVisibility,

} from "./utils.js";
import { getWeatherDetails, parseHourlyWeather } from "./weather.js";
import weatherDescriptions from "./weatherDescriptions.js";

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

function showCurrentWeatherDetails(currentForecast, measurementSystem) {
    Cloud9.UI.currentTemp.textContent = formatTemperature(currentForecast.temperature_2m, measurementSystem);
    Cloud9.UI.currentApparentTemp.textContent = formatTemperature(currentForecast.apparent_temperature, measurementSystem);
    Cloud9.UI.currentConditions.textContent = weatherDescriptions[currentForecast.weather_code];
    Cloud9.UI.currentWind.textContent = formatWindSpeed(currentForecast.wind_speed_10m, measurementSystem);
    Cloud9.UI.currentWindDirection.textContent = getWindDirection(currentForecast.wind_direction_10m);
}


function showAdditionalWeatherDetails(weather, measurementSystem, timeFormat) {
    const { current, daily } = weather;

    Cloud9.UI.sunrise.textContent = formatWeatherTime(daily.sunrise[0], timeFormat);
    Cloud9.UI.sunset.textContent = formatWeatherTime(daily.sunset[0], timeFormat);
    Cloud9.UI.humidity.textContent = `${current.relative_humidity_2m}%`;
    Cloud9.UI.visibility.textContent = formatVisibility(current.visibility, measurementSystem);
} 

function showHourlyWeather(forecast, measurementSystem, timeFormat) {
    Cloud9.UI.hourlyForecast.innerHTML = '';

    forecast.forEach(f => {
        const listItem = createHtmlElement('li', Cloud9.UI.hourlyForecast);
        
        createHtmlElement('span', listItem, {
            className: 'hourly-weather-time',
            textContent: formatHour(new Date(f.time), timeFormat),
        });

        createHtmlElement('span', listItem, {
            className: 'hourly-temperature',
            textContent: formatTemperature(f.temperature, measurementSystem),
        });

        createHtmlElement('span', listItem, {
            className: 'hourly-conditions',
            textContent: `${weatherDescriptions[f.weatherCode]}`
        });

        createHtmlElement('small', listItem, {
            className: 'hourly-precipitation-probability',
            textContent: `${f.precipitationProbability}%`,
        });
    })
}

function showSearchSuggestions(locations, onLocationSelect) {
    Cloud9.UI.searchSuggestions.innerHTML = '';

    if(locations.length === 0) {
        Cloud9.UI.searchSuggestions.textContent = 'No locations found.';
        return;
    }

    locations.forEach((loc) => {
        const locationName = loc.admin1
            ? `${loc.name}, ${loc.admin1}, ${loc.country}`
            : `${loc.name}, ${loc.country}`;

        const suggestion = createHtmlElement(
            'button',
            Cloud9.UI.searchSuggestions,
            {
                type: 'button',
                className: 'location-suggestion',
                textContent: locationName,
                'data-latitude': loc.latitude,
                'data-longitude': loc.longitude,
                'data-location-name': loc.name,
            }
        );

        suggestion.addEventListener('click', e => {
            const { latitude, longitude, locationName } = e.currentTarget.dataset;

            onLocationSelect(latitude, longitude, locationName);
        });

    });
}


function showLoadingPlaceholder() {
    Cloud9.UI.searchSuggestions.textContent = 'Loading...';
}

function showSearchError() {
    Cloud9.UI.searchSuggestions.textContent = 'Unable to search locations. Please try again.';
}

function showWeatherLoading() {
    Cloud9.UI.weatherStatus.textContent = 'Loading weather...';
}

function showWeatherError() {
    Cloud9.UI.weatherStatus.textContent = 'Unable to load weather. Please try again.';
}

function clearWeatherStatus() {
    Cloud9.UI.weatherStatus.textContent = '';
}

export { 
    $, 
    createHtmlElement, 
    showSearchSuggestions, 
    showLoadingPlaceholder, 
    showSearchError,
    showCurrentWeatherDetails,
    showHourlyWeather,
    showAdditionalWeatherDetails,
    showWeatherLoading,
    showWeatherError,
    clearWeatherStatus,
};

