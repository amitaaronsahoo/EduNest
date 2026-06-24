function renderHomes(homes) {
  elements.results.innerHTML = "";

  if (homes.length === 0) {
    elements.emptyState.textContent = "No homes found. Try adjusting your filters.";
    elements.emptyState.hidden = false;
    return;
  }

  elements.emptyState.hidden = true;

  homes.forEach((home) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${home.formattedAddress}</h3>
      <p><strong>Type:</strong> ${home.propertyType || "N/A"}</p>
      <p><strong>Bedrooms:</strong> ${home.bedrooms} • <strong>Bathrooms:</strong> ${home.bathrooms}</p>
      <p><strong>Square Feet:</strong> ${home.squareFeet ?? "N/A"}</p>
      <p><strong>Price:</strong> ${currency(home.price)}</p>
    `;
    card.onclick = () => {
      renderHouseDetailView(home);
    };
    elements.results.appendChild(card);
  });

  updateSaveButtons();
  initializeMap();

  if (map && markersLayer) {
    markersLayer.clearLayers();
    const bounds = [];

    homes.forEach((home) => {
      if (!hasCoordinates(home)) return;
      const latLng = [home.latitude, home.longitude];
      bounds.push(latLng);
      const marker = L.marker(latLng);
      marker.on("click", () => {
        renderHouseDetailView(home);
      });
      marker.addTo(markersLayer);
    });

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    setTimeout(() => {
      if (map) {
        map.invalidateSize();
      }
    }, 150);
  }
}

function getHouseDetailSchoolFilters() {
  const selectedTypes = Array.from(document.querySelectorAll('input[name="houseSchoolType"]:checked')).map((x) => x.value);
  const selectedGrades = Array.from(document.querySelectorAll('input[name="houseGradeLevel"]:checked')).map((x) => x.value);
  const maxTuition = Number(elements.houseMaxTuition?.value || 0);

  return {
    selectedTypes,
    selectedGrades,
    maxTuition,
  };
}

function filterHouseSchools(schools) {
  const { selectedTypes, selectedGrades } = getHouseDetailSchoolFilters();

  return schools.filter((school) => {
    const typeMatch = selectedTypes.length === 0 || selectedTypes.some((t) => school.type?.includes(t));
    const gradeMatch = selectedGrades.length === 0 || selectedGrades.some((g) => school.level?.includes(g));
    return typeMatch && gradeMatch;
  });
}

function initializeDetailMap(bounds) {
  if (detailMap) return;

  const detailMapDiv = document.getElementById("detailMap");
  if (!detailMapDiv) return;

  detailMap = L.map(detailMapDiv).setView(bounds, 10);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  }).addTo(detailMap);
  detailMarkersLayer = L.layerGroup().addTo(detailMap);
}

function renderHouseDetailView(home) {
  if (!home || !hasCoordinates(home)) return;

  currentHouseDetail = home;
  document.getElementById("homes-content").style.display = "none";
  document.getElementById("saved-content").style.display = "none";
  document.getElementById("house-details-content").style.display = "block";
  document.getElementById("schools-sidebar").style.display = "none";
  document.getElementById("homes-sidebar").style.display = "none";

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

  const nearbySchools = state.schools
    .filter(hasCoordinates)
    .map((school) => ({
      ...school,
      distance: calculateDistanceInMiles(home.latitude, home.longitude, school.latitude, school.longitude),
    }))
    .filter((school) => school.distance <= 5)
    .sort((a, b) => a.distance - b.distance);

  const visibleSchools = filterHouseSchools(nearbySchools);
  renderHouseNearbySchoolsList(visibleSchools);
  renderHouseDetailMap(home, visibleSchools);
}

function renderHouseDetailMap(home, schools) {
  const houseLatLng = [home.latitude, home.longitude];
  const bounds = [houseLatLng];

  initializeDetailMap(houseLatLng);
  if (!detailMap || !detailMarkersLayer) return;

  detailMarkersLayer.clearLayers();

  const houseMarker = L.marker(houseLatLng, { title: home.formattedAddress });
  houseMarker.bindPopup(`
    <div style="min-width:220px;">
      <h3>${home.formattedAddress}</h3>
      <p><strong>Price:</strong> ${currency(home.price)}</p>
      <p><strong>Bedrooms:</strong> ${home.bedrooms} • <strong>Bathrooms:</strong> ${home.bathrooms}</p>
    </div>
  `);
  houseMarker.addTo(detailMarkersLayer);

  schools.forEach((school) => {
    if (!hasCoordinates(school)) return;
    const schoolLatLng = [school.latitude, school.longitude];
    bounds.push(schoolLatLng);

    const schoolIcon = L.icon({
      iconUrl: SCHOOL_ICON_URL,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    const schoolMarker = L.marker(schoolLatLng, {
      title: school.name,
      icon: schoolIcon,
    });
    schoolMarker.bindPopup(`
      <div style="min-width:220px;">
        <h4>${school.name}</h4>
        <div style="margin-bottom:4px; color:#475569;">${school.level || ""} ${school.type ? '• ' + school.type : ''}</div>
        <div>${school.formattedAddress || ""}</div>
        <div style="margin-top:6px; font-size:0.9rem; color:#475569;">${school.distance.toFixed(2)} miles away</div>
      </div>
    `);
    schoolMarker.addTo(detailMarkersLayer);
  });

  if (bounds.length === 1) {
    detailMap.setView(houseLatLng, 14);
  } else {
    detailMap.fitBounds(bounds, { padding: [50, 50] });
    detailMap.setView(detailMap.getCenter(), 12);
  }

  setTimeout(() => {
    if (detailMap) {
      detailMap.invalidateSize();
    }
  }, 150);
}

function renderHouseNearbySchoolsList(schools) {
  if (!elements.houseNearbySchools) return;

  elements.houseNearbySchools.innerHTML = "";
  if (schools.length === 0) {
    elements.houseSchoolResults.textContent = "No nearby schools found for this house.";
    elements.houseNearbySchools.innerHTML = '<div style="color:#475569;">Try adjusting the school filters.</div>';
    return;
  }

  elements.houseSchoolResults.textContent = `${schools.length} nearby school${schools.length !== 1 ? "s" : ""} found`;

  schools.forEach((school) => {
    const card = document.createElement("div");
    card.style.cssText = "padding:14px; border:1px solid #e5e7eb; border-radius:12px; background:#fff;";
    card.innerHTML = `
      <strong>${school.name}</strong>
      <div style="margin:6px 0 4px; color:#475569; font-size:0.95rem;">${school.level || ""} ${school.type ? '• ' + school.type : ''}</div>
      <div style="font-size:0.9rem; color:#475569;">${school.formattedAddress || ""}</div>
      <div style="margin-top:8px; font-size:0.9rem; color:#475569;">${school.distance.toFixed(2)} miles away</div>
    `;
    elements.houseNearbySchools.appendChild(card);
  });
}

function applyHouseDetailFilters() {
  if (!currentHouseDetail) return;
  renderHouseDetailView(currentHouseDetail);
}

function returnFromDetail() {
  if (currentTab === "saved") {
    document.getElementById("house-details-content").style.display = "none";
    document.getElementById("homes-content").style.display = "none";
    document.getElementById("homes-sidebar").style.display = "none";
    document.getElementById("schools-sidebar").style.display = "none";
    document.getElementById("saved-content").style.display = "block";
    document.querySelectorAll(".tab-btn").forEach((btn) => (btn.style.opacity = "0.6"));
    document.getElementById("tab-saved").style.opacity = "1";
  } else {
    document.getElementById("house-details-content").style.display = "none";
    document.getElementById("homes-content").style.display = "block";
    document.getElementById("homes-sidebar").style.display = "block";
    document.getElementById("schools-sidebar").style.display = "none";
    document.querySelectorAll(".tab-btn").forEach((btn) => (btn.style.opacity = "0.6"));
    document.getElementById("tab-homes").style.opacity = "1";

    setTimeout(() => {
      if (map) {
        map.invalidateSize();
      }
    }, 120);
  }
}

function populateHomeResults(homes) {
  elements.results.innerHTML = "";
  elements.emptyState.hidden = homes.length !== 0;

  homes.forEach((home) => {
    elements.results.appendChild(createHomeCard(home));
  });

  updateSaveButtons();
}

function renderMapForSchool(nearbyHomes, ...school) {
  lastSelectedSchool = school || [];
  lastNearbyHomes = nearbyHomes || [];

  if (!map) {
    map = L.map("map").setView([37.8, -85], 4);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(map);
    markersLayer = L.layerGroup().addTo(map);
  }

  markersLayer.clearLayers();
  const bounds = [];

  lastSelectedSchool.forEach((schoolItem) => {
    const schoolLatLng = [schoolItem.latitude, schoolItem.longitude];
    bounds.push(schoolLatLng);

    const defaultSvg = encodeURIComponent("<?xml version=\"1.0\" encoding=\"UTF-8\"?><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%231f4f99'><path d='M12 2l7 4v6c0 5-3 9-7 11-4-2-7-6-7-11V6l7-4z'/><path d='M11 11h2v6h-2z' fill='%23fff'/></svg>");
    const iconUrl = SCHOOL_ICON_URL || `data:image/svg+xml;utf8,${defaultSvg}`;

    const schoolIcon = L.icon({
      iconUrl,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -36],
    });

    const schoolMarker = L.marker(schoolLatLng, { title: schoolItem.name, icon: schoolIcon });
    schoolMarker.bindPopup(`
      <div style="min-width:220px">
        <h3>${schoolItem.name}</h3>
        <div class="school-meta">${schoolItem.level || ""} ${schoolItem.type ? '• ' + schoolItem.type : ''}</div>
        ${schoolItem.formattedAddress ? `<div class="school-meta">${schoolItem.formattedAddress}</div>` : ''}
        ${schoolItem.phone ? `<div class="school-meta">${schoolItem.phone}</div>` : ''}
        ${schoolItem.website ? `<div class="school-meta"><a href="${schoolItem.website}" target="_blank" rel="noopener noreferrer">Website</a></div>` : ''}
      </div>
    `);
    schoolMarker.addTo(markersLayer);
  });

  nearbyHomes.forEach((home) => {
    if (!hasCoordinates(home)) return;
    const latLng = [home.latitude, home.longitude];
    bounds.push(latLng);

    const marker = L.marker(latLng);

    let message = `
      <div style="min-width:220px">
        <h3>${home.formattedAddress}</h3>
        <p><strong>Price:</strong> ${currency(home.price)}</p>
        <p><strong>Bedrooms:</strong> ${home.bedrooms} • <strong>Bathrooms:</strong> ${home.bathrooms}</p>
      `;

    lastSelectedSchool.forEach((schoolItem) => {
      const distanceValue = calculateDistanceInMiles(home.latitude, home.longitude, schoolItem.latitude, schoolItem.longitude);
      message += `<div class="school-distance">${distanceValue.toFixed(2)} miles from ${schoolItem.name}</div>`;
    });

    message += `<a href="${generateZillowUrl(home.formattedAddress)}" target="_blank" rel="noopener noreferrer">View on Zillow</a></div>`;
    marker.bindPopup(message);
    marker.on("click", () => {
      renderHouseDetailView(home);
    });
    marker.addTo(markersLayer);
  });

  if (bounds.length === 1) {
    map.setView(bounds[0], 14);
  } else if (bounds.length > 1) {
    map.fitBounds(bounds, { padding: [50, 50] });
    map.setView([38.19, -85.68], 11);
  }

  populateHomeResults(nearbyHomes);
  setTimeout(() => {
    if (map) {
      map.invalidateSize();
    }
  }, 120);
}

function createHomeCard(home) {
  const card = document.createElement("article");
  card.className = "card";
  card.innerHTML = `
      <h3>${home.formattedAddress}</h3>
      <p><strong>Type:</strong> ${home.propertyType || "N/A"}</p>
      <p><strong>Bedrooms:</strong> ${home.bedrooms} • <strong>Bathrooms:</strong> ${home.bathrooms}</p>
      <p><strong>Square Feet:</strong> ${home.squareFeet ?? "N/A"}</p>
      <p><strong>Price:</strong> ${currency(home.price)}</p>
    `;
  card.onclick = () => {
    renderHouseDetailView(home);
  };
  return card;
}

function searchHomesNearSchool() {
  const query = normalizeSearchText(elements.schoolSearchHome.value);

  if (!query) {
    elements.resultsTitle.textContent = "Available Homes";
    state.filteredHomes = [...state.houses];
    renderHomes(state.filteredHomes);
    return;
  }

  const selectedSchool = state.schools
    .map((school) => ({
      school,
      score: getSchoolMatchScore(school, query),
    }))
    .filter(({ score }) => Number.isFinite(score))
    .sort((a, b) => {
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
    return;
  }

  lastSelectedSchool = selectedSchool;

  const nearbyHomes = state.houses
    .filter(hasCoordinates)
    .map((home) => ({
      ...home,
      distanceToSchool: calculateDistanceInMiles(home.latitude, home.longitude, selectedSchool.latitude, selectedSchool.longitude),
    }))
    .filter((home) => home.distanceToSchool <= 5)
    .sort((a, b) => a.distanceToSchool - b.distanceToSchool)
    .map(({ distanceToSchool, ...home }) => ({ ...home, distanceToSchool }));

  elements.resultsTitle.textContent = `Homes Near ${selectedSchool.name}`;
  renderMapForSchool(nearbyHomes, selectedSchool);
}

function applyHomeFilters() {
  const minBedrooms = Number(elements.minBedrooms.value);
  const minBathrooms = Number(elements.minBathrooms.value);
  const maxPrice = Number(elements.maxPriceHome.value);

  state.filteredHomes = state.houses.filter(
    (home) =>
      home.bedrooms >= minBedrooms &&
      home.bathrooms >= minBathrooms &&
      home.price <= maxPrice
  );

  elements.homeResults.textContent = `${state.filteredHomes.length} home${state.filteredHomes.length !== 1 ? "s" : ""} found`;
  renderHomes(state.filteredHomes);
}