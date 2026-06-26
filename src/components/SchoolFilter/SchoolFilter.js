import { UIComponent } from "../../core/UIComponent.js";
import { currency } from "../../utils/formatters.js";

export class SchoolFilter extends UIComponent {
  render() {
    const maxTuition = this.props.maxTuition ?? 5000;
    return `
      <div class="school-filter">
        <h2>Find Schools</h2>
        <label for="schoolSearch">School name</label>
        <input id="schoolSearch" type="text" placeholder="e.g., DuPont Manual" />
        <button id="schoolSearchBtn" type="button">Search Schools</button>
        <button id="allSchoolBtn" type="button">Search Homes for all selected schools</button>
        <h3>Filter Schools</h3>
        <div class="filter-group">
          <label><input type="checkbox" name="schoolType" value="JCPS"> Public</label>
          <label><input type="checkbox" name="schoolType" value="Private"> Private</label>
          <label><input type="checkbox" name="schoolType" value="Parochial School"> Catholic</label>
        </div>
        <div class="filter-group">
          <label><input type="checkbox" name="gradeLevel" value="Elementary"> Elementary</label>
          <label><input type="checkbox" name="gradeLevel" value="Middle"> Middle</label>
          <label><input type="checkbox" name="gradeLevel" value="High"> High</label>
        </div>
        <label for="maxTuition">Max Tuition: $<span id="maxTuitionValue">${currency(maxTuition).replace("$", "")}</span></label>
        <input id="maxTuition" type="range" min="0" max="50000" step="1000" value="${maxTuition}" />
        <button id="applyFiltersBtn" type="button">Apply Filters</button>
      </div>
    `;
  }
}

export default SchoolFilter;
