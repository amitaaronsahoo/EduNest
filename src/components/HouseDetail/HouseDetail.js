import { UIComponent } from "../../core/UIComponent.js";

export class HouseDetail extends UIComponent {
    render() {
        console.log("HouseDetail.js loaded");
        return `
      <section class="flex flex-col gap-6 w-full h-full p-6 box-border">
        <div class="flex justify-between items-start gap-4">
          <div>
            <h2 id="houseDetailTitle" class="text-xl font-semibold text-primary">House Detail</h2>
            <p id="houseDetailSubtitle" class="text-sm text-text-light mt-1">Click a home marker to view nearby schools.</p>
          </div>
          <button id="detailBackBtn" type="button" class="bg-primary text-white rounded-md px-3 py-2">Back</button>
        </div>

        <div id="detailMap" class="w-full h-[400px] min-h-[400px] rounded-lg overflow-hidden border border-border-light"></div>

        <div class="grid grid-cols-1 lg:[grid-template-columns: minmax(280px,1fr) minmax(320px,1.2fr)] gap-6 items-start">
          <div id="houseDetailInfo" class="flex flex-col gap-4"></div>

          <div class="flex flex-col gap-4">
            <div id="houseDetailFilters" class="flex flex-col gap-4"></div>

            <div class="p-4 border border-border-light rounded-lg bg-bg-white">
              <h3 class="text-base font-medium text-primary">Nearby Schools</h3>
              <div id="houseSchoolResults" class="text-text-light mt-2">No school selected yet.</div>
              <div id="houseNearbySchools" class="flex flex-col gap-3 max-h-[450px] overflow-y-auto mt-2"></div>
            </div>
          </div>
        </div>
      </section>
    `;
    }
}

export default HouseDetail;