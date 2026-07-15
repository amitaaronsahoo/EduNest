import { UIComponent } from "../../core/UIComponent.js";
import { currency, generateZillowUrl } from "../../utils/formatters.js";

export class HouseDetailInfo extends UIComponent {
  render() {
    const home = this.props.home || {};
    const zillowUrl = generateZillowUrl(home.formattedAddress || "", home.zip || "");
    const isSaved = Boolean(this.props.isSaved);
    const saveLabel = isSaved ? "Remove" : "Save";
    const saveBtnClass = isSaved ? "bg-success text-white" : "bg-primary text-white";

    return `
      <div class="grid gap-3">
        <h3 class="text-lg font-semibold text-primary">${home.formattedAddress || "Unknown Address"}</h3>

        <p class="text-sm text-text-light"><strong>Type:</strong> ${home.propertyType || "N/A"}</p>
        <p class="text-sm text-text-light"><strong>Bedrooms:</strong> ${home.bedrooms ?? "N/A"} • <strong>Bathrooms:</strong> ${home.bathrooms ?? "N/A"}</p>
        <p class="text-sm text-text-light"><strong>Price:</strong> ${currency(home.price ?? 0)}</p>

        <div class="flex gap-3 flex-wrap">
          <a
            href="${zillowUrl}"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center px-3 py-2 rounded-md bg-secondary text-white no-underline"
          >
            View on Zillow
          </a>

          <button type="button" data-action="toggle-save" class="${saveBtnClass} rounded-md px-3 py-2">
            ${saveLabel}
          </button>
        </div>
      </div>
    `;
  }
}

export default HouseDetailInfo;