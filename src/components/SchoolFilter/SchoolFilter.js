import { UIComponent } from "../../core/UIComponent.js";
import { currency } from "../../utils/formatters.js";

export class SchoolFilter extends UIComponent {
  render() {
    const maxTuition = this.props.maxTuition ?? 5000;
    return `
      <div class="grid gap-3">
        <h2 class="text-lg font-semibold text-primary">Find Schools</h2>

        <label for="schoolSearch" class="text-sm text-text-light">School name</label>
        <input id="schoolSearch" type="text" placeholder="e.g., DuPont Manual" class="text-sm border border-border-light rounded-md px-3 py-2"/>

        <div class="flex gap-2">
          <button id="schoolSearchBtn" type="button" class="bg-primary text-white rounded-md px-3 py-2">Search Schools</button>
          <button id="allSchoolBtn" type="button" class="bg-primary text-white rounded-md px-3 py-2">Search Homes for all selected schools</button>
        </div>

        <h3 class="text-base font-medium text-primary">Filter Schools</h3>

        <div class="p-3 rounded-lg bg-bg-light-blue border border-border-light">
          <label class="flex items-center gap-2 text-sm text-text-light"><input type="checkbox" name="schoolType" value="JCPS" class="w-4 h-4 accent-primary"/> Public</label>
          <label class="flex items-center gap-2 text-sm text-text-light"><input type="checkbox" name="schoolType" value="Private" class="w-4 h-4 accent-primary"/> Private</label>
          <label class="flex items-center gap-2 text-sm text-text-light"><input type="checkbox" name="schoolType" value="Parochial School" class="w-4 h-4 accent-primary"/> Catholic</label>
        </div>

        <div class="p-3 rounded-lg bg-bg-light-blue border border-border-light">
          <label class="flex items-center gap-2 text-sm text-text-light"><input type="checkbox" name="gradeLevel" value="Elementary" class="w-4 h-4 accent-primary"/> Elementary</label>
          <label class="flex items-center gap-2 text-sm text-text-light"><input type="checkbox" name="gradeLevel" value="Middle" class="w-4 h-4 accent-primary"/> Middle</label>
          <label class="flex items-center gap-2 text-sm text-text-light"><input type="checkbox" name="gradeLevel" value="High" class="w-4 h-4 accent-primary"/> High</label>
        </div>

        <label for="maxTuition" class="text-sm text-text-light">Max Tuition: $<span id="maxTuitionValue">${currency(maxTuition).replace("$", "")}</span></label>
        <input id="maxTuition" type="range" min="0" max="50000" step="1000" value="${maxTuition}" class="w-full"/>

        <button id="applyFiltersBtn" type="button" class="bg-primary text-white rounded-md px-3 py-2">Apply Filters</button>
      </div>
    `;
  }
}

export default SchoolFilter;