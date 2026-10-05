async function searchLocations(query, signal) {
    const url = new URL(
        `https://geocoding-api.open-meteo.com/v1/search`
    );

    url.searchParams.set('name', query);
    url.searchParams.set('count', '10');
    url.searchParams.set('language', 'en');
    url.searchParams.set('format', 'json');

    const response = await fetch(url, { 
        signal 
    });

    if(!response.ok) {
        throw new Error(`Unable to search locations: ${response.statusText}`);
    }

    const data = await response.json();

    return data.results ?? [];
}

async function getWeatherDetails(latitude, longitude) {
    const url = new URL(
        `https://api.open-meteo.com/v1/forecast`
    );

    url.searchParams.set('current', 'temperature_2m,apparent_temperature,weather_code,wind_speed_10m');
    url.searchParams.set('latitude', latitude);
    url.searchParams.set('longitude', longitude);

    const response = await fetch(url);

    if(!response.ok) {
        throw new Error(`Unable to fetch weather details: ${response.statusText}`);
    }

    const data = await response.json();
    
    return data;
}

export { searchLocations, getWeatherDetails };