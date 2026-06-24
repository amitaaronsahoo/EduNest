function searchHomesNearSchool() {
  const query = normalizeSearchText(elements.schoolSearchHome.value);
  if (!query) {
    elements.resultsTitle.textContent = "Available Homes";
    state.filteredHomes = [...state.houses];
    renderHomes(state.filteredHomes);
    return;
  }
  const selectedSchool = state.schools.map(school => ({
    school,
    score: getSchoolMatchScore(school, query)
  })).filter(({
    score
  }) => Number.isFinite(score)).sort((a, b) => {
    if (a.score !== b.score) {
      return a.score - b.score;
    }
    if (a.school.searchName.length !== b.school.searchName.length) {
      return a.school.searchName.length - b.school.searchName.length;
    }
    const nameComparison = a.school.name.localeCompare(b.school.name);
    return nameComparison !== 0 ? nameComparison : a.school.id - b.school.id;
  })[0]?.school;
  if (!selectedSchool || !hasCoordinates(selectedSchool)) {
    elements.resultsTitle.textContent = "Homes Near Selected School";
    renderHomes([]);
    clearClosestSchools();
    return;
  }
  lastSelectedSchool = selectedSchool;
  const nearbyHomes = state.houses.filter(hasCoordinates).map(home => ({
    ...home,
    distanceToSchool: calculateDistanceInMiles(home.latitude, home.longitude, selectedSchool.latitude, selectedSchool.longitude)
  })).filter(home => home.distanceToSchool <= 5).sort((a, b) => a.distanceToSchool - b.distanceToSchool).map(({
    distanceToSchool,
    ...home
  }) => ({
    ...home,
    distanceToSchool
  }));

  // Render map and side results centered on the selected school
  elements.resultsTitle.textContent = `Homes Near ${selectedSchool.name}`;
  renderMapForSchool(nearbyHomes, selectedSchool);
  clearClosestSchools();
}