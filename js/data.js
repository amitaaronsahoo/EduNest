async function loadData() {
  try {
    const [housesResponse, schoolsResponse] = await Promise.all([
      fetch(DATA_PATHS.houses),
      fetch(DATA_PATHS.schools),
    ]);

    if (!housesResponse.ok || !schoolsResponse.ok) {
      throw new Error("Failed to load data");
    }

    const houses = await housesResponse.json();
    const schoolsGeoJson = await schoolsResponse.json();

    state.houses = houses.map((house, index) => ({
      id: index + 1,
      ...house,
      bedrooms: Number(house.bedrooms),
      bathrooms: Number(house.bathrooms),
      price: Number(house.price),
      longitude: parseCoordinate(house.longitude),
      latitude: parseCoordinate(house.latitude),
    }));

    state.schools = (schoolsGeoJson.features || [])
      .map((feature, index) => normalizeSchool(feature, index))
      .filter(Boolean);

    switchTab("schools");
    state.schoolsFiltered = [...state.schools];
    state.filteredHomes = [...state.houses];
    loadSavedHouses();
    renderSchoolsList();
    renderHomes(state.filteredHomes);
    renderSavedHouses();
  } catch (error) {
    console.error("Error loading data:", error);
    elements.results.innerHTML = '<div style="color: red; padding: 20px;">Error loading data. Please refresh the page.</div>';
  }
}

function initializeMap() {
  if (map) return;

  const mapDiv = document.getElementById("map");
  if (!mapDiv) return;

  map = L.map(mapDiv).setView([38.2, -85.8], 11);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  }).addTo(map);
  markersLayer = L.layerGroup().addTo(map);
}

function bindEvents() {
  if (elements.maxTuition) {
    elements.maxTuition.addEventListener("input", () => {
      elements.maxTuitionValue.textContent = currency(Number(elements.maxTuition.value));
      applySchoolFilters();
    });
  }

  document.querySelectorAll('input[name="schoolType"], input[name="gradeLevel"]').forEach((checkbox) => {
    checkbox.addEventListener("change", applySchoolFilters);
  });

  elements.schoolSearchHomeBtn.addEventListener("click", searchHomesNearSchool);
  elements.schoolSearchHome.addEventListener("input", (e) => {
    showSchoolSuggestions(e.target.value);
  });
  elements.AllSchoolBtn.addEventListener("click", searchHomesForAllSelectedSchools);

  elements.schoolSearchHome.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      moveSuggestionSelection(1);
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      moveSuggestionSelection(-1);
      return;
    }

    if (e.key === "Enter") {
      const handled = selectActiveSuggestion();
      if (handled) {
        e.preventDefault();
      }
    }
  });

  document.addEventListener("click", (e) => {
    const container = elements.schoolSuggestionsContainer;
    if (!container) return;
    if (container.contains(e.target) || elements.schoolSearchHome.contains(e.target)) return;
    clearSchoolSuggestions();
  });

  if (elements.applyFiltersBtn) {
    elements.applyFiltersBtn.addEventListener("click", applySchoolFilters);
  }

  if (elements.maxPriceHome) {
    elements.maxPriceHome.addEventListener("input", () => {
      elements.maxPriceValue.textContent = currency(Number(elements.maxPriceHome.value));
    });
  }

  if (elements.applyFiltersHomeBtn) {
    elements.applyFiltersHomeBtn.addEventListener("click", applyHomeFilters);
  }

  if (elements.houseMaxTuition) {
    elements.houseMaxTuition.addEventListener("input", () => {
      elements.houseMaxTuitionValue.textContent = String(elements.houseMaxTuition.value);
    });
  }

  if (elements.houseApplySchoolFiltersBtn) {
    elements.houseApplySchoolFiltersBtn.addEventListener("click", applyHouseDetailFilters);
  }

  document.querySelectorAll('input[name="houseSchoolType"], input[name="houseGradeLevel"]').forEach((checkbox) => {
    checkbox.addEventListener("change", applyHouseDetailFilters);
  });

  if (elements.detailBackBtn) {
    elements.detailBackBtn.addEventListener("click", returnFromDetail);
  }

  if (elements.schoolSearch) {
    elements.schoolSearch.addEventListener("input", () => {
      const rawQuery = elements.schoolSearch.value;
      const normalizedQuery = normalizeSearchText(rawQuery);
      let filtered = state.schoolsFiltered;

      if (normalizedQuery) {
        filtered = state.schoolsFiltered.filter((s) => s.searchName.includes(normalizedQuery));
      }

      renderSchoolsList(filtered, rawQuery);
    });
  }
}

window.toggleSavedHouse = toggleSavedHouse;
window.switchTab = switchTab;

document.addEventListener("DOMContentLoaded", () => {
  loadData().then(bindEvents).catch((err) => {
    console.error("Initialization error:", err);
  });
});