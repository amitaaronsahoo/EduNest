import { UIComponent } from "../../core/UIComponent.js";

export class SchoolDirectory extends UIComponent {
  render() {
    return `
      <section class="grid gap-4">
        <div class="app-section__header">
          <h2 class="text-lg font-semibold text-primary">School Directory</h2>
          <p class="text-sm text-text-light">Browse and search schools in Jefferson County</p>
        </div>

        <div id="schoolResults"></div>

        <div class="school-list">
          <div class="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-2.5 p-3.5 rounded-lg bg-bg-light-blue text-primary font-bold mb-2">
            <div>School Name</div>
            <div>Address</div>
            <div>Type</div>
            <div>Grades</div>
            <div>Action</div>
          </div>

          <div id="schoolsTableBody" class="flex flex-col gap-2"></div>
        </div>
      </section>
    `;
  }
}

export default SchoolDirectory;