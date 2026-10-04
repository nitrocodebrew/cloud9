import Cloud9 from "./app.js";

function getSearchValue() {
    return Cloud9.UI.locationSearch.value.trim();
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

export { getSearchValue, debouncer };