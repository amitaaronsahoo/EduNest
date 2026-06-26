import { UIComponent } from "../../core/UIComponent.js";

export class SchoolSuggestions extends UIComponent {
  render() {
    const items = this.props.items || [];
    const activeIndex = Number(this.props.activeIndex || -1);
    return `
      <div class="school-suggestions-list" ${items.length === 0 ? "hidden" : ""}>
        ${items
          .map(
            (school, index) => `
              <div class="school-suggestion-item ${index === activeIndex ? "active" : ""}" data-school-id="${school.id}" tabindex="0">
                <strong>${school.name}</strong>
                ${school.level ? `<div class="school-meta">${school.level}</div>` : ""}
                ${school.formattedAddress ? `<div class="school-meta">${school.formattedAddress}</div>` : ""}
              </div>
            `
          )
          .join("")}
      </div>
    `;
  }
}

export default SchoolSuggestions;
