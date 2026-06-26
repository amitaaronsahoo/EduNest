import './HomeFilter.css';
import { UIComponent } from "../../core/UIComponent.js";
import { currency } from "../../utils/formatters.js";

export class HomeFilter extends UIComponent {
  render() {
    return `
      <div class="home-filter">
        <h2>Find Homes Near School</h2>
        <label for="schoolSearchHome">School name</label>
        <input id="schoolSearchHome" type="text" placeholder="e.g., DuPont Manual High School" />
        <div id="schoolSuggestionsContainer" class="school-suggestions">
          <div id="schoolSuggestionsList" class="school-suggestions-list" hidden></div>
        </div>
        <button id="schoolSearchHomeBtn" type="button">Search Nearby Homes</button>
        <h3>Filter Homes</h3>
        <label for="minBedrooms">Minimum bedrooms</label>
        <select id="minBedrooms">
          <option value="0">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>
        <label for="minBathrooms">Minimum bathrooms</label>
        <select id="minBathrooms">
          <option value="0">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
        </select>
        <label for="maxPriceHome">Max Price: <span id="maxPriceValue">${currency(300000).replace("$", "")}</span></label>
        <input id="maxPriceHome" type="range" min="50000" max="1000000" step="10000" value="300000" />
        <button id="applyFiltersHomeBtn" type="button">Apply Filters</button>
        <div id="homeResults" class="sidebar__status"></div>
      </div>
    `;
  }
}

export default HomeFilter;
