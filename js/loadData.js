// ============================================
// DATA LOADING
// ============================================

async function loadData() {
  try {
    const [housesResponse, schoolsResponse] = await Promise.all([fetch(DATA_PATHS.houses), fetch(DATA_PATHS.schools)]);
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
      latitude: parseCoordinate(house.latitude)
    }));
    state.schools = (schoolsGeoJson.features || []).map((feature, index) => normalizeSchool(feature, index)).filter(Boolean);
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

// ============================================
// EVENT BINDING
// ============================================

// Get all checked school checkboxes from the schools list