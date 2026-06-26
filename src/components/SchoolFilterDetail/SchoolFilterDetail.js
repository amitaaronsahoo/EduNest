import './SchoolFilterDetail.css';
import { UIComponent } from "../../core/UIComponent.js";

export class SchoolFilterDetail extends UIComponent {
  render() {
    return `
      <div class="school-filter-detail">
        <h3>Filter Nearby Schools</h3>
        <div class="filter-group">
          <label><input type="checkbox" name="houseSchoolType" value="JCPS"> Public</label>
          <label><input type="checkbox" name="houseSchoolType" value="Private"> Private</label>
          <label><input type="checkbox" name="houseSchoolType" value="Parochial School"> Catholic</label>
        </div>
        <div class="filter-group">
          <label><input type="checkbox" name="houseGradeLevel" value="Elementary"> Elementary</label>
          <label><input type="checkbox" name="houseGradeLevel" value="Middle"> Middle</label>
          <label><input type="checkbox" name="houseGradeLevel" value="High"> High</label>
        </div>
        <label for="houseMaxTuition">Max Tuition: $<span id="houseMaxTuitionValue">5000</span></label>
        <input id="houseMaxTuition" type="range" min="0" max="50000" step="1000" value="5000" />
        <button id="houseApplySchoolFiltersBtn" type="button">Apply School Filters</button>
      </div>
    `;
  }
}

export default SchoolFilterDetail;
