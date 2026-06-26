import { UIComponent } from "../../core/UIComponent.js";
import { currency } from "../../utils/formatters.js";

export class HomeCard extends UIComponent {
  render() {
    const home = this.props.home || {};
    const isSaved = Boolean(this.props.isSaved);
    const distanceText =
      typeof home.distanceToSchool === "number"
        ? `<div class="home-card__distance">${home.distanceToSchool.toFixed(2)} miles from selected school</div>`
        : "";

    return `
      <article class="home-card ${isSaved ? "home-card--saved" : ""}" data-home-id="${home.id ?? ""}">
        <h3 class="home-card__title">${home.formattedAddress || "Unknown Address"}</h3>
        <p class="home-card__meta"><strong>Type:</strong> ${home.propertyType || "N/A"}</p>
        <p class="home-card__meta"><strong>Bedrooms:</strong> ${home.bedrooms ?? "N/A"} • <strong>Bathrooms:</strong> ${home.bathrooms ?? "N/A"}</p>
        <p class="home-card__meta"><strong>Square Feet:</strong> ${home.squareFeet ?? "N/A"}</p>
        <p class="home-card__price"><strong>Price:</strong> ${currency(home.price ?? 0)}</p>
        ${distanceText}
        <div class="home-card__actions">
          <button type="button" class="home-card__button" data-action="details">View Details</button>
          <button type="button" class="home-card__button ${isSaved ? "home-card__button--saved" : ""}" data-action="save">
            ${isSaved ? "Remove Saved" : "Save House"}
          </button>
        </div>
      </article>
    `;
  }

  onMounted() {
    this.addDelegatedListener("click", '[data-action="details"]', () => {
      this.props.onSelect?.(this.props.home);
    });

    this.addDelegatedListener("click", '[data-action="save"]', () => {
      this.props.onToggleSave?.(this.props.home);
    });
  }
}

export default HomeCard;
