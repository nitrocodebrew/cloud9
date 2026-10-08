function $(selector, target = document) {
    return target.querySelector(selector);
}

const Cloud9 = {
    UI: {
        locationSearch: $('#location-search'),
        searchSuggestions: $('.search-suggestions'),
        preferencesButton: $('.preferences-button'),
        preferencesDialog: $('.preferences-dialog'),
        unitToggler: $('.unit-toggle'),
        timeToggler: $('.time-toggle'),
        weatherStatus: $('.weather-status'),
        weatherContainer: $('.weather-container'),
        locationName: $('.location-name'),
        defaultLocationBtn: $('.default-location-button'),
        currentTemp: $('.current-temp'),
        currentApparentTemp: $('.current-apparent-temp'),
        currentConditions: $('.current-conditions'),
        currentWind: $('.current-wind'),
        currentWindDirection: $('.current-wind-direction'),
        hourlyForecast: $('.hourly-forecast ul'),
        sunrise: $('.additional-sunrise'),
        sunset: $('.additional-sunset'),
        humidity: $('.additional-humidity'),
        visibility: $('.additional-visibility'),
    },
};

export default Cloud9;