import { UIComponent } from "../../core/UIComponent.js";

export class SchoolRow extends UIComponent {
  render() {
    const school = this.props.school || {};
    const checked = this.props.checked ? "checked" : "";

    return `
      <div
        class="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-2.5 items-center px-3.5 py-3 mb-2 border border-border-light rounded-lg bg-bg-white shadow-md hover:border-primary cursor-pointer"
        data-school-id="${school.id ?? ""}"
      >
        <div class="text-base font-medium text-primary">${school.name || "Unknown School"}</div>
        <div class="text-sm text-text-light">${school.formattedAddress || ""}</div>
        <div class="text-sm text-text-light">
          <span class="inline-block">${school.level || "N/A"}</span>
        </div>
        <div class="text-sm text-text-light">
          <span class="inline-block">${school.type || "N/A"}</span>
        </div>
        <div class="flex items-center gap-2">
          <input
            id="school-${school.id ?? ""}"
            type="checkbox"
            data-action="toggle-school"
            data-school-id="${school.id ?? ""}"
            class="w-4 h-4 accent-primary"
            ${checked}
          />
          <label for="school-${school.id ?? ""}" class="text-sm text-text-light select-none">Select</label>
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