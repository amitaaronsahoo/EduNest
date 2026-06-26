import './SchoolDirectory.css';
import { UIComponent } from "../../core/UIComponent.js";

export class SchoolDirectory extends UIComponent {
  render() {
    return `
      <section class="school-directory">
        <div class="app-section__header">
          <h2>School Directory</h2>
          <p>Browse and search schools in Jefferson County</p>
        </div>
        <div id="schoolResults"></div>
        <div class="school-list">
          <div class="school-table-header">
            <div>School Name</div>
            <div>Address</div>
            <div>Type</div>
            <div>Grades</div>
            <div>Action</div>
          </div>
          <div id="schoolsTableBody"></div>
        </div>
      </section>
    `;
  }
}

export default SchoolDirectory;
