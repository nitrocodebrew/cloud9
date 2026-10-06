import Cloud9 from "./app.js";
import { getWindDirection, formatHour, formatWeatherTime } from "./utils.js";
import { getWeatherDetails, parseHourlyWeather } from "./weather.js";
import weatherDescriptions from "./weatherDescriptions.js";

let weatherRequestID = 0;
let weatherController;

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
    Cloud9.UI.currentTemp.textContent = `${currentForecast.temperature_2m} ℃`;
    Cloud9.UI.currentApparentTemp.textContent = `${currentForecast.apparent_temperature} ℃`;
    Cloud9.UI.currentConditions.textContent = `${weatherDescriptions[currentForecast.weather_code]}`;
    Cloud9.UI.currentWind.textContent = `${currentForecast.wind_speed_10m}km/h`;
    Cloud9.UI.currentWindDirection.textContent = getWindDirection(currentForecast.wind_direction_10m);
}

function showAdditionalWeatherDetails(weather) {
    const { current, daily } = weather;

    Cloud9.UI.sunrise.textContent = formatWeatherTime(daily.sunrise[0]);
    Cloud9.UI.sunset.textContent = formatWeatherTime(daily.sunset[0]);
    Cloud9.UI.humidity.textContent = `${current.relative_humidity_2m}%`;
    Cloud9.UI.visibility.textContent = `${(current.visibility / 1000).toFixed(1)} km`;
} 

function showHourlyWeather(forecast) {
    Cloud9.UI.hourlyForecast.innerHTML = '';

    forecast.forEach(f => {
        const listItem = createHtmlElement('li', Cloud9.UI.hourlyForecast);
        
        createHtmlElement('span', listItem, {
            className: 'hourly-weather-time',
            textContent: formatHour(new Date(f.time)),
        });

        createHtmlElement('span', listItem, {
            className: 'hourly-temperature',
            textContent: `${f.temperature} ℃`,
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

function showSearchSuggestions(locations) {
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
            }
        );

        suggestion.addEventListener('click', async e => {
            const { latitude, longitude } = e.currentTarget.dataset;

            if(weatherController) {
                weatherController.abort();
            }

            weatherController = new AbortController();

            const requestId = ++weatherRequestID;

            try {
                const currentWeather = await getWeatherDetails(
                    latitude,
                    longitude,
                    weatherController.signal
                );

                // Ignore stale responses
                if(requestId !== weatherRequestID) {
                    return;
                }

                showCurrentWeatherDetails(currentWeather.current);

                const hourlyForecast = parseHourlyWeather(
                    currentWeather.hourly
                );

                showHourlyWeather(hourlyForecast.slice(0, 12));
                showAdditionalWeatherDetails(currentWeather);
            }
            catch(error) {
                if(error.name === 'AbortError') {
                    return;
                }
                throw error;
            }
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

