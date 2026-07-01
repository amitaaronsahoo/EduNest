import './AppShell.css';
import { UIComponent } from "../../core/UIComponent.js";
import { currency, generateZillowUrl } from "../../utils/formatters.js";
import { hasCoordinates } from "../../utils/validators.js";
import { normalizeSearchText } from "../../utils/normalizers.js";
import HomeCard from "../HomeCard/HomeCard.js";
import SchoolRow from "../SchoolRow/SchoolRow.js";
import HouseDetail from "../HouseDetail/HouseDetail.js";

export class AppShell extends UIComponent {
  constructor(props = {}, stateManager) {
    super(props, stateManager);
    this.dataService = props.dataService;
    this.schoolService = props.schoolService;
    this.homeService = props.homeService;
    this.savedHousesService = props.savedHousesService;
    this.mapService = props.mapService;
    this.currentHouseDetail = null;
    this.lastSelectedSchool = null;
    this.houseDetail = new HouseDetail(props, stateManager);
  }

  render() {
    return `
      <div class="app-shell">
        <header class="app-shell__header">
          <h1>EduNest — Jefferson County Home & School Locator</h1>
        </header>
        <div class="app-shell__layout">
          <aside class="sidebar">
            <h2>Navigation</h2>
            <div id="app-nav"></div>

            <div id="schools-sidebar">
              <h2>Find Schools</h2>
              <label for="schoolSearch">School name</label>
              <input id="schoolSearch" type="text" placeholder="e.g., DuPont Manual" />
              <button id="schoolSearchBtn" type="button">Search Schools</button>
              <button id="allSchoolBtn" type="button">Search Homes for all selected schools</button>
              <h2>Filter Schools</h2>
              <div class="filter-group">
                <label><input type="checkbox" name="schoolType" value="JCPS"> Public</label>
                <label><input type="checkbox" name="schoolType" value="Private"> Private</label>
                <label><input type="checkbox" name="schoolType" value="Parochial School"> Catholic</label>
              </div>
              <div class="filter-group">
                <label><input type="checkbox" name="gradeLevel" value="Elementary"> Elementary</label>
                <label><input type="checkbox" name="gradeLevel" value="Middle"> Middle</label>
                <label><input type="checkbox" name="gradeLevel" value="High"> High</label>
              </div>
              <label for="maxTuition">Max Tuition: $<span id="maxTuitionValue">5000</span></label>
              <input id="maxTuition" type="range" min="0" max="50000" step="1000" value="5000" />
              <button id="applyFiltersBtn" type="button">Apply Filters</button>
            </div>

            <div id="homes-sidebar" hidden>
              <h2>Find Homes Near School</h2>
              <label for="schoolSearchHome">School name</label>
              <input id="schoolSearchHome" type="text" placeholder="e.g., DuPont Manual High School" />
              <div id="schoolSuggestionsContainer" class="school-suggestions">
                <div id="schoolSuggestionsList" class="school-suggestions-list" hidden></div>
              </div>
              <button id="schoolSearchHomeBtn" type="button">Search Nearby Homes</button>
              <h2>Filter Homes</h2>
              <label for="minBedrooms">Minimum bedrooms</label>
              <select id="minBedrooms">
                <option value="0">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
              <label for="minBathrooms">Minimum bathrooms</label>
              <select id="minBathrooms">
                <option value="0">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
              </select>
              <label for="maxPriceHome">Max Price: <span id="maxPriceValue">300000</span></label>
              <input id="maxPriceHome" type="range" min="50000" max="1000000" step="10000" value="300000" />
              <button id="applyFiltersHomeBtn" type="button">Apply Filters</button>
              <div id="homeResults" class="sidebar__status"></div>
            </div>

            <h2>Saved Homes</h2>
            <div id="savedHousesCount">0 homes saved</div>
            <div id="savedHousesList"></div>
          </aside>

          <main class="app-shell__main">
            <section id="schools-content" class="app-section">
              <div class="app-section__header">
                <h2>School Directory</h2>
                <p>Browse and search schools in Jefferson County</p>
              </div>
              <div id="schoolResults"></div>
              <div class="school-list">
                <div class="school-list__header">
                  <div>School Name</div>
                  <div>Address</div>
                  <div>Type</div>
                  <div>Grades</div>
                  <div>Action</div>
                </div>
                <div id="schoolsTableBody"></div>
              </div>
            </section>

            <section id="homes-content" class="app-section" hidden>
              <div class="app-section__header">
                <h2 id="resultsTitle">Available Homes</h2>
                <p>Browse homes in your area</p>
              </div>
              <div id="mapContainer"><div id="map"></div></div>
              <div id="results" class="cards">
                <div id="homeEmptyState" class="empty-state">Select filters and click "Apply Filters" to see results</div>
              </div>
            </section>

            <section id="house-details-content" class="app-section" hidden>
              <div class="detail-header">
                <div>
                  <h2 id="houseDetailTitle">House Detail</h2>
                  <p id="houseDetailSubtitle">Click a home marker to view nearby schools.</p>
                </div>
                <button id="detailBackBtn" type="button">Back</button>
              </div>
              <div id="detailMap" class="detail-map">map here</div>
              <div class="detail-grid">
                <div id="houseDetailInfo"></div>
                <div class="detail-panels">
                  <div class="panel">
                    <h3>Filter Nearby Schools</h3>
                    <div class="filter-group">
                      <label><input type="checkbox" name="houseSchoolType" value="JCPS"> Public</label>
                      <label><input type="checkbox" name="houseSchoolType" value="Private"> Private</label>
                      <label><input type="checkbox" name="houseSchoolType" value="Parochial School"> Catholic</label>
                    </div>
                    <div class="filter-group">
                      <label><input type="checkbox" name="houseGradeLevel" value="Elementary"> Elementary</label>
                      <label><input type="checkbox" name="houseGradeLevel" value="Middle"> Middle</label>
                      <label><input type="checkbox" name="houseGradeLevel" value="High"> High</label>
                    </div>
                    <label for="houseMaxTuition">Max Tuition: $<span id="houseMaxTuitionValue">5000</span></label>
                    <input id="houseMaxTuition" type="range" min="0" max="50000" step="1000" value="5000" />
                    <button id="houseApplySchoolFiltersBtn" type="button">Apply School Filters</button>
                  </div>
                  <div class="panel">
                    <h3>Nearby Schools</h3>
                    <div id="houseSchoolResults">No school selected yet.</div>
                    <div id="houseNearbySchools"></div>
                  </div>
                </div>
              </div>
            </section>

            <section id="saved-content" class="app-section" hidden>
              <h2>My Saved Homes</h2>
              <div id="savedHouses" class="cards">
                <div id="emptyState" class="empty-state">No homes saved yet</div>
              </div>
            </section>
          </main>
        </div>
      </div>
    `;
  }

  onMounted() {
    this.cacheElements();
    this.bindEvents();
    this.subscribeToState(
      ["houses", "schools", "filteredHomes", "schoolsFiltered", "savedHouses", "currentTab", "currentHouseDetail", "dataLoadError", "isLoadingData"],
      () => this.syncView()
    );
    this.bootstrap();
  }

  cacheElements() {
    this.elements = {
      appNav: this.querySelector("#app-nav"),
      schoolsSidebar: this.querySelector("#schools-sidebar"),
      homesSidebar: this.querySelector("#homes-sidebar"),
      schoolsContent: this.querySelector("#schools-content"),
      homesContent: this.querySelector("#homes-content"),
      houseDetailsContent: this.querySelector("#house-details-content"),
      savedContent: this.querySelector("#saved-content"),
      schoolSearch: this.querySelector("#schoolSearch"),
      schoolSearchBtn: this.querySelector("#schoolSearchBtn"),
      maxTuition: this.querySelector("#maxTuition"),
      maxTuitionValue: this.querySelector("#maxTuitionValue"),
      applyFiltersBtn: this.querySelector("#applyFiltersBtn"),
      schoolResults: this.querySelector("#schoolResults"),
      schoolsTableBody: this.querySelector("#schoolsTableBody"),
      allSchoolBtn: this.querySelector("#allSchoolBtn"),
      schoolSearchHome: this.querySelector("#schoolSearchHome"),
      schoolSuggestionsList: this.querySelector("#schoolSuggestionsList"),
      schoolSearchHomeBtn: this.querySelector("#schoolSearchHomeBtn"),
      minBedrooms: this.querySelector("#minBedrooms"),
      minBathrooms: this.querySelector("#minBathrooms"),
      maxPriceHome: this.querySelector("#maxPriceHome"),
      maxPriceValue: this.querySelector("#maxPriceValue"),
      applyFiltersHomeBtn: this.querySelector("#applyFiltersHomeBtn"),
      homeResults: this.querySelector("#homeResults"),
      resultsTitle: this.querySelector("#resultsTitle"),
      results: this.querySelector("#results"),
      homeEmptyState: this.querySelector("#homeEmptyState"),
      houseDetailTitle: this.querySelector("#houseDetailTitle"),
      houseDetailSubtitle: this.querySelector("#houseDetailSubtitle"),
      detailBackBtn: this.querySelector("#detailBackBtn"),
      houseDetailInfo: this.querySelector("#houseDetailInfo"),
      houseMaxTuition: this.querySelector("#houseMaxTuition"),
      houseMaxTuitionValue: this.querySelector("#houseMaxTuitionValue"),
      houseApplySchoolFiltersBtn: this.querySelector("#houseApplySchoolFiltersBtn"),
      houseSchoolResults: this.querySelector("#houseSchoolResults"),
      houseNearbySchools: this.querySelector("#houseNearbySchools"),
      savedHousesCount: this.querySelector("#savedHousesCount"),
      savedHousesList: this.querySelector("#savedHousesList"),
      savedHouses: this.querySelector("#savedHouses"),
      emptyState: this.querySelector("#emptyState")
    };
  }

  bindEvents() {
    this.elements.schoolSearch?.addEventListener("input", event => {
      this.renderSchoolsList(null, event.target.value);
    });
    this.elements.schoolSearchBtn?.addEventListener("click", () => this.renderSchoolsList());
    this.elements.maxTuition?.addEventListener("input", () => {
      this.elements.maxTuitionValue.textContent = currency(Number(this.elements.maxTuition.value));
      this.applySchoolFilters();
    });
    this.querySelectorAll('input[name="schoolType"], input[name="gradeLevel"]').forEach(input => {
      input.addEventListener("change", () => this.applySchoolFilters());
    });
    this.elements.applyFiltersBtn?.addEventListener("click", () => this.applySchoolFilters());
    this.elements.allSchoolBtn?.addEventListener("click", () => this.searchHomesForAllSelectedSchools());
    this.elements.schoolSearchHome?.addEventListener("input", event => this.showSchoolSuggestions(event.target.value));
    this.elements.schoolSearchHome?.addEventListener("keydown", event => this.handleSuggestionKeyboard(event));
    this.elements.schoolSearchHomeBtn?.addEventListener("click", () => this.searchHomesNearSchool());
    this.elements.maxPriceHome?.addEventListener("input", () => {
      this.elements.maxPriceValue.textContent = currency(Number(this.elements.maxPriceHome.value));
    });
    this.elements.applyFiltersHomeBtn?.addEventListener("click", () => this.applyHomeFilters());
    this.elements.detailBackBtn?.addEventListener("click", () => this.returnFromDetail());
    this.elements.houseMaxTuition?.addEventListener("input", () => {
      this.elements.houseMaxTuitionValue.textContent = String(this.elements.houseMaxTuition.value);
      this.applyHouseDetailFilters();
    });
    this.elements.houseApplySchoolFiltersBtn?.addEventListener("click", () => this.applyHouseDetailFilters());

    document.addEventListener("click", event => {
      const container = this.elements.schoolSuggestionsList;
      const input = this.elements.schoolSearchHome;
      if (!container || !input) return;
      if (container.contains(event.target) || input.contains(event.target)) return;
      this.clearSchoolSuggestions();
    });

    this.querySelector("#schoolsTableBody")?.addEventListener("click", event => {
      const row = event.target.closest(".school-row");
      if (!row) return;
      const schoolId = Number(row.dataset.schoolId);
      const school = this.stateManager.get("schools").find(item => item.id === schoolId);
      if (!school) return;
      if (event.target.matches('input[type="checkbox"]')) {
        event.stopPropagation();
        return;
      }
      const checkbox = row.querySelector('input[type="checkbox"]');
      if (checkbox) checkbox.checked = !checkbox.checked;
      this.showClosestSchools(school);
    });

    this.querySelector("#results")?.addEventListener("click", event => {
      const detailButton = event.target.closest('[data-action="details"]');
      const saveButton = event.target.closest('[data-action="save"]');
      const homeCard = event.target.closest("[data-home-id]");
      if (!homeCard) return;
      const homeId = Number(homeCard.dataset.homeId);
      const home = this.stateManager.get("filteredHomes").find(item => item.id === homeId) || this.stateManager.get("savedHouses").find(item => item.id === homeId) || this.stateManager.get("houses").find(item => item.id === homeId);
      if (detailButton) {
        this.renderHouseDetailView(home);
      } else if (saveButton) {
        this.toggleSavedHouse(home);
      } else {
        this.renderHouseDetailView(home);
      }
    });

    this.querySelector("#savedHouses")?.addEventListener("click", event => {
      const btn = event.target.closest('[data-action="saved-details"]');
      if (!btn) return;
      const homeId = Number(btn.dataset.homeId);
      const home = this.stateManager.get("savedHouses").find(item => item.id === homeId);
      if (home) this.renderHouseDetailView(home);
    });

    this.querySelector("#houseDetailInfo")?.addEventListener("click", event => {
      const saveButton = event.target.closest('[data-action="toggle-save"]');
      if (!saveButton || !this.currentHouseDetail) return;
      this.toggleSavedHouse(this.currentHouseDetail);
    });

    this.querySelector("#app-nav")?.addEventListener("click", event => {
      const button = event.target.closest("[data-tab]");
      if (!button) return;
      this.switchTab(button.dataset.tab);
    });
  }

  async bootstrap() {
    this.stateManager.initializeAppState();
    this.switchTab("schools");
    try {
      await this.dataService.loadAppData();
      this.savedHousesService.loadSavedHouses();
      this.syncView();
    } catch (error) {
      this.elements.results.innerHTML = `<div class="error-state">Error loading data. Please refresh the page.</div>`;
    }
  }

  syncView() {
    
    this.renderNavigation();
    this.syncTabVisibility();
this.renderHouseDetailView(this.currentHouseDetail, true);
    const activeTab = this.stateManager.get("currentTab") || "schools";


    switch (activeTab) {
        case "schools":
            this.renderSchoolsList();
            break;

        case "homes":
            this.renderHomes(this.stateManager.get("filteredHomes"));
            break;

        case "saved":
            this.renderSavedHouses();
            break;
    }
    this.renderLoadingState();
  }

  renderLoadingState() {
    const loading = this.stateManager.get("isLoadingData");
    if (loading) {
      this.elements.results.innerHTML = '<div class="empty-state">Loading homes...</div>';
      this.elements.schoolResults.textContent = "Loading schools...";
    }
    const error = this.stateManager.get("dataLoadError");
    if (error) {
      this.elements.results.innerHTML = `<div class="error-state">${error}</div>`;
    }
  }

  renderNavigation() {
    if (!this.elements.appNav) return;
    const activeTab = this.stateManager.get("currentTab") || "schools";
    this.elements.appNav.innerHTML = `
      <button type="button" data-tab="schools" class="${activeTab === "schools" ? "is-active" : ""}">📚 Schools</button>
      <button type="button" data-tab="homes" class="${activeTab === "homes" ? "is-active" : ""}">🏠 Homes</button>
      <button type="button" data-tab="saved" class="${activeTab === "saved" ? "is-active" : ""}">💾 Saved Homes</button>
    `;
  }

  syncTabVisibility() {
    const tab = this.stateManager.get("currentTab") || "schools";
    const showingDetail = this.currentHouseDetail !== null;

    // Sidebar
    this.elements.schoolsSidebar.hidden = tab !== "schools";
    this.elements.homesSidebar.hidden = tab !== "homes";

    // Main sections
    this.elements.schoolsContent.hidden = showingDetail || tab !== "schools";
    this.elements.homesContent.hidden = showingDetail || tab !== "homes";
    this.elements.savedContent.hidden = showingDetail || tab !== "saved";

    // Detail page
    this.elements.houseDetailsContent.hidden = !showingDetail;
}

 switchTab(tab) {
    this.stateManager.set("currentTab", tab);
    this.syncTabVisibility();

    if (tab === "schools" && !this.schoolsLoaded) {
        this.renderSchoolsList();
        this.schoolsLoaded = true;
    }

    if (tab === "homes" && !this.homesLoaded) {
        this.renderHomes(this.stateManager.get("filteredHomes"));
        this.homesLoaded = true;
    }

    if (tab === "saved" && !this.savedLoaded) {
        this.renderSavedHouses();
        this.savedLoaded = true;
    }
}

  applySchoolFilters() {
    const types = Array.from(this.querySelectorAll('input[name="schoolType"]:checked')).map(input => input.value);
    const levels = Array.from(this.querySelectorAll('input[name="gradeLevel"]:checked')).map(input => input.value);
    const maxTuition = Number(this.elements.maxTuition?.value || 5000);
    this.schoolService.applyFilters({ types, levels, maxTuition });
    this.renderSchoolsList();
  }

  applyHomeFilters() {
    const minBedrooms = Number(this.elements.minBedrooms?.value || 0);
    const minBathrooms = Number(this.elements.minBathrooms?.value || 0);
    const maxPrice = Number(this.elements.maxPriceHome?.value || Number.POSITIVE_INFINITY);
    const homes = this.homeService.applyFilters({ minBedrooms, minBathrooms, maxPrice });
    this.renderHomes(homes);
  }

  applyHouseDetailFilters() {
    if (!this.currentHouseDetail) return;
    const selectedTypes = Array.from(this.querySelectorAll('input[name="houseSchoolType"]:checked')).map(input => input.value);
    const selectedGrades = Array.from(this.querySelectorAll('input[name="houseGradeLevel"]:checked')).map(input => input.value);
    const maxTuition = Number(this.elements.houseMaxTuition?.value || 5000);
    const nearbySchools = this.homeService.getNearbySchoolsForHome(
      this.currentHouseDetail,
      this.stateManager.get("schools")
    );
    const visibleSchools = this.homeService.filterNearbySchools(nearbySchools, {
      types: selectedTypes,
      levels: selectedGrades,
      maxTuition
    });
    this.renderHouseNearbySchoolsList(visibleSchools);
    this.mapService.destroyDetailMap();
    this.mapService.initializeDetailMap("detailMap");
    this.mapService.addDetailMarkers(this.currentHouseDetail, visibleSchools);
  }

  getCheckedSchoolIds() {
    return new Set(
      Array.from(this.querySelectorAll('.school-row input[type="checkbox"]:checked')).map(input => Number(input.dataset.schoolId)).filter(Number.isFinite)
    );
  }

  renderSchoolsList(schools = null, searchQuery = "") {
    const baseSchools = schools || this.stateManager.get("schoolsFiltered") || [];
    const normalizedQuery = normalizeSearchText(searchQuery || this.elements.schoolSearch?.value || "");
    const checkedSchoolIds = this.getCheckedSchoolIds();
    let schoolsToRender = normalizedQuery
      ? baseSchools.filter(school => school.searchName.includes(normalizedQuery))
      : [...baseSchools];
    const checkedSchools = this.stateManager.get("schools").filter(school => checkedSchoolIds.has(school.id));
    checkedSchools.forEach(school => {
      if (!schoolsToRender.some(item => item.id === school.id)) {
        schoolsToRender.push(school);
      }
    });
    schoolsToRender.sort((a, b) => {
      const aChecked = checkedSchoolIds.has(a.id) ? 0 : 1;
      const bChecked = checkedSchoolIds.has(b.id) ? 0 : 1;
      if (aChecked !== bChecked) return aChecked - bChecked;
      return a.name.localeCompare(b.name);
    });

    this.elements.schoolResults.textContent = `${schoolsToRender.length} school${schoolsToRender.length !== 1 ? "s" : ""} found`;
    this.elements.schoolsTableBody.innerHTML = schoolsToRender.length
      ? schoolsToRender
          .map(school => {
            const row = new SchoolRow({
              school,
              checked: checkedSchoolIds.has(school.id),
              onToggle: targetSchool => this.toggleSchoolSelection(targetSchool)
            });
            return row.render();
          })
          .join("")
      : '<div class="empty-state">No schools found</div>';
  }

  toggleSchoolSelection(school) {
    const checkbox = this.querySelector(`#school-${school.id}`);
    if (checkbox) {
      checkbox.checked = !checkbox.checked;
    }
  }

  buildSchoolPopupContent(school) {
    if (!school) {
      return '<div style="min-width:240px; padding: 10px; color: #163b6e;">School details unavailable.</div>';
    }

    const metaLines = [school.level, school.type].filter(Boolean);
    return `
      <div style="min-width:220px; max-width:260px; border-radius:12px; overflow:hidden; background:linear-gradient(135deg, #fffdf7 0%, #ffffff 100%); box-shadow:0 10px 20px rgba(31,79,153,0.14); border:1px solid #dce7ff; margin:0; padding:0;">
        <div style="background:linear-gradient(135deg, #1f4f99 0%, #2f6dd8 100%); color:#ffffff; padding:8px 10px;">
          <div style="font-size:11px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:#ffd65c;">School</div>
          <h3 style="margin:4px 0 0; font-size:16px; line-height:1.25;">${school.name || "School"}</h3>
        </div>
        <div style="padding:10px 12px 12px; color:#123a6e;">
          ${metaLines.length ? `<div style="font-size:12px; font-weight:600; color:#1f4f99; margin-bottom:5px;">${metaLines.join(" • ")}</div>` : ""}
          ${school.formattedAddress ? `<div style="font-size:12px; margin-bottom:4px;">${school.formattedAddress}</div>` : ""}
          ${school.phone ? `<div style="font-size:12px; margin-bottom:4px;">${school.phone}</div>` : ""}
          ${school.website ? `<div style="font-size:12px; margin-bottom:6px;"><a href="${school.website}" target="_blank" rel="noopener noreferrer" style="color:#1f4f99; text-decoration:none; font-weight:600;">Website</a></div>` : ""}
          <button type="button" class="search-homes-near-school" style="margin-top:4px; width:100%; border:none; border-radius:999px; padding:7px 10px; background:linear-gradient(135deg, #f4c542 0%, #ffd966 100%); color:#123a6e; font-weight:700; cursor:pointer; box-shadow:0 3px 8px rgba(244,197,66,0.2);">Search homes near this school</button>
        </div>
      </div>
    `;
  }

  buildHomePopupContent(home, schools = []) {
    const zillowUrl = generateZillowUrl(home.formattedAddress);
    const isSaved = this.savedHousesService.isHouseSaved(home);
    const saveMarker = isSaved ? "★" : "☆";
    const distances = Array.isArray(home.nearbySchools) && home.nearbySchools.length
      ? home.nearbySchools.map(entry => ({
          school: entry.school || entry.name || "School",
          distance: Number(entry.distance)
        }))
      : (typeof home.distanceToSchool === "number"
          ? [{ school: Array.isArray(schools) && schools[0]?.name ? schools[0].name : "selected school", distance: home.distanceToSchool }]
          : []);

    const distanceMarkup = distances.length
      ? `<div style="margin-top:8px; padding:8px 9px; border-radius:10px; background:#fff6c9; border:1px solid #f2d96b;">${distances.map(entry => `<div style="font-size:12px; color:#123a6e; margin-bottom:3px;">${entry.distance.toFixed(2)} miles from ${entry.school}</div>`).join("")}</div>`
      : "";

    return `
      <div style="min-width:220px; max-width:270px; border-radius:12px; overflow:hidden; background:linear-gradient(135deg, #fffdf7 0%, #ffffff 100%); box-shadow:0 10px 20px rgba(31,79,153,0.14); border:1px solid #dce7ff; position:relative; margin:0; padding:0;">
        <button
          type="button"
          class="save-home-marker"
          title="Save Home"
          style="position:absolute;top:10px;right:10px;border:none;background:transparent;padding:0;margin:0;font-size:22px;line-height:1;color:#f4c542;cursor:pointer;text-shadow:0 1px 2px rgba(18,58,110,0.25);"
        >${saveMarker}</button>
        <div style="background:linear-gradient(135deg, #1f4f99 0%, #2f6dd8 100%); color:#ffffff; padding:8px 10px; padding-right:38px;">
          <div style="font-size:11px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:#ffd65c;">Home</div>
          <h3 style="margin:4px 0 0; font-size:16px; line-height:1.25;">${home.formattedAddress}</h3>
        </div>
        <div style="padding:10px 12px 12px; color:#123a6e;">
          <p style="margin:0 0 6px; font-size:13px;"><strong>Price:</strong> ${currency(home.price)}</p>
          <p style="margin:0 0 6px; font-size:13px;"><strong>Bedrooms:</strong> ${home.bedrooms ?? "N/A"} • <strong>Bathrooms:</strong> ${home.bathrooms ?? "N/A"}</p>
          ${distanceMarkup}
          <div style="margin-top:10px;display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
            <button type="button" class="details-home-marker" style="border:none;border-radius:999px;padding:6px 9px;background:#1f4f99;color:#ffffff;cursor:pointer;font-weight:600;">More details</button>
            <button type="button" class="zillow-home-marker" style="border:none;border-radius:999px;padding:6px 9px;background:#f4c542;color:#123a6e;cursor:pointer;font-weight:700;" onclick="window.open('${zillowUrl}', '_blank')">View Zillow</button>
          </div>
        </div>
      </div>
    `;
  }

  attachHomePopupHandlers(marker, home) {
    const popup = marker.getPopup()?.getElement?.();
    popup?.querySelector(".details-home-marker")?.addEventListener("click", () => this.renderHouseDetailView(home));
    popup?.querySelector(".save-home-marker")?.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      this.toggleSavedHouse(home, { skipDetailView: true });
      const button = event.currentTarget;
      button.textContent = button.textContent === "★" ? "☆" : "★";
    });
  }

  attachSchoolPopupHandlers(marker, school) {
    const popup = marker.getPopup()?.getElement?.();
    popup?.querySelector(".search-homes-near-school")?.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      this.returnFromDetail();
      this.switchTab("homes");
      this.searchHomesNearSchool(school);
    });
  }

  renderMultiSchoolHomeMap(homes, schools = []) {
    const homeList = Array.isArray(homes) ? homes : [];
    const selectedSchools = Array.isArray(schools) ? schools.filter(Boolean) : schools ? [schools] : [];

    try {
      if (!this.mapService.getMap()) {
        this.mapService.initializeMap("map");
      } else {
        this.mapService.destroyMap();
        this.mapService.initializeMap("map");
      }
    } catch (error) {
      console.error("Failed to initialize multi-school homes map:", error);
      return;
    }
    const map = this.mapService.getMap();
    if (!map) return;
    this.mapService.addSchoolMarkers(selectedSchools, null, {
      mapType: "main",
      clearExisting: false,
      title: school => school.name,
      popupText: school => this.buildSchoolPopupContent(school),
      popupOptions: {
        className: "modern-popup",
        closeButton: false,
        maxWidth: 330,
        minWidth: 290
      },
      onPopupOpen: (marker, school) => this.attachSchoolPopupHandlers(marker, school)
    });

    this.mapService.addHomeMarkers(homeList, null, {
      mapType: "main",
      clearExisting: false,
      title: home => home.formattedAddress,
      popupText: home => this.buildHomePopupContent(home, selectedSchools),
      popupOptions: {
        className: "modern-popup",
        closeButton: false,
        maxWidth: 330,
        minWidth: 290
      },
      onPopupOpen: (marker, home) => this.attachHomePopupHandlers(marker, home)
    });

    setTimeout(() => this.mapService.invalidateMapSize(), 150);
  }

  renderHomes(homes, school = []) {
    const homeList = Array.isArray(homes) ? homes : [];
    const selectedSchools = Array.isArray(school)
      ? school.filter(Boolean)
      : school
        ? [school]
        : [];

    const fallbackSchool = this.stateManager.get("lastSelectedSchool");
    const schoolsToRender = selectedSchools.length > 0
      ? selectedSchools
      : fallbackSchool
        ? [fallbackSchool]
        : [];

    this.elements.results.innerHTML = homeList.length
      ? homeList
          .map(home => new HomeCard({
            home,
            isSaved: this.savedHousesService.isHouseSaved(home),
            onSelect: selectedHome => this.renderHouseDetailView(selectedHome),
            onToggleSave: selectedHome => this.toggleSavedHouse(selectedHome)
          }).render())
          .join("")
      : '<div class="empty-state">No homes found. Try adjusting your filters.</div>';

    this.elements.homeResults.textContent = `${homeList.length} home${homeList.length !== 1 ? "s" : ""} found`;

    if (selectedSchools.length > 1) {
      this.renderMultiSchoolHomeMap(homeList, schoolsToRender);
      return;
    }

    try {
      if (!this.mapService.getMap()) {
        this.mapService.initializeMap("map");
      } else {
        this.mapService.destroyMap();
        this.mapService.initializeMap("map");
      }
    } catch (error) {
      console.error("Failed to initialize homes map:", error);
      return;
    }

    const map = this.mapService.getMap();
    if (!map) return;

    this.mapService.addSchoolMarkers(schoolsToRender, null, {
      mapType: "main",
      clearExisting: true,
      title: school => school.name,
      popupText: school => this.buildSchoolPopupContent(school),
      popupOptions: {
        className: "modern-popup",
        closeButton: false,
        maxWidth: 330,
        minWidth: 290
      },
      onPopupOpen: (marker, school) => this.attachSchoolPopupHandlers(marker, school)
    });

    this.mapService.addHomeMarkers(homeList, null, {
      mapType: "main",
      clearExisting: false,
      title: home => home.formattedAddress,
      popupText: home => this.buildHomePopupContent(home, schoolsToRender),
      popupOptions: {
        className: "modern-popup",
        closeButton: false,
        maxWidth: 330,
        minWidth: 290
      },
      onPopupOpen: (marker, home) => this.attachHomePopupHandlers(marker, home)
    });

    setTimeout(() => this.mapService.invalidateMapSize(), 150);
  }

  populateHomeResults(homes, centerSchoolId = null) {
    this.elements.results.innerHTML = "";
    this.elements.homeEmptyState.hidden = homes.length !== 0;
    homes.forEach(home => {
      this.elements.results.appendChild(createHomeCard(home));
    });
    this.updateSaveButtons();
  }

  renderSavedHouses() {
    const savedHouses = this.stateManager.get("savedHouses") || [];
    this.elements.savedHousesCount.textContent = `${savedHouses.length} home${savedHouses.length !== 1 ? "s" : ""} saved`;
    this.elements.savedHousesList.innerHTML =
      savedHouses.length === 0
        ? '<div class="sidebar__empty">No homes saved yet</div>'
        : savedHouses
            .map(home => `
              <div class="saved-home" data-home-id="${home.id}">
                <div class="saved-home__title">${home.formattedAddress}</div>
                <div class="saved-home__price">${currency(home.price)}</div>
              </div>
            `)
            .join("");
    this.elements.savedHouses.innerHTML =
      savedHouses.length === 0
        ? '<div class="empty-state">No homes saved yet</div>'
        : savedHouses
            .map(home => new HomeCard({
              home,
              isSaved: true,
              onSelect: selectedHome => this.renderHouseDetailView(selectedHome),
              onToggleSave: selectedHome => this.toggleSavedHouse(selectedHome)
            }).render() + `<button type="button" data-action="saved-details" data-home-id="${home.id}">View Details</button>`)
            .join("");
  }

  renderHouseDetailView(home, skipStateUpdate = false) {
    if (!home || !hasCoordinates(home)) {
      return;
    }
    if (!skipStateUpdate) {
      this.currentHouseDetail = home;
      this.stateManager.set("currentHouseDetail", home);
    } else {
      this.currentHouseDetail = this.stateManager.get("currentHouseDetail");
    }

    this.elements.houseDetailsContent.hidden = false;
    this.mapService.destroyDetailMap();
    this.mapService.initializeDetailMap("detailMap");
    setTimeout(() => {
      this.mapService.invalidateDetailMapSize();
    }, 0);
    this.elements.schoolsContent.hidden = true;
    this.elements.homesContent.hidden = true;
    this.elements.savedContent.hidden = true;
    this.elements.schoolsSidebar.hidden = true;
    this.elements.homesSidebar.hidden = true;
    this.elements.houseDetailSubtitle.textContent = `Showing schools near ${home.formattedAddress}`;
    this.elements.houseDetailInfo.innerHTML = `
      <h3>${home.formattedAddress}</h3>
      <p><strong>Type:</strong> ${home.propertyType || "N/A"}</p>
      <p><strong>Bedrooms:</strong> ${home.bedrooms} • <strong>Bathrooms:</strong> ${home.bathrooms}</p>
      <p><strong>Price:</strong> ${currency(home.price)}</p>
      <div class="detail-actions">
        <button type="button" onclick="window.open('${generateZillowUrl(home.formattedAddress)}', '_blank')">View on Zillow</button>
        <button type="button" data-action="toggle-save">${this.savedHousesService.isHouseSaved(home) ? "Remove" : "Save"}</button>
      </div>
    `;
    const nearbySchools = this.homeService.getNearbySchoolsForHome(home, this.stateManager.get("schools"));
    const visibleSchools = this.homeService.filterNearbySchools(nearbySchools, this.getHouseDetailFilters());
    this.renderHouseNearbySchoolsList(visibleSchools);
    this.mapService.destroyDetailMap();
    this.mapService.initializeDetailMap("detailMap");
    this.mapService.addHomeMarkers([home], null, {
      mapType: "detail",
      clearExisting: true,
      popupText: property => this.buildHomePopupContent(property, visibleSchools),
      popupOptions: {
        className: "modern-popup",
        closeButton: false,
        maxWidth: 330,
        minWidth: 290
      },
      onPopupOpen: (marker, property) => this.attachHomePopupHandlers(marker, property)
    });
    this.mapService.addSchoolMarkers(visibleSchools, null, {
      mapType: "detail",
      clearExisting: false,
      popupText: school => this.buildSchoolPopupContent(school),
      popupOptions: {
        className: "modern-popup",
        closeButton: false,
        maxWidth: 330,
        minWidth: 290
      },
      onPopupOpen: (marker, school) => this.attachSchoolPopupHandlers(marker, school)
    });
    this.mapService.invalidateDetailMapSize();
  }

  getHouseDetailFilters() {
    const selectedTypes = Array.from(this.querySelectorAll('input[name="houseSchoolType"]:checked')).map(input => input.value);
    const selectedGrades = Array.from(this.querySelectorAll('input[name="houseGradeLevel"]:checked')).map(input => input.value);
    const maxTuition = Number(this.elements.houseMaxTuition?.value || 5000);
    return { types: selectedTypes, levels: selectedGrades, maxTuition };
  }

  renderHouseNearbySchoolsList(schools) {
    if (!this.elements.houseNearbySchools) return;
    this.elements.houseNearbySchools.innerHTML = "";
    if (schools.length === 0) {
      this.elements.houseSchoolResults.textContent = "No nearby schools found for this house.";
      this.elements.houseNearbySchools.innerHTML = '<div class="empty-state">Try adjusting the school filters.</div>';
      return;
    }
    this.elements.houseSchoolResults.textContent = `${schools.length} nearby school${schools.length !== 1 ? "s" : ""} found`;
    this.elements.houseNearbySchools.innerHTML = schools
      .map(school => `
        <div class="nearby-school">
          <strong>${school.name}</strong>
          <div>${school.level || ""} ${school.type ? `• ${school.type}` : ""}</div>
          <div>${school.formattedAddress || ""}</div>
          <div>${school.distance.toFixed(2)} miles away</div>
        </div>
      `)
      .join("");
  }

  toggleSavedHouse(home, options = {}) {
    if (!home) return;
    this.savedHousesService.toggleSavedHouse(home);
    this.renderSavedHouses();
    this.renderHomes(this.stateManager.get("filteredHomes"));
    if (!options.skipDetailView && this.currentHouseDetail?.id === home.id) {
      this.renderHouseDetailView(home, false);
    }
  }

  searchHomesNearSchool(selectedSchool = null) {
    const query = normalizeSearchText(this.elements.schoolSearchHome?.value || "");
    const resolvedSchool = selectedSchool || this.schoolService.findBestSchoolMatch(query);

    if (!resolvedSchool || !hasCoordinates(resolvedSchool)) {
      this.lastSelectedSchool = null;
      this.stateManager.set("lastSelectedSchool", null);
      this.elements.resultsTitle.textContent = "Available Homes";
      this.renderHomes(this.stateManager.get("houses"), []);
      return;
    }

    this.elements.schoolSearchHome.value = resolvedSchool.name;
    this.lastSelectedSchool = resolvedSchool;
    this.stateManager.set("lastSelectedSchool", resolvedSchool);
    const nearbyHomes = this.homeService.getNearbyHomesForSchool(resolvedSchool);
    this.elements.resultsTitle.textContent = `Homes Near ${resolvedSchool.name}`;
    this.switchTab("homes");
    this.renderHomes(nearbyHomes, resolvedSchool);
    this.showClosestSchools(resolvedSchool);
    this.homesLoaded = true;
  }

  searchHomesForAllSelectedSchools() {
    const selectedSchools = this.schoolService.getSchoolsByIds(Array.from(this.getCheckedSchoolIds()));
    if (selectedSchools.length === 0) {
      this.lastSelectedSchool = null;
      this.stateManager.set("lastSelectedSchool", null);
      this.renderHomes([], []);
      alert("Please select at least one school");
      return;
    }
    const allNearbyHomes = this.homeService.getNearbyHomesForSchools(selectedSchools);
    this.elements.resultsTitle.textContent = `Homes Near: ${selectedSchools.map(school => school.name).join(", ")}`;
    this.switchTab("homes");
    this.renderMultiSchoolHomeMap(allNearbyHomes, selectedSchools);
    this.elements.homeResults.textContent = `${allNearbyHomes.length} home${allNearbyHomes.length !== 1 ? "s" : ""} found near selected school${selectedSchools.length !== 1 ? "s" : ""}`;
    this.homesLoaded = true;
  }

  showClosestSchools(home) {
    if (!home || !hasCoordinates(home)) return;
    const schoolsWithDistance = this.homeService
      .getNearbySchoolsForHome(home, this.stateManager.get("schools"))
      .slice(0, 10);
    if (schoolsWithDistance.length === 0) return;
    this.elements.houseSchoolResults.textContent = `${schoolsWithDistance.length} nearby school${schoolsWithDistance.length !== 1 ? "s" : ""} found`;
  }

  showSchoolSuggestions(query) {
  const list = this.elements.schoolSuggestionsList;
  const normalized = normalizeSearchText(query);

  if (!list || !normalized) {
    this.clearSchoolSuggestions();
    return;
  }

  const matches = this.schoolService
    .searchSchools(normalized)
    .slice(0, 8);

  if (!matches.length) {
    this.clearSchoolSuggestions();
    return;
  }

  list.innerHTML = matches
    .map(
      school => `
        <div
          class="school-suggestion-item"
          data-school-id="${school.id}"
          tabindex="0"
          role="button"
          aria-label="Select ${school.name}"
        >
          <div class="school-title">${school.name}</div>

          ${
            school.level
              ? `<div class="school-sub">${school.level}</div>`
              : ""
          }

          ${
            school.formattedAddress
              ? `<div class="school-meta">${school.formattedAddress}</div>`
              : ""
          }
        </div>
      `
    )
    .join("");

  list.hidden = false;
  list.dataset.activeIndex = "-1";

  const items = Array.from(list.children);

  items.forEach(item => {
    const selectSchool = () => {
      const schoolId = Number(item.dataset.schoolId);

      const school = this.stateManager
        .get("schools")
        .find(entry => entry.id === schoolId);

      if (school) {
        this.elements.schoolSearchHome.value = school.name;
        this.clearSchoolSuggestions();
        this.searchHomesNearSchool();
      }
    };

    item.addEventListener("click", selectSchool);

    // 🔥 keyboard support (Enter / Space)
    item.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectSchool();
      }
    });
  });
}
  handleSuggestionKeyboard(event) {
    const list = this.elements.schoolSuggestionsList;
    if (!list || list.hidden) return;
    const items = Array.from(list.children);
    if (!items.length) return;
    let index = Number(list.dataset.activeIndex || -1);
    if (event.key === "ArrowDown") {
      event.preventDefault();
      index = Math.min(items.length - 1, index + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      index = Math.max(-1, index - 1);
    } else if (event.key === "Enter") {
      const active = items[index];
      if (active) {
        const schoolId = Number(active.dataset.schoolId);
        const school = this.stateManager.get("schools").find(entry => entry.id === schoolId);
        if (school) {
          this.elements.schoolSearchHome.value = school.name;
          this.clearSchoolSuggestions();
          this.searchHomesNearSchool();
        }
      }
      return;
    }
    items.forEach((item, itemIndex) => item.classList.toggle("active", itemIndex === index));
    list.dataset.activeIndex = String(index);
  }

  clearSchoolSuggestions() {
    const list = this.elements.schoolSuggestionsList;
    if (!list) return;
    list.innerHTML = "";
    list.hidden = true;
    list.dataset.activeIndex = "-1";
  }

  returnFromDetail() {
    this.currentHouseDetail = null;
    this.stateManager.set("currentHouseDetail", null);
    this.mapService.destroyDetailMap();
  }
}

export default AppShell;
