import { UIComponent } from "../../core/UIComponent.js";
import { currency } from "../../utils/formatters.js";

export class HomeFilter extends UIComponent {
  render() {
    return `
      <div class="grid gap-3">
        <h2 class="text-lg font-semibold text-primary">Find Homes Near School</h2>

        <label for="schoolSearchHome" class="text-sm text-text-light">School name</label>
        <input id="schoolSearchHome" type="text" placeholder="e.g., DuPont Manual High School" class="w-full border border-border-light rounded-md px-3 py-2 text-sm"/>

        <div id="schoolSuggestionsContainer" class="school-suggestions">
          <div id="schoolSuggestionsList" class="school-suggestions-list" hidden></div>
        </div>

        <button id="schoolSearchHomeBtn" type="button" class="bg-primary text-white rounded-md px-3 py-2">Search Nearby Homes</button>

        <h3 class="text-base font-medium text-primary">Filter Homes</h3>

        <label for="minBedrooms" class="text-sm text-text-light">Minimum bedrooms</label>
        <select id="minBedrooms" class="w-full border border-border-light rounded-md px-3 py-2 text-sm">
          <option value="0">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>

        <label for="minBathrooms" class="text-sm text-text-light">Minimum bathrooms</label>
        <select id="minBathrooms" class="w-full border border-border-light rounded-md px-3 py-2 text-sm">
          <option value="0">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
        </select>

        <label for="maxPriceHome" class="text-sm text-text-light">Max Price: <span id="maxPriceValue">${currency(300000).replace("$", "")}</span></label>
        <input id="maxPriceHome" type="range" min="50000" max="1000000" step="10000" value="300000" class="w-full"/>

        <button id="applyFiltersHomeBtn" type="button" class="bg-primary text-white rounded-md px-3 py-2">Apply Filters</button>

        <div id="homeResults" class="text-text-muted"></div>
      </div>
    `;
  }
}

export default HomeFilter;