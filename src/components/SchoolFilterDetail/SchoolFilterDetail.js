import { UIComponent } from "../../core/UIComponent.js";

export class SchoolFilterDetail extends UIComponent {
  render() {
    return `
      <div class="grid gap-3">
        <h3 class="text-base font-medium text-primary">Filter Nearby Schools</h3>

        <div class="p-3 rounded-lg bg-bg-light-blue border border-border-light flex flex-wrap gap-2">
          <label class="inline-flex items-center gap-2 text-sm text-text-light">
            <input type="checkbox" name="houseSchoolType" value="JCPS" class="w-4 h-4 accent-primary" /> Public
          </label>
          <label class="inline-flex items-center gap-2 text-sm text-text-light">
            <input type="checkbox" name="houseSchoolType" value="Private" class="w-4 h-4 accent-primary" /> Private
          </label>
          <label class="inline-flex items-center gap-2 text-sm text-text-light">
            <input type="checkbox" name="houseSchoolType" value="Parochial School" class="w-4 h-4 accent-primary" /> Catholic
          </label>
        </div>

        <div class="p-3 rounded-lg bg-bg-light-blue border border-border-light flex flex-wrap gap-2">
          <label class="inline-flex items-center gap-2 text-sm text-text-light">
            <input type="checkbox" name="houseGradeLevel" value="Elementary" class="w-4 h-4 accent-primary" /> Elementary
          </label>
          <label class="inline-flex items-center gap-2 text-sm text-text-light">
            <input type="checkbox" name="houseGradeLevel" value="Middle" class="w-4 h-4 accent-primary" /> Middle
          </label>
          <label class="inline-flex items-center gap-2 text-sm text-text-light">
            <input type="checkbox" name="houseGradeLevel" value="High" class="w-4 h-4 accent-primary" /> High
          </label>
        </div>

        <label for="houseMaxTuition" class="text-sm text-text-light">Max Tuition: $<span id="houseMaxTuitionValue">5000</span></label>
        <input id="houseMaxTuition" type="range" min="0" max="50000" step="1000" value="5000" class="w-full" />

        <button id="houseApplySchoolFiltersBtn" type="button" class="bg-primary text-white rounded-md px-3 py-2">Apply School Filters</button>
      </div>
    `;
  }
}

export default SchoolFilterDetail;