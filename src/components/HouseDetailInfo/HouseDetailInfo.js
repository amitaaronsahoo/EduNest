import './HouseDetailInfo.css';
import { UIComponent } from "../../core/UIComponent.js";
import { currency, generateZillowUrl } from "../../utils/formatters.js";

export class HouseDetailInfo extends UIComponent {
  render() {
    const home = this.props.home || {};
    const zillowUrl = generateZillowUrl(home.formattedAddress || "", home.zip || "");

    return `
      <div class="house-detail-info">
        <h3>${home.formattedAddress || "Unknown Address"}</h3>
        <p><strong>Type:</strong> ${home.propertyType || "N/A"}</p>
        <p><strong>Bedrooms:</strong> ${home.bedrooms ?? "N/A"} • <strong>Bathrooms:</strong> ${home.bathrooms ?? "N/A"}</p>
        <p><strong>Price:</strong> ${currency(home.price ?? 0)}</p>
        <div class="detail-actions">
          <a
            href="${zillowUrl}"
            target="_blank"
            rel="noopener noreferrer"
            class="detail-actions__zillow"
          >
            View on Zillow
          </a>
          <button type="button" data-action="toggle-save">
            ${this.props.isSaved ? "Remove" : "Save"}
          </button>
        </div>
      </div>
    `;
  }
}

export default HouseDetailInfo;
