import './SchoolSearch.css';
import { UIComponent } from "../../core/UIComponent.js";

export class SchoolSearch extends UIComponent {
  render() {
    return `
      <div class="school-search">
        <label for="schoolSearch">School name</label>
        <input id="schoolSearch" type="text" placeholder="e.g., DuPont Manual" />
        <div id="schoolSearchSuggestionsContainer" class="school-search__suggestions">
          <div id="schoolSearchSuggestionsList" class="school-suggestions-list" hidden></div>
        </div>
        <button id="schoolSearchBtn" type="button">Search Schools</button>
      </div>
    `;
  }
}

export default SchoolSearch;
