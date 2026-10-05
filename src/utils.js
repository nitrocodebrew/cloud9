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

function formatHour(time) {
    return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
    }).format(time);
}

export { 
    getSearchValue, 
    getWindDirection, 
    debouncer, 
    formatHour 
};