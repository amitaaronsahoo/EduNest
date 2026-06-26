import './SchoolSearch.css';
import { UIComponent } from "../../core/UIComponent.js";

export class SchoolSearch extends UIComponent {
  render() {
    return `
      <div class="school-search">
        <label for="schoolSearch">School name</label>
        <input id="schoolSearch" type="text" placeholder="e.g., DuPont Manual" />
        <button id="schoolSearchBtn" type="button">Search Schools</button>
      </div>
    `;
  }
}

export default SchoolSearch;
