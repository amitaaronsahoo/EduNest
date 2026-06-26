import { UIComponent } from "../../core/UIComponent.js";

export class HomesList extends UIComponent {
  render() {
    return `
      <section class="homes-list">
        <div class="app-section__header">
          <h2 id="resultsTitle">Available Homes</h2>
          <p>Browse homes in your area</p>
        </div>
        <div id="mapContainer"><div id="map"></div></div>
        <div id="results" class="cards">
          <div id="homeEmptyState" class="empty-state">Select filters and click "Apply Filters" to see results</div>
        </div>
      </section>
    `;
  }
}

export default HomesList;
