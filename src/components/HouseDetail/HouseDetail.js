import './HouseDetail.css';
import { UIComponent } from "../../core/UIComponent.js";

export class HouseDetail extends UIComponent {
  render() {
    
console.log("HouseDetail.js loaded");
    return `
      <section class="house-detail">
        <div class="detail-header">
          <div>
            <h2 id="houseDetailTitle">House Detail</h2>
            <p id="houseDetailSubtitle">Click a home marker to view nearby schools.</p>
          </div>
          <button id="detailBackBtn" type="button">Back</button>
        </div>
        <div id="detailMap" class="detail-map"></div>
        <div class="detail-grid">
          <div id="houseDetailInfo"></div>
          <div class="detail-panels">
            <div id="houseDetailFilters"></div>
            <div class="panel">
              <h3>Nearby Schools</h3>
              <div id="houseSchoolResults">No school selected yet.</div>
              <div id="houseNearbySchools"></div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

export default HouseDetail;
