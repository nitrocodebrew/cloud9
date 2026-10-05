import { searchLocations } from "./weather.js";
import { showSearchSuggestions, showLoadingPlaceholder, showSearchError } from "./ui.js";
import { getSearchValue, debouncer } from "./utils.js";
import Cloud9 from "./app.js";

let controller;

const debouncedSearch = debouncer(async (searchQuery) => {
    if(controller) {
        controller.abort();
    }
    controller = new AbortController();
    
    try {
        showLoadingPlaceholder();

        const locations = await searchLocations(searchQuery, controller.signal);
        showSearchSuggestions(locations);
    }
    catch(error) {
        if(error.name === 'AbortError') {
            return;
        }

        showSearchError();
        throw error;
    }

}, 300);

Cloud9.UI.locationSearch.addEventListener('input', async() => {
    const searchQuery = getSearchValue();

    if(searchQuery.length < 3) {
        return;
    }

    debouncedSearch(searchQuery);
});