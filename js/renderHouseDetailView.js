function renderHouseDetailView(home) {
  if (!home || !hasCoordinates(home)) return;
  currentHouseDetail = home;
  document.getElementById("homes-content").style.display = "none";
  document.getElementById("saved-content").style.display = "none";
  document.getElementById("house-details-content").style.display = "block";
  document.getElementById("schools-sidebar").style.display = "none";
  document.getElementById("homes-sidebar").style.display = "none";
  //document.querySelectorAll(".tab-btn").forEach((btn) => (btn.style.opacity = "0.6"));

  elements.houseDetailSubtitle.textContent = `Showing schools near ${home.formattedAddress}`;
  elements.houseSchoolResults.textContent = "Loading nearby schools...";
  const isSaved = isHouseSaved(home);
  elements.houseDetailInfo.innerHTML = `
      <h3>${home.formattedAddress}</h3>
      <p><strong>Type:</strong> ${home.propertyType || "N/A"}</p>
      <p><strong>Bedrooms:</strong> ${home.bedrooms} • <strong>Bathrooms:</strong> ${home.bathrooms}</p>
      <p><strong>Price:</strong> ${currency(home.price)}</p>
      <div style="display: flex; gap: 0.5rem;">
        <button onclick="window.open('${generateZillowUrl(home.formattedAddress)}', '_blank')" style="flex: 1;">View on Zillow</button>
        <button type="button" onclick="toggleSavedHouse({id: ${home.id}, formattedAddress: '${home.formattedAddress}', price: ${home.price}, bedrooms: ${home.bedrooms}, bathrooms: ${home.bathrooms}, propertyType: '${home.propertyType}'})" data-save-home-id="${home.id}" class="${isSaved ? 'saved' : ''}" style="flex: 1;">${isSaved ? 'Remove' : 'Save'}</button>
      </div>
    `;
  const nearbySchools = state.schools.filter(hasCoordinates).map(school => ({
    ...school,
    distance: calculateDistanceInMiles(home.latitude, home.longitude, school.latitude, school.longitude)
  })).filter(school => school.distance <= 5).sort((a, b) => a.distance - b.distance);
  const visibleSchools = filterHouseSchools(nearbySchools);
  renderHouseNearbySchoolsList(visibleSchools);
  renderHouseDetailMap(home, visibleSchools);
}