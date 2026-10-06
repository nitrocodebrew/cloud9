import Cloud9 from "./app.js";

function getSearchValue() {
    return Cloud9.UI.locationSearch.value.trim();
}

function getWindDirection(data) {
    const directions = [
        'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
        'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW',
    ];

    const index = Math.round(data / 22.5) % 16;
    return directions[index];
}

function debouncer(callback, delay) {
    let timeoutID;

    // Return a function
    return (...args) => {
        clearTimeout(timeoutID);

        timeoutID = setTimeout(() => {
            callback(...args);
        }, delay);
    };
}

function celsiusToFahrenheit(celsius) {
    return (celsius * 9 / 5) + 32;
}

function kmhToMph(kmh) {
    return kmh / 1.60934;
}

function kmToMiles(km) {
    return km / 1.60934;
}

function formatVisibility(meters, measurementSystem) {
    const kilometers = meters / 1000;

    if(measurementSystem === 'us') {
        return `${kmToMiles(kilometers).toFixed(1)} mi`;
    }

    return `${kilometers.toFixed(1)} km`;
}

function formatHour(time) {
    return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
    }).format(time);
}

function formatWeatherTime(time) {
    const [hours, minutes] = time.split('T')[1].split(':');

    const date = new Date();
    date.setHours(Number(hours), Number(minutes));

    return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
    }).format(date);
}

function formatTemperature(celsius, measurementSystem) {
    if(measurementSystem === 'us') {
        return `${Math.round(celsiusToFahrenheit(celsius))} °F`;
    }

    return `${Math.round(celsius)} °C`;
}

function formatWindSpeed(kmh, measurementSystem) {
    if(measurementSystem === 'us') {
        return `${Math.round(kmhToMph(kmh))} mph`;
    }

    return `${Math.round(kmh)} km/h`;
}



export { 
    getSearchValue, 
    getWindDirection, 
    debouncer, 
    formatHour,
    formatWeatherTime,
    formatTemperature,
    celsiusToFahrenheit,
    formatWindSpeed,
    kmhToMph,
    formatVisibility,
};