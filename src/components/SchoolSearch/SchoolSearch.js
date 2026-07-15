import { UIComponent } from "../../core/UIComponent.js";

export class SchoolSearch extends UIComponent {
  render() {
    return `
      <div class="grid gap-3">
        <label for="schoolSearch" class="text-sm text-text-light">School name</label>
        <input id="schoolSearch" type="text" placeholder="e.g., DuPont Manual" class="w-full border border-border-light rounded-md px-3 py-2 text-sm" />

        <div id="schoolSearchSuggestionsContainer" class="bg-bg-white border border-border-light rounded-md shadow-sm overflow-hidden">
          <div id="schoolSearchSuggestionsList" class="school-suggestions-list" hidden></div>
        </div>

        <button id="schoolSearchBtn" type="button" class="bg-primary text-white rounded-md px-4 py-2 font-bold">Search Schools</button>
      </div>
    `;
  }
}

export default SchoolSearch;
