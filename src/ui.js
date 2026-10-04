import Cloud9 from "./app.js";

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

function showSearchSuggestions(locations) {
    Cloud9.UI.searchSuggestions.innerHTML = '';

    if(locations.length === 0) {
        Cloud9.UI.searchSuggestions.textContent = 'No locations found.';
        return;
    }

    locations.forEach((loc) => {
        createHtmlElement('button', Cloud9.UI.searchSuggestions, {
            type: 'button',
            className: 'location-suggestion',
            textContent: `${loc.name}, ${loc.admin1}, ${loc.country}`,
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
    showSearchError
};

