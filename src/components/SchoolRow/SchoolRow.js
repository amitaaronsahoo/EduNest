import './SchoolRow.css';
import { UIComponent } from "../../core/UIComponent.js";

export class SchoolRow extends UIComponent {
  render() {
    const school = this.props.school || {};
    const checked = this.props.checked ? "checked" : "";

    return `
      <div class="school-row" data-school-id="${school.id ?? ""}">
        <div class="school-row__name">${school.name || "Unknown School"}</div>
        <div class="school-row__address">${school.formattedAddress || ""}</div>
        <div class="school-row__tag"><span>${school.level || "N/A"}</span></div>
        <div class="school-row__tag"><span>${school.type || "N/A"}</span></div>
        <div class="school-row__action">
          <input id="school-${school.id ?? ""}" type="checkbox" data-action="toggle-school" data-school-id="${school.id ?? ""}" ${checked} />
          <label for="school-${school.id ?? ""}">Select</label>
        </div>
      </div>
    `;
  }

  onMounted() {
    this.addDelegatedListener("click", '[data-action="toggle-school"]', event => {
      event.stopPropagation();
      this.props.onToggle?.(this.props.school);
    });

    this.addEventListener("click", () => {
      this.props.onSelect?.(this.props.school);
    });
  }
}

export default SchoolRow;
