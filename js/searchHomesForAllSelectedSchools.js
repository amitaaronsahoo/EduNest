// Find all homes nearby the selected schools (within 5 miles)
function searchHomesForAllSelectedSchools() {
  const selectedSchools = getCheckedSchools();
  if (selectedSchools.length === 0) {
    alert("Please select at least one school");
    return;
  }
  const nearbyHomesMap = new Map();
  selectedSchools.forEach(school => {
    if (!hasCoordinates(school)) return;
    state.houses.filter(hasCoordinates).forEach(home => {
      const distance = calculateDistanceInMiles(home.latitude, home.longitude, school.latitude, school.longitude);

      // If home is within 5 miles of this school
      if (distance <= 5) {
        if (!nearbyHomesMap.has(home.id)) {
          nearbyHomesMap.set(home.id, {
            ...home,
            nearbySchools: []
          });
        }
        // Track which school(s) this home is near
        nearbyHomesMap.get(home.id).nearbySchools.push({
          school: school.name,
          distance: distance
        });
      }
    });
  });
  const allNearbyHomes = Array.from(nearbyHomesMap.values());
  renderMapForSchool(allNearbyHomes, ...selectedSchools);
  document.getElementById("schools-content").style.display = "none";
  document.getElementById("homes-content").style.display = "block";
  document.getElementById("schools-sidebar").style.display = "none";
  document.getElementById("homes-sidebar").style.display = "block";
  document.querySelectorAll(".tab-btn").forEach(btn => btn.style.opacity = "0.6");
  document.getElementById("tab-homes").style.opacity = "1";
  // Update title to show schools searched
  const schoolNames = selectedSchools.map(s => s.name).join(", ");
  elements.resultsTitle.textContent = `Homes Near: ${schoolNames}`;
  state.filteredHomes = allNearbyHomes;
  elements.homeResults.textContent = `${allNearbyHomes.length} home${allNearbyHomes.length !== 1 ? "s" : ""} found near selected school${selectedSchools.length !== 1 ? "s" : ""}`;
}