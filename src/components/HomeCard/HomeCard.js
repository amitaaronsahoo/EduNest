import { UIComponent } from "../../core/UIComponent.js";
import { currency } from "../../utils/formatters.js";

export class HomeCard extends UIComponent {
  render() {
    const home = this.props.home || {};
    const isSaved = Boolean(this.props.isSaved);
    const index = Number.isInteger(this.props.index) ? this.props.index : null;
    const rankLabel = index !== null ? `#${index + 1}` : "";
    const schoolDistances = Array.isArray(home.nearbySchools) && home.nearbySchools.length
        ? home.nearbySchools
            .map(entry => `<li><strong>${entry.school || "School"}</strong>: ${Number(entry.distance).toFixed(2)} miles</li>`)
            .join("")
        : "";
    const distanceText =
        typeof home.distanceToSchool === "number"
            ? `<div class="text-sm text-[#475569] my-1">${home.distanceToSchool.toFixed(2)} miles from selected school</div>`
            : "";
    const distanceMarkup = schoolDistances
        ? `<div class="text-sm text-[#475569] my-1"><strong>Distances from selected schools:</strong><ul class="list-disc pl-5 mt-2">${schoolDistances}</ul></div>`
        : distanceText;

    return `
      <article
        class="p-4 border border-[#dbe4f0] cursor-pointer rounded-2xl bg-gradient-to-br from-white to-[#f8fbff] shadow-lg transition-transform duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-xl${isSaved ? " ring-2 ring-amber-400" : ""}"
        data-home-id="${home.id ?? ""}"
      >
        <h3 class="mb-2 text-[#0f4c81] text-base flex items-start gap-2">
          ${rankLabel ? `<span class="inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded-full text-sm font-bold bg-[#1f4f99] text-white">${rankLabel}</span>` : ""}
          <span>${home.formattedAddress || "Unknown Address"}</span>
        </h3>

        <p class="text-sm text-[#475569] my-1"><strong>Type:</strong> ${home.propertyType || "N/A"}</p>
        <p class="text-sm text-[#475569] my-1"><strong>Bedrooms:</strong> ${home.bedrooms ?? "N/A"} • <strong>Bathrooms:</strong> ${home.bathrooms ?? "N/A"}</p>
        <p class="text-sm text-[#475569] my-1"><strong>Square Feet:</strong> ${home.squareFeet ?? "N/A"}</p>
        <p class="text-sm text-[#475569] my-1"><strong>Price:</strong> ${currency(home.price ?? 0)}</p>

        ${distanceMarkup}
      </article>
    `;
  }

  onMounted() {
  }
}

export default HomeCard;