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

export default searchLocations;