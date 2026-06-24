function applyHomeFilters() {
  const minBedrooms = Number(elements.minBedrooms.value);
  const minBathrooms = Number(elements.minBathrooms.value);
  const maxPrice = Number(elements.maxPriceHome.value);
  state.filteredHomes = state.houses.filter(home => home.bedrooms >= minBedrooms && home.bathrooms >= minBathrooms && home.price <= maxPrice);
  elements.homeResults.textContent = `${state.filteredHomes.length} home${state.filteredHomes.length !== 1 ? "s" : ""} found`;
  renderHomes(state.filteredHomes);
}

// ============================================
// DATA LOADING
// ============================================