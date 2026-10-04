import searchLocations from "./weather.js";
import { showSearchSuggestions } from "./ui.js";
import { getSearchValue, debouncer } from "./utils.js";
import Cloud9 from "./app.js";

const debouncedSearch = debouncer(async (searchQuery) => {
    const locations = await searchLocations(searchQuery);
    showSearchSuggestions(locations);
}, 300);

Cloud9.UI.locationSearch.addEventListener('input', async() => {
    const searchQuery = getSearchValue();

    if(searchQuery.length < 3) {
        return;
    }

    debouncedSearch(searchQuery);
});