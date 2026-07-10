import './AppShell.css';
import { UIComponent } from "../../core/UIComponent.js";
import { currency, generateZillowUrl } from "../../utils/formatters.js";
import { hasCoordinates } from "../../utils/validators.js";
import { normalizeSearchText } from "../../utils/normalizers.js";
import HouseDetailInfo from "../HouseDetailInfo/HouseDetailInfo.js";
import HomeCard from "../HomeCard/HomeCard.js";
import SchoolSearch from "../SchoolSearch/SchoolSearch.js";
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
    this.paginationState = {
      schools: 1,
      homes: 1,
      saved: 1
    };
    this.pendingViewRefresh = false;
  }

  render() {
    return `
      <div class="app-shell">
        <header class="app-shell__header">
          <h1>EduNest — Jefferson County Home & School Locator</h1>
        </header>
        <div class="app-shell__layout">
          <aside class="sidebar">
            <div class="sidebar__nav-panel">
              <h2>Navigation</h2>
              <div id="app-nav"></div>
            </div>

            <div class="sidebar__content-panel">
              <div id="schools-sidebar">
                <h2>Find Schools</h2>
                ${new SchoolSearch().render()}
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
                <label for="maxPriceHome">Max Price: <span id="maxPriceValue">1000000</span></label>
                <input id="maxPriceHome" type="range" min="50000" max="1000000" step="10000" value="1000000" />

                <label for="homeSort">Rank homes by</label>
                <select id="homeSort">
                  <option value="distance">Distance: Closest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="bedrooms-desc">Bedrooms: High to Low</option>
                  <option value="bathrooms-desc">Bathrooms: High to Low</option>
                  <option value="sqft-desc">Square Feet: High to Low</option>
                </select>

                <label for="homeResultsLimit">Homes shown</label>
                <select id="homeResultsLimit">
                  <option value="10">10 homes</option>
                  <option value="25" selected>25 homes</option>
                  <option value="50">50 homes</option>
                  <option value="100">100 homes</option>
                </select>

                <button id="applyFiltersHomeBtn" type="button">Apply Filters</button>
                <div id="homeResults" class="sidebar__status"></div>
              </div>

              <h2>Saved Homes</h2>
              <div id="savedHousesCount">0 homes saved</div>
              <div id="savedHousesList"></div>
            </div>
          </aside>

          <main class="app-shell__main">
            <section id="landing-content" class="app-section landing-section">
              <div class="landing-card">
                <h2>Choose a view</h2>
                <p>Pick a tab to browse schools, homes, or your saved properties.</p>
                <div class="landing-actions">
                  <button type="button" class="landing-action" data-tab="schools">📚 Schools</button>
                  <button type="button" class="landing-action" data-tab="homes">🏠 Homes</button>
                  <button type="button" class="landing-action" data-tab="saved">💾 Saved Homes</button>
                </div>
              </div>
            </section>

            <section id="schools-content" class="app-section">
              <div class="app-section__header">
                <h2>School Directory</h2>
                <p>Browse and search schools in Jefferson County</p>
              </div>
              <div id="schoolResults"></div>
              <div class="school-list">
                <div class="school-row__header">
                  <div>School Name</div>
                  <div>Address</div>
                  <div>Type</div>
                  <div>Grades</div>
                  <div>Action</div>
                </div>
                <div id="schoolsTableBody"></div>
              </div>
              <div id="schoolPagination" class="pagination"></div>
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
              <div id="homePagination" class="pagination"></div>
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
              <div id="savedPagination" class="pagination"></div>
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
      ["houses", "schools", "filteredHomes", "schoolsFiltered", "currentTab", "currentHouseDetail", "dataLoadError", "isLoadingData"],
      () => this.handleStateChange()
    );
    this.bootstrap();
  }

  cacheElements() {
    this.elements = {
      appNav: this.querySelector("#app-nav"),
      landingContent: this.querySelector("#landing-content"),
      sidebar: this.querySelector(".sidebar"),
      schoolsSidebar: this.querySelector("#schools-sidebar"),
      homesSidebar: this.querySelector("#homes-sidebar"),
      schoolsContent: this.querySelector("#schools-content"),
      homesContent: this.querySelector("#homes-content"),
      houseDetailsContent: this.querySelector("#house-details-content"),
      savedContent: this.querySelector("#saved-content"),
      schoolSearch: this.querySelector("#schoolSearch"),
      schoolSearchBtn: this.querySelector("#schoolSearchBtn"),
      schoolSearchSuggestionsContainer: this.querySelector("#schoolSearchSuggestionsContainer"),
      schoolSearchSuggestionsList: this.querySelector("#schoolSearchSuggestionsList"),
      maxTuition: this.querySelector("#maxTuition"),
      maxTuitionValue: this.querySelector("#maxTuitionValue"),
      applyFiltersBtn: this.querySelector("#applyFiltersBtn"),
      schoolResults: this.querySelector("#schoolResults"),
      schoolsTableBody: this.querySelector("#schoolsTableBody"),
      schoolPagination: this.querySelector("#schoolPagination"),
      allSchoolBtn: this.querySelector("#allSchoolBtn"),
      schoolSearchHome: this.querySelector("#schoolSearchHome"),
      schoolSuggestionsList: this.querySelector("#schoolSuggestionsList"),
      schoolSearchHomeBtn: this.querySelector("#schoolSearchHomeBtn"),
      minBedrooms: this.querySelector("#minBedrooms"),
      minBathrooms: this.querySelector("#minBathrooms"),
      maxPriceHome: this.querySelector("#maxPriceHome"),
      maxPriceValue: this.querySelector("#maxPriceValue"),
      homeSort: this.querySelector("#homeSort"),
      homeResultsLimit: this.querySelector("#homeResultsLimit"),
      applyFiltersHomeBtn: this.querySelector("#applyFiltersHomeBtn"),
      homeResults: this.querySelector("#homeResults"),
      resultsTitle: this.querySelector("#resultsTitle"),
      results: this.querySelector("#results"),
      homePagination: this.querySelector("#homePagination"),
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
      savedPagination: this.querySelector("#savedPagination"),
      emptyState: this.querySelector("#emptyState")
    };
  }

  bindEvents() {
    this.elements.schoolSearch?.addEventListener("input", event => {
      this.showSchoolSearchSuggestions(event.target.value);
      this.renderSchoolsList(null, event.target.value);
    });
    this.elements.schoolSearch?.addEventListener("keydown", event => this.handleSchoolSearchKeyboard(event));
    this.elements.schoolSearchBtn?.addEventListener("click", () => {
      const query = this.elements.schoolSearch?.value || "";
      this.clearSchoolSearchSuggestions();
      this.renderSchoolsList(null, query);
    });
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
    this.elements.homeSort?.addEventListener("change", () => this.applyHomeFilters());
    this.elements.homeResultsLimit?.addEventListener("change", () => {
      this.setPaginationPage("homes", 1);
      this.applyHomeFilters();
    });
    this.elements.detailBackBtn?.addEventListener("click", () => this.returnFromDetail());
    this.elements.houseMaxTuition?.addEventListener("input", () => {
      this.elements.houseMaxTuitionValue.textContent = String(this.elements.houseMaxTuition.value);
      this.applyHouseDetailFilters();
    });
    this.elements.houseApplySchoolFiltersBtn?.addEventListener("click", () => this.applyHouseDetailFilters());

    this.querySelector("#houseNearbySchools")?.addEventListener("click", event => {
      const btn = event.target.closest('.view-school-btn');
      if (!btn) return;
      const schoolId = Number(btn.dataset.schoolId);
      const school = this.stateManager.get("schools").find(s => s.id === schoolId);
      if (!school) return;
      event.preventDefault();
      event.stopPropagation();
      this.viewSchoolOnDetailMap(school);
    });

    document.addEventListener("click", event => {
      const container = this.elements.schoolSearchSuggestionsContainer;
      const input = this.elements.schoolSearch;
      if (!container || !input) return;
      if (container.contains(event.target) || input.contains(event.target)) return;
      this.clearSchoolSearchSuggestions();
    });

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
      const homeCard = event.target.closest("[data-home-id]");
      if (!homeCard) return;
      const homeId = Number(homeCard.dataset.homeId);
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
      this.returnFromDetail();
    });

    this.querySelector("#landing-content")?.addEventListener("click", event => {
      const button = event.target.closest("[data-tab]");
      if (!button) return;
      this.switchTab(button.dataset.tab);
      this.renderSavedHouses();
      this.returnFromDetail();
    });

    this.elements.schoolPagination?.addEventListener("click", event => {
      const button = event.target.closest("button[data-page]");
      if (!button) return;
      this.setPaginationPage("schools", Number(button.dataset.page));
      this.renderSchoolsList();
    });

    this.elements.homePagination?.addEventListener("click", event => {
      const button = event.target.closest("button[data-page]");
      if (!button) return;
      this.setPaginationPage("homes", Number(button.dataset.page));
      this.renderHomes(this.stateManager.get("filteredHomes"));
    });

    this.elements.savedPagination?.addEventListener("click", event => {
      const button = event.target.closest("button[data-page]");
      if (!button) return;
      this.setPaginationPage("saved", Number(button.dataset.page));
      this.renderSavedHouses();
    });
  }

  async bootstrap() {
    this.stateManager.initializeAppState();
    this.switchTab("landing");
    try {
      await this.dataService.loadAppData();
      this.savedHousesService.loadSavedHouses();
      this.syncView();
    } catch (error) {
      this.elements.results.innerHTML = `<div class="error-state">Error loading data. Please refresh the page.</div>`;
    }
  }

  handleStateChange() {
    if (this.stateManager?.locked) {
      this.queueViewRefresh();
      return;
    }

    this.syncView();
  }

  queueViewRefresh() {
    if (this.pendingViewRefresh) return;

    this.pendingViewRefresh = true;
    setTimeout(() => {
      this.pendingViewRefresh = false;
      if (this.stateManager?.locked) {
        this.queueViewRefresh();
        return;
      }
      this.syncView();
    }, 0);
  }

  syncView() {
    if (this.stateManager?.locked) {
      this.queueViewRefresh();
      return;
    }

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
      <button type="button" style="width: 200px" data-tab="schools" class="${activeTab === "schools" ? "is-active" : ""}">📚 Schools</button>
      <button type="button" style="width: 200px" data-tab="homes" class="${activeTab === "homes" ? "is-active" : ""}">🏠 Homes</button>
      <button type="button" style="width: 200px" data-tab="saved" class="${activeTab === "saved" ? "is-active" : ""}">💾 Saved Homes</button>
    `;
  }

  syncTabVisibility() {
    const tab = this.stateManager.get("currentTab") || "landing";
    const showingDetail = this.currentHouseDetail !== null;

    this.elements.landingContent.hidden = tab !== "landing";

    // Sidebar
    this.elements.sidebar.hidden = tab === "landing";
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

  setPaginationPage(section, page) {
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    this.paginationState[section] = safePage;
  }

  renderPaginationControls(container, totalItems, pageSize, section) {
    if (!container) return;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const currentPage = Math.min(Math.max(this.paginationState[section] || 1, 1), totalPages);
    this.paginationState[section] = currentPage;

    if (totalPages <= 1) {
      container.innerHTML = "";
      container.hidden = true;
      return;
    }

    const pages = [];
    for (let index = 1; index <= totalPages; index += 1) {
      pages.push(`<button type="button" class="pagination__button ${index === currentPage ? "is-active" : ""}" data-page="${index}">${index}</button>`);
    }

    container.innerHTML = `
      <div class="pagination__bar">
        <button type="button" class="pagination__button" data-page="${Math.max(1, currentPage - 1)}" ${currentPage === 1 ? "disabled" : ""}>Previous</button>
        <div class="pagination__pages">${pages.join("")}</div>
        <button type="button" class="pagination__button" data-page="${Math.min(totalPages, currentPage + 1)}" ${currentPage === totalPages ? "disabled" : ""}>Next</button>
      </div>
    `;
    container.hidden = false;
  }

  applySchoolFilters() {
    const types = Array.from(this.querySelectorAll('input[name="schoolType"]:checked')).map(input => input.value);
    const levels = Array.from(this.querySelectorAll('input[name="gradeLevel"]:checked')).map(input => input.value);
    const maxTuition = Number(this.elements.maxTuition?.value || 5000);
    this.setPaginationPage("schools", 1);
    this.schoolService.applyFilters({ types, levels, maxTuition });
    this.renderSchoolsList();
  }

  applyHomeFilters() {
    const minBedrooms = Number(this.elements.minBedrooms?.value || 0);
    const minBathrooms = Number(this.elements.minBathrooms?.value || 0);
    const maxPrice = Number(this.elements.maxPriceHome?.value || Number.POSITIVE_INFINITY);
    const sortBy = this.elements.homeSort?.value || "distance";

    const lastSelectedSchools = this.stateManager.get("lastSelectedSchools") || [];
    const lastSelectedSchool = this.stateManager.get("lastSelectedSchool");
    const selectedSchools = lastSelectedSchools.length
      ? lastSelectedSchools
      : lastSelectedSchool
        ? [lastSelectedSchool]
        : [];

    const baseHomes = selectedSchools.length > 1
      ? this.homeService.getNearbyHomesForSchools(selectedSchools)
      : selectedSchools.length === 1
        ? this.homeService.getNearbyHomesForSchool(selectedSchools[0])
        : this.stateManager.get("houses");

    const homes = this.homeService.applyFilters({
      homes: baseHomes,
      minBedrooms,
      minBathrooms,
      maxPrice,
      sortBy
    });

    this.setPaginationPage("homes", 1);
    this.renderHomes(homes, selectedSchools);
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

    const pageSize = 50;
    const currentPage = this.paginationState.schools || 1;
    const totalItems = schoolsToRender.length;
    const startIndex = (currentPage - 1) * pageSize;
    const visibleSchools = schoolsToRender.slice(startIndex, startIndex + pageSize);

    this.elements.schoolResults.textContent = `${schoolsToRender.length} school${schoolsToRender.length !== 1 ? "s" : ""} found`;
    this.elements.schoolsTableBody.innerHTML = visibleSchools.length
      ? visibleSchools
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
    this.renderPaginationControls(this.elements.schoolPagination, totalItems, pageSize, "schools");
  }

  showSchoolSearchSuggestions(query) {
    const list = this.elements.schoolSearchSuggestionsList;
    const normalized = normalizeSearchText(query);
    if (!list || !normalized) {
      this.clearSchoolSearchSuggestions();
      return;
    }

    const matches = this.schoolService.searchSchools(normalized, this.stateManager.get("schools"), 8);
    if (matches.length === 0) {
      this.clearSchoolSearchSuggestions();
      return;
    }

    list.innerHTML = matches
      .map(
        school => `
          <div class="school-suggestion-item" data-school-id="${school.id}" tabindex="0">
            <strong>${school.name}</strong>
            ${school.level ? `<div class="school-meta">${school.level}</div>` : ""}
            ${school.formattedAddress ? `<div class="school-meta">${school.formattedAddress}</div>` : ""}
          </div>
        `
      )
      .join("");
    list.hidden = false;
    list.dataset.activeIndex = "-1";

    Array.from(list.children).forEach(item => {
      item.addEventListener("click", () => {
        const schoolId = Number(item.dataset.schoolId);
        const school = this.stateManager.get("schools").find(entry => entry.id === schoolId);
        if (school) {
          this.elements.schoolSearch.value = school.name;
          this.clearSchoolSearchSuggestions();
          this.renderSchoolsList(null, school.name);
        }
      });
    });
  }

  handleSchoolSearchKeyboard(event) {
    const list = this.elements.schoolSearchSuggestionsList;
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
      event.preventDefault();
      const active = items[index];
      if (active) {
        const schoolId = Number(active.dataset.schoolId);
        const school = this.stateManager.get("schools").find(entry => entry.id === schoolId);
        if (school) {
          this.elements.schoolSearch.value = school.name;
          this.clearSchoolSearchSuggestions();
          this.renderSchoolsList(null, school.name);
        }
      } else {
        this.clearSchoolSearchSuggestions();
        this.renderSchoolsList(null, this.elements.schoolSearch?.value || "");
      }
      return;
    }

    items.forEach((item, itemIndex) => item.classList.toggle("active", itemIndex === index));
    list.dataset.activeIndex = String(index);
  }

  clearSchoolSearchSuggestions() {
    const list = this.elements.schoolSearchSuggestionsList;
    if (!list) return;
    list.innerHTML = "";
    list.hidden = true;
    list.dataset.activeIndex = "-1";
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
  ? `
      <div style="margin-top:8px; padding:8px 9px; border-radius:10px; background:#fff6c9; border:1px solid #f2d96b;">
        ${distances.map(entry => `
          <div style="font-size:12px; color:#123a6e; margin-bottom:3px;">
            ${entry.distance.toFixed(2)} miles from ${entry.school}
          </div>
        `).join("")}
      </div>
    `
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
      this.toggleSavedHouse(home, { skipDetailView: true, skipHomeRefresh: true });
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

  renderMultiSchoolHomeMap(homes, schools = [], startingIndex = 0) {
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
      icon: (home, index) => this.mapService.createNumberedHomeMarkerIcon(startingIndex + index),
      title: home => home.formattedAddress,
      tooltipText: home => `
        <strong>${home.formattedAddress || "Unknown Address"}</strong><br>
        Price: ${currency(home.price)}<br>
        Beds: ${home.bedrooms ?? "N/A"} • Baths: ${home.bathrooms ?? "N/A"}
      `,
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
    const sortBy = this.elements.homeSort?.value || "distance";
    const homeList = this.homeService.sortHomes(Array.isArray(homes) ? homes : [], sortBy);
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

    const pageSize = Number(this.elements.homeResultsLimit?.value || 25);
    const currentPage = this.paginationState.homes || 1;
    const startIndex = (currentPage - 1) * pageSize;
    const visibleHomes = homeList.slice(startIndex, startIndex + pageSize);

    this.elements.results.innerHTML = visibleHomes.length
      ? visibleHomes
          .map((home, index) => new HomeCard({
            home,
            index: startIndex + index,
            isSaved: this.savedHousesService.isHouseSaved(home),
            onSelect: selectedHome => this.renderHouseDetailView(selectedHome),
            onToggleSave: selectedHome => this.toggleSavedHouse(selectedHome)
          }).render())
          .join("")
      : '<div class="empty-state">No homes found. Try adjusting your filters.</div>';

    if (homeList.length === 0) {
      this.elements.homeResults.textContent = "0 homes found";
    } else {
      const firstVisible = startIndex + 1;
      const lastVisible = startIndex + visibleHomes.length;
      this.elements.homeResults.textContent =
        visibleHomes.length === homeList.length
          ? `${homeList.length} home${homeList.length !== 1 ? "s" : ""} found`
          : `Showing ${firstVisible}-${lastVisible} of ${homeList.length} homes found`;
    }
    this.renderPaginationControls(this.elements.homePagination, homeList.length, pageSize, "homes");

    if (selectedSchools.length > 1) {
      this.renderMultiSchoolHomeMap(visibleHomes, schoolsToRender, startIndex);
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

    this.mapService.addHomeMarkers(visibleHomes, null, {
      mapType: "main",
      clearExisting: false,
      icon: (home, index) => this.mapService.createNumberedHomeMarkerIcon(startIndex + index),
      title: home => home.formattedAddress,
      tooltipText: home => `
        <strong>${home.formattedAddress || "Unknown Address"}</strong><br>
        Price: ${currency(home.price)}<br>
        Beds: ${home.bedrooms ?? "N/A"} • Baths: ${home.bathrooms ?? "N/A"}
      `,
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
              </div>
            `)
            .join("");
    const pageSize = 100;
    const currentPage = this.paginationState.saved || 1;
    const startIndex = (currentPage - 1) * pageSize;
    const visibleSavedHouses = savedHouses.slice(startIndex, startIndex + pageSize);

    this.elements.savedHouses.innerHTML =
      visibleSavedHouses.length === 0
        ? '<div class="empty-state">No homes saved yet</div>'
        : visibleSavedHouses
            .map(home => new HomeCard({
              home,
              isSaved: true,
              onSelect: selectedHome => this.renderHouseDetailView(selectedHome),
              onToggleSave: selectedHome => this.toggleSavedHouse(selectedHome)
            }).render())
            .join("");
    this.renderPaginationControls(this.elements.savedPagination, savedHouses.length, pageSize, "saved");
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
    const detailInfo = new HouseDetailInfo({
      home: {
        ...home,
        zip: home.zip || ""
      },
      isSaved: this.savedHousesService.isHouseSaved(home)
    });
    this.elements.houseDetailInfo.innerHTML = detailInfo.render();
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
          <div style="margin-top:6px;">
            <button type="button" class="view-school-btn" data-school-id="${school.id}" style="border:none;border-radius:8px;padding:6px 8px;background:#1f4f99;color:#fff;cursor:pointer;font-weight:600;">View on map</button>
          </div>
        </div>
      `)
      .join("");
  }

  viewSchoolOnDetailMap(school) {
    if (!school || !this.currentHouseDetail) return;

    // Get homes near the selected school
    const nearbyHomes = this.homeService.getNearbyHomesForSchool(school);

    // Re-initialize detail map and show the selected school and nearby homes
    try {
      this.mapService.destroyDetailMap();
      this.mapService.initializeDetailMap("detailMap");
    } catch (error) {
      console.error("Failed to initialize detail map for school view:", error);
      return;
    }

    this.mapService.addSchoolMarkers([school], null, {
      mapType: "detail",
      clearExisting: true,
      popupText: s => this.buildSchoolPopupContent(s),
      popupOptions: { className: "modern-popup", closeButton: false, maxWidth: 330, minWidth: 290 },
      onPopupOpen: (marker, s) => this.attachSchoolPopupHandlers(marker, s)
    });

    this.mapService.addHomeMarkers(nearbyHomes, null, {
      mapType: "detail",
      clearExisting: false,
      popupText: h => this.buildHomePopupContent(h, [school]),
      popupOptions: { className: "modern-popup", closeButton: false, maxWidth: 330, minWidth: 290 },
      onPopupOpen: (marker, h) => this.attachHomePopupHandlers(marker, h)
    });

    this.mapService.invalidateDetailMapSize();
  }

  toggleSavedHouse(home, options = {}) {
    if (!home) return;
    this.savedHousesService.toggleSavedHouse(home);
    this.renderSavedHouses();

    if (!options.skipDetailView && this.currentHouseDetail?.id === home.id) {
      const detailInfo = new HouseDetailInfo({
        home: {
          ...home,
          zip: home.zip || ""
        },
        isSaved: this.savedHousesService.isHouseSaved(home)
      });
      this.elements.houseDetailInfo.innerHTML = detailInfo.render();
    }
  }

  searchHomesNearSchool(selectedSchool = null) {
    const query = normalizeSearchText(this.elements.schoolSearchHome?.value || "");
    const resolvedSchool = selectedSchool || this.schoolService.findBestSchoolMatch(query);

    if (!resolvedSchool || !hasCoordinates(resolvedSchool)) {
      this.lastSelectedSchool = null;
      this.stateManager.set("lastSelectedSchool", null);
      this.stateManager.set("lastSelectedSchools", []);
      this.elements.resultsTitle.textContent = "Available Homes";
      this.renderHomes(this.stateManager.get("houses"), []);
      return;
    }

    this.elements.schoolSearchHome.value = resolvedSchool.name;
    this.lastSelectedSchool = resolvedSchool;
    this.stateManager.set("lastSelectedSchool", resolvedSchool);
    this.stateManager.set("lastSelectedSchools", [resolvedSchool]);

    const sortBy = this.elements.homeSort?.value || "distance";
    const nearbyHomes = this.homeService.sortHomes(
      this.homeService.getNearbyHomesForSchool(resolvedSchool),
      sortBy
    );
    this.stateManager.set("filteredHomes", nearbyHomes);
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
    this.stateManager.set("lastSelectedSchool", null);
    this.stateManager.set("lastSelectedSchools", selectedSchools);

    const sortBy = this.elements.homeSort?.value || "distance";
    const allNearbyHomes = this.homeService.sortHomes(
      this.homeService.getNearbyHomesForSchools(selectedSchools),
      sortBy
    );

    this.stateManager.set("filteredHomes", allNearbyHomes);

    this.elements.resultsTitle.textContent = `Homes Near: ${selectedSchools.map(school => school.name).join(", ")}`;
    this.switchTab("homes");
    this.renderHomes(allNearbyHomes, selectedSchools);
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
