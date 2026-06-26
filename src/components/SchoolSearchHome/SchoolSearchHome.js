import './SchoolSearchHome.css';
import { UIComponent } from "../../core/UIComponent.js";

export class SchoolSearchHome extends UIComponent {
  render() {
    return `
      <div class="school-search-home">
        <label for="schoolSearchHome">School name</label>
        <input id="schoolSearchHome" type="text" placeholder="e.g., DuPont Manual High School" />
        <div id="schoolSuggestionsContainer" class="school-suggestions">
          <div id="schoolSuggestionsList" class="school-suggestions-list" hidden></div>
        </div>
        <button id="schoolSearchHomeBtn" type="button">Search Nearby Homes</button>
      </div>
    `;
  }
}

export default SchoolSearchHome;
