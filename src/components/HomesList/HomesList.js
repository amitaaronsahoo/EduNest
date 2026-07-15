import { UIComponent } from "../../core/UIComponent.js";

export class HomesList extends UIComponent {
  render() {
    return `
      <section class="grid gap-4">
        <div class="app-section__header">
          <h2 id="resultsTitle" class="text-lg font-semibold text-primary">Available Homes</h2>
          <p class="text-sm text-text-light">Browse homes in your area</p>
        </div>

        <div id="mapContainer" class="bg-bg-white rounded-md overflow-hidden shadow-sm">
          <div id="map" class="w-full"></div>
        </div>

        <div id="results" class="grid gap-3">
          <div id="homeEmptyState" class="text-text-muted">Select filters and click "Apply Filters" to see results</div>
        </div>
      </section>
    `;
  }
}

export default HomesList;