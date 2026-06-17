// ============================================
// UNIFIED EDUNEST + TEST PROJECT APP
// ============================================

const DATA_PATHS = {
  houses: "data/houses.json",
  schools: "data/Jefferson_County_KY_Schools (1).geojson",
};

const SCHOOL_ICON_URL = "https://cdn2.iconfinder.com/data/icons/school-pack-2/512/1-1024.png";

const SCHOOL_LEVEL_LABELS = {
  E: "Elementary",
  M: "Middle",
  S: "Secondary",
  H: "Special",
  C: "Combined",
};

const state = {
  houses: [],
  schools: [],
  filteredHomes: [],
  schoolsFiltered: [],
};

let savedHouses = [];
let savedHouseIds = new Set();
let currentTab = "schools";
let map;
let markersLayer;
let detailMap;
let detailMarkersLayer;
let currentHouseDetail = null;
let lastSelectedSchool = null;

// ============================================
// LOGIN & USER MANAGEMENT
// ============================================


// ============================================
// DOM ELEMENTS
// ============================================

const elements = {
  
  // Schools sidebar
  schoolSearch: document.getElementById("schoolSearch"),
  schoolSearchBtn: document.getElementById("schoolSearchBtn"),
  maxTuition: document.getElementById("maxTuition"),
  maxTuitionValue: document.getElementById("maxTuitionValue"),
  applyFiltersBtn: document.getElementById("applyFiltersBtn"),
  schoolResults: document.getElementById("schoolResults"),
  schoolsList: document.getElementById("schoolsTableBody"),
  AllSchoolBtn: document.getElementById("allSchoolBtn"),
  
  // Homes sidebar
  schoolSearchHome: document.getElementById("schoolSearchHome"),
  schoolSearchHomeBtn: document.getElementById("schoolSearchHomeBtn"),
  minBedrooms: document.getElementById("minBedrooms"),
  minBathrooms: document.getElementById("minBathrooms"),
  maxPriceHome: document.getElementById("maxPriceHome"),
  maxPriceValue: document.getElementById("maxPriceValue"),
  applyFiltersHomeBtn: document.getElementById("applyFiltersHomeBtn"),
  homeResults: document.getElementById("homeResults"),
  houseDetailTitle: document.getElementById("houseDetailTitle"),
  houseDetailSubtitle: document.getElementById("houseDetailSubtitle"),
  houseDetailBackBtn: document.getElementById("houseDetailBackBtn"),
  houseDetailNotes: document.getElementById("houseDetailNotes"),
  houseMaxTuition: document.getElementById("houseMaxTuition"),
  houseMaxTuitionValue: document.getElementById("houseMaxTuitionValue"),
  houseApplySchoolFiltersBtn: document.getElementById("houseApplySchoolFiltersBtn"),
  houseSchoolResults: document.getElementById("houseSchoolResults"),
  houseNearbySchools: document.getElementById("houseNearbySchools"),
  houseDetailInfo: document.getElementById("houseDetailInfo"),
  
  // Content areas
  resultsTitle: document.getElementById("resultsTitle"),
  results: document.getElementById("results"),
  emptyState: document.getElementById("emptyState"),
  savedHousesList: document.getElementById("savedHousesList"),
  savedHousesCount: document.getElementById("savedHousesCount"),
  savedHouses: document.getElementById("savedHouses"),
};

// ============================================
// TAB SWITCHING
// ============================================

function switchTab(tab) {
  currentTab = tab;
  
  document.getElementById("schools-content").style.display = tab === "schools" ? "block" : "none";
  document.getElementById("homes-content").style.display = tab === "homes" ? "block" : "none";
  document.getElementById("saved-content").style.display = tab === "saved" ? "block" : "none";
  document.getElementById("house-details-content").style.display = "none";
  
  document.getElementById("schools-sidebar").style.display = tab === "schools" ? "block" : "none";
  document.getElementById("homes-sidebar").style.display = tab === "homes" ? "block" : "none";
  
  document.querySelectorAll(".tab-btn").forEach(btn => btn.style.opacity = "0.6");
  document.getElementById(`tab-${tab}`).style.opacity = "1";

  

  if (tab === "homes") {
    if (!map) {
      renderHomes(state.filteredHomes);
    }
    setTimeout(() => {
      if (map) {
        map.invalidateSize();
      }
    }, 120);
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

// ============================================
// UTILITY FUNCTIONS
// ============================================

function ensureSchoolSuggestionsContainer() {
  if (elements.schoolSuggestionsContainer) return elements.schoolSuggestionsContainer;

  const container = document.createElement("div");
  container.className = "school-suggestions";

  const list = document.createElement("div");
  list.className = "school-suggestions-list";
  list.style.display = "none";

  container.appendChild(list);

  // Insert container after the input
  const input = elements.schoolSearchHome;
  input.parentNode.insertBefore(container, input.nextSibling);

  elements.schoolSuggestionsContainer = container;
  elements.schoolSuggestionsList = list;
  return container;
}

function showSchoolSuggestions(query) {
  ensureSchoolSuggestionsContainer();

  const normalized = normalizeSearchText(query);
  if (!normalized) {
    clearSchoolSuggestions();
    return;
  }

  const matches = state.schools
    .map((school) => ({ school, score: getSchoolMatchScore(school, normalized) }))
    .filter(({ score }) => Number.isFinite(score))
    .sort((a, b) => {
      if (a.score !== b.score) return a.score - b.score;
      if (a.school.searchName.length !== b.school.searchName.length) return a.school.searchName.length - b.school.searchName.length;
      return a.school.name.localeCompare(b.school.name);
    })
    .slice(0, 8)
    .map((x) => x.school);

  if (matches.length === 0) {
    clearSchoolSuggestions();
    return;
  }

  const list = elements.schoolSuggestionsList;
  list.innerHTML = "";
  matches.forEach((s, idx) => {
    const item = document.createElement("div");
    item.className = "school-suggestion-item";
    item.tabIndex = 0;
    item.dataset.index = String(idx);
    item.dataset.schoolId = String(s.id);
    item.innerHTML = `<div style="padding: 5px; cursor: pointer;"><strong>${s.name}</strong>${s.level?` <span class=\"school-meta\">• ${s.level}</span>`:''}${s.formattedAddress?`<div class=\"school-meta\">${s.formattedAddress}</div>`:''}</div><hr/>`;
    item.addEventListener("click", () => {
      elements.schoolSearchHome.value = s.name;
      clearSchoolSuggestions();
    });
    list.appendChild(item);
  });

  list.style.display = "block";
  list.dataset.activeIndex = "-1";
}

function clearSchoolSuggestions() {
  if (!elements.schoolSuggestionsList) return;
  elements.schoolSuggestionsList.innerHTML = "";
  elements.schoolSuggestionsList.style.display = "none";
  elements.schoolSuggestionsList.dataset.activeIndex = "-1";
}

function moveSuggestionSelection(delta) {
  const list = elements.schoolSuggestionsList;
  if (!list || list.style.display === "none") return;
  const items = Array.from(list.children);
  if (!items.length) return;
  let idx = Number(list.dataset.activeIndex || -1);
  idx = Math.max(-1, Math.min(items.length - 1, idx + delta));

  items.forEach((it, i) => it.classList.toggle("active", i === idx));
  list.dataset.activeIndex = String(idx);
}

function selectActiveSuggestion() {
  const list = elements.schoolSuggestionsList;
  if (!list || list.style.display === "none") return false;
  const idx = Number(list.dataset.activeIndex || -1);
  const item = list.children[idx];
  if (item) {
    const id = Number(item.dataset.schoolId);
    const school = state.schools.find((s) => s.id === id);
    if (school) {
      elements.schoolSearchHome.value = school.name;
      clearSchoolSuggestions();
      searchHomesNearSchool();
      return true;
    }
  }
  return false;
}

function getSchoolMatchScore(school, query) {
  if (!query) {
    return Number.POSITIVE_INFINITY;
  }

  if (school.searchName === query) {
    return 0;
  }

  if (school.searchName.startsWith(query)) {
    return 1;
  }

  if (` ${school.searchName} `.includes(` ${query} `)) {
    return 2;
  }

  if (school.searchName.includes(query)) {
    return 3;
  }

  if (school.searchText.startsWith(query)) {
    return 4;
  }

  if (` ${school.searchText} `.includes(` ${query} `)) {
    return 5;
  }

  if (school.searchText.includes(query)) {
    return 6;
  }

  return Number.POSITIVE_INFINITY;
}

function currency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function calculateDistanceInMiles(lat1, lon1, lat2, lon2) {
  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const earthRadiusMiles = 3958.8;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusMiles * c;
}

function hasCoordinates(record) {
  return (
    typeof record?.latitude === "number" &&
    typeof record?.longitude === "number" &&
    Number.isFinite(record.latitude) &&
    Number.isFinite(record.longitude) &&
    !Number.isNaN(record.latitude) &&
    !Number.isNaN(record.longitude)
  );
}

function parseCoordinate(value) {
  if (value === null || value === undefined || value === "") {
    return NaN;
  }
  return Number(value);
}

function normalizeText(value) {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value).trim().replace(/\s+/g, " ");
}

function normalizeOptionalText(value) {
  const normalized = normalizeText(value);
  return normalized || null;
}

function normalizeSearchText(value) {
  return normalizeText(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/['\u2019.]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

function normalizeSchoolLevel(value) {
  const code = normalizeText(value).toUpperCase();
  return {
    code: code || null,
    label: SCHOOL_LEVEL_LABELS[code] || "Unknown",
  };
}

function normalizeSchoolType(value) {
  const type = normalizeOptionalText(value);
  if (!type) return null;
  if (type === "JCPS") return type;
  return type
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function generateZillowUrl(formattedAddress = "") {
  const address = String(formattedAddress).trim();
  const withoutPunctuation = address.replace(/[.,]/g, "");
  const withHyphens = withoutPunctuation.replace(/\s+/g, "-");
  return `https://www.zillow.com/homes/${withHyphens}_rb/`;
}

function formatSchoolAddress({ address, city, stateCode, zip }) {
  const locality = [city, stateCode].filter(Boolean).join(", ");
  return [address, locality, zip].filter(Boolean).join(" ");
}

// ============================================
// SAVED HOUSES MANAGEMENT
// ============================================


function loadSavedHouses() {


  const raw = localStorage.getItem("userSavedHouses");
  savedHouses = raw ? JSON.parse(raw): [] ;
  savedHouseIds = new Set(savedHouses.map((house) => house.id));
}

function persistSavedHouses() {
  localStorage.setItem("userSavedHouses",JSON.stringify(savedHouses));
  
}

function isHouseSaved(home) {
  return savedHouseIds.has(home.id);
}

function toggleSavedHouse(home) {

  if (isHouseSaved(home)) {
    savedHouses = savedHouses.filter((saved) => saved.id !== home.id);
  } else {
    savedHouses.push(home);
  }

  savedHouseIds = new Set(savedHouses.map((saved) => saved.id));
  persistSavedHouses();
  renderSavedHouses();
  updateSaveButtons();
}

function renderSavedHouses() {
  elements.savedHousesCount.textContent = `${savedHouses.length} home${savedHouses.length !== 1 ? "s" : ""} saved`;
  elements.savedHousesList.innerHTML = "";
  
  if (savedHouses.length === 0) {
    elements.savedHousesList.innerHTML = '<div style="color: #475569; font-size: 0.9rem;">No homes saved yet</div>';
    elements.savedHouses.innerHTML = '<div style="text-align: center; color: #475569; padding: 40px; grid-column: 1/-1;">No homes saved yet</div>';
    return;
  }

  savedHouses.forEach((home) => {
    const item = document.createElement("div");
    item.style.cssText = "padding: 8px; background: #f3f4f6; border-radius: 4px; margin-bottom: 8px; cursor: pointer;";
    item.innerHTML = `
      <div style="font-weight: 600; font-size: 0.9rem;">${home.formattedAddress}</div>
      <div style="font-size: 0.85rem; color: #475569;">${currency(home.price)}</div>
    `;
    item.onclick = () => {
      document.querySelector("#tab-homes").click();
      setTimeout(() => switchTab("saved"), 50);
    };
    elements.savedHousesList.appendChild(item);
  });

  // Render saved homes in saved section
  elements.savedHouses.innerHTML = "";
  savedHouses.forEach((home) => {
    const isSaved = true;
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${home.formattedAddress}</h3>
      <p><strong>Type:</strong> ${home.propertyType || "N/A"}</p>
      <p><strong>Bedrooms:</strong> ${home.bedrooms} • <strong>Bathrooms:</strong> ${home.bathrooms}</p>
      <p><strong>Price:</strong> ${currency(home.price)}</p>
      <div style="display: flex; gap: 0.5rem;">
      <button style="flex:1; padding: 8px; border:none; background:#1f4f99; color:#fff; border-radius:8px; cursor:pointer;" onclick="renderHouseDetailView(state.houses.find(h => h.id === ${home.id}))">View Details</button>`;
    card.homeData = home;
    elements.savedHouses.appendChild(card);
  });
}

function updateSaveButtons() {
  document.querySelectorAll("[data-save-home-id]").forEach((button) => {
    const homeId = Number(button.dataset.saveHomeId);
    if (savedHouseIds.has(homeId)) {
      button.textContent = "Remove Saved";
      button.classList.add("saved");
    } else {
      button.textContent = "Save House";
      button.classList.remove("saved");
    }
  });
}

// ============================================
// SCHOOL NORMALIZATION & RENDERING
// ============================================

function normalizeSchool(feature, index) {
  const coordinates = feature?.geometry?.coordinates || [];
  const longitude = Number(coordinates[0]);
  const latitude = Number(coordinates[1]);

  if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) {
    return null;
  }

  const name = normalizeOptionalText(feature?.properties?.SCH_NAME) || "Unknown School";
  const shortName = normalizeOptionalText(feature?.properties?.SCH_AB);
  const { code: levelCode, label: level } = normalizeSchoolLevel(feature?.properties?.LEVEL_);
  const type = normalizeSchoolType(feature?.properties?.LOC_TYPE);
  const address = normalizeOptionalText(feature?.properties?.ADDRESS);
  const city = normalizeOptionalText(feature?.properties?.CITY);
  const stateCode = normalizeOptionalText(feature?.properties?.ST);
  const zip = normalizeOptionalText(feature?.properties?.ZIP);
  const searchFields = [name, shortName, level, type, address, city].filter(Boolean).join(" ");

  return {
    id: Number(feature?.properties?.OBJECTID) || index + 1,
    name,
    shortName,
    levelCode,
    level,
    type,
    address,
    city,
    stateCode,
    zip,
    phone: normalizeOptionalText(feature?.properties?.PHONE),
    website: normalizeOptionalText(feature?.properties?.SCH_WEB),
    longitude,
    latitude,
    formattedAddress: formatSchoolAddress({ address, city, stateCode, zip }),
    searchName: normalizeSearchText(name),
    searchText: normalizeSearchText(searchFields),
  };
}

function renderSchoolsList(schools = null) {
  const schoolsToRender = schools || state.schoolsFiltered;
  if(document.querySelectorAll('.school').length > 0){
  document.querySelectorAll('.school').forEach(item => {
    const checkbox = item.querySelector('input[type="checkbox"]');

    if (!checkbox?.checked) {
        item.remove();
    }
});}
  //elements.schoolsList.innerHTML = "";
  
  if (schoolsToRender.length === 0) {
    elements.schoolsList.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #475569; padding: 20px;">No schools found</div>';
    elements.schoolResults.textContent = "0 schools found";
    return;
  }

  elements.schoolResults.textContent = `${schoolsToRender.length} school${schoolsToRender.length !== 1 ? "s" : ""} found`;

  schoolsToRender.forEach((school) => {
    const row = document.createElement("div");
    row.className = "school";
    row.style.display = "grid";
    row.style.gridTemplateColumns = "2fr 2fr 1fr 1fr 1fr";
    row.innerHTML = `
      <div class="name">${school.name}</div>
      <div class="address">${school.formattedAddress}</div>
      <div><span class="tag"><span class="label-2">${school.level || "N/A"}</span></span></div>
      <div><span class="tag"><span class="label-2">${school.type || "N/A"}</span></span></div>
      <div><input type="checkbox" id="school-${school.id}" data-school-id="${school.id}"><label for="school-${school.id}">Select</label></div>
    `;
    elements.schoolsList.appendChild(row);
  });
}

function applySchoolFilters() {
  const selectedTypes = Array.from(document.querySelectorAll('input[name="schoolType"]:checked')).map(x => x.value);
  const selectedGrades = Array.from(document.querySelectorAll('input[name="gradeLevel"]:checked')).map(x => x.value);
  const maxTuition = Number(elements.maxTuition.value);

  state.schoolsFiltered = state.schools.filter(school => {
    const typeMatch = selectedTypes.length === 0 || selectedTypes.some(t => school.type?.includes(t));
    const gradeMatch = selectedGrades.length === 0 || selectedGrades.some(g => school.level?.includes(g));
    return typeMatch && gradeMatch;
  });

  renderSchoolsList(state.schoolsFiltered);
}

// ============================================
// HOMES RENDERING & MAP
// ============================================

function renderHomes(homes) {
  elements.results.innerHTML = "";
  
  if (homes.length === 0) {
    elements.emptyState.textContent = "No homes found. Try adjusting your filters.";
    elements.emptyState.hidden = false;
    return;
  }

  elements.emptyState.hidden = true;

  homes.forEach((home) => {
    const isSaved = isHouseSaved(home);
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${home.formattedAddress}</h3>
      <p><strong>Type:</strong> ${home.propertyType || "N/A"}</p>
      <p><strong>Bedrooms:</strong> ${home.bedrooms} • <strong>Bathrooms:</strong> ${home.bathrooms}</p>
      <p><strong>Square Feet:</strong> ${home.squareFeet ?? "N/A"}</p>
      <p><strong>Price:</strong> ${currency(home.price)}</p>
      
    `;
    card.onclick = () => { renderHouseDetailView(home); };
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

function initializeDetailMap() {
  if (detailMap) return;

  const detailMapDiv = document.getElementById("detailMap");
  if (!detailMapDiv) return;

  detailMap = L.map(detailMapDiv).setView([38.2, -85.8], 11);
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
  initializeDetailMap();
  if (!detailMap || !detailMarkersLayer) return;

  detailMarkersLayer.clearLayers();

  const houseLatLng = [home.latitude, home.longitude];
  const bounds = [houseLatLng];

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

function returnToHomesFromDetail() {
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

function showClosestSchoolsById(homeId) {
  const id = Number(homeId);
  let home = state.houses.find((h) => h.id === id);

  if (!home) {
    home = state.filteredHomes.find((h) => h.id === id);
  }

  if (home) {
    showClosestSchools(home);
  }
}

function showClosestSchools(home) {
  clearClosestSchools();

  if (!hasCoordinates(home)) {
    elements.schoolFallback.hidden = false;
    return;
  }

  const schoolsWithDistance = state.schools
    .filter(hasCoordinates)
    .map((school) => ({
      ...school,
      distance: calculateDistanceInMiles(
        home.latitude,
        home.longitude,
        school.latitude,
        school.longitude
      ),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 10);

  if (schoolsWithDistance.length === 0) {
    elements.schoolFallback.hidden = false;
    return;
  }

  schoolsWithDistance.forEach((school) => {
    const item = document.createElement("li");
    item.className = "school-item";

    const title = document.createElement("strong");
    title.textContent = school.name;
    item.appendChild(title);

    const meta = [school.level, school.type].filter(Boolean).join(" • ");
    if (meta) {
      const metaLine = document.createElement("div");
      metaLine.className = "school-meta";
      metaLine.textContent = meta;
      item.appendChild(metaLine);
    }

    if (school.formattedAddress) {
      const addressLine = document.createElement("div");
      addressLine.className = "school-meta";
      addressLine.textContent = school.formattedAddress;
      item.appendChild(addressLine);
    }

    const distanceLine = document.createElement("div");
    distanceLine.className = "school-distance";
    distanceLine.textContent = `${school.distance.toFixed(2)} miles away`;
    item.appendChild(distanceLine);

    elements.closestSchools.appendChild(item);
  });
}

function populateHomeResults(homes, centerSchoolId = null) {
  elements.results.innerHTML = "";
  elements.emptyState.hidden = homes.length !== 0;

  homes.forEach((home) => {
    elements.results.appendChild(createHomeCard(home));
  });

  updateSaveButtons();
}

function renderMapForSchool(nearbyHomes,...school) {
  lastSelectedSchool = school || [];
  lastNearbyHomes = nearbyHomes || [];
  // Ensure map exists
  if (!map) {
    map = L.map("map").setView([37.8, -96], 4);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(map);
    markersLayer = L.layerGroup().addTo(map);
  }

  // Clear existing markers
  markersLayer.clearLayers();

  const bounds = [];

  // Add school marker (distinct style)
  lastSelectedSchool.forEach((school) => {
  const schoolLatLng = [school.latitude, school.longitude];
  bounds.push(schoolLatLng);
  // Determine icon URL: developer-provided or default SVG
  const defaultSvg = encodeURIComponent(`<?xml version="1.0" encoding="UTF-8"?><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%231f4f99'><path d='M12 2l7 4v6c0 5-3 9-7 11-4-2-7-6-7-11V6l7-4z'/><path d='M11 11h2v6h-2z' fill='%23fff'/></svg>`);
  const iconUrl = SCHOOL_ICON_URL || `data:image/svg+xml;utf8,${defaultSvg}`;

  const schoolIcon = L.icon({
    iconUrl,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });

  const schoolMarker = L.marker(schoolLatLng, { title: school.name, icon: schoolIcon });
  schoolMarker.bindPopup(`
    <div style="min-width:220px">
      <h3>${school.name}</h3>
      <div class="school-meta">${school.level || ""} ${school.type ? '• ' + school.type : ''}</div>
      ${school.formattedAddress ? `<div class="school-meta">${school.formattedAddress}</div>` : ''}
      ${school.phone ? `<div class="school-meta">${school.phone}</div>` : ''}
      ${school.website ? `<div class="school-meta"><a href="${school.website}" target="_blank" rel="noopener noreferrer">Website</a></div>` : ''}
    </div>
  `);

  schoolMarker.addTo(markersLayer);

  // Add nearby homes markers
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
        ${typeof home.distanceToSchool === 'number' ? `<div class="school-distance">${home.distanceToSchool.toFixed(2)} miles from ${school.name}</div>` : ''}
        <a href="${generateZillowUrl(home.formattedAddress)}" target="_blank" rel="noopener noreferrer">View on Zillow</a>
      </div>
    `;
    lastSelectedSchool.forEach((school) => {
      message.includes(school.name) || (message += `<div class="school-distance">${calculateDistanceInMiles(home.latitude, home.longitude, school.latitude, school.longitude).toFixed(2)} miles from ${school.name}</div>`);
    });
    marker.bindPopup(message);
marker.on("click", () => {
        renderHouseDetailView(home);
      });
    marker.addTo(markersLayer);
  });

  // Fit bounds to include school and homes
  if (bounds.length === 1) {
    map.setView(schoolLatLng, 14);
  } else if (bounds.length > 1) {
    map.fitBounds(bounds, { padding: [50, 50] });
  }

  // Populate side results with nearby homes
  populateHomeResults(nearbyHomes);
  setTimeout(() => {
      if (map) {
        map.invalidateSize();
      }
    }, 120);

});
}




function createHomeCard(home) {
  const isSaved = isHouseSaved(home);
  const distanceText =
    typeof home.distanceToSchool === "number"
      ? `<div class="school-distance">${home.distanceToSchool.toFixed(2)} miles from selected school</div>`
      : "";

  const card = document.createElement("article");
  card.className = "card";
  card.innerHTML = `
      <h3>${home.formattedAddress}</h3>
      <p><strong>Type:</strong> ${home.propertyType || "N/A"}</p>
      <p><strong>Bedrooms:</strong> ${home.bedrooms} • <strong>Bathrooms:</strong> ${home.bathrooms}</p>
      <p><strong>Square Feet:</strong> ${home.squareFeet ?? "N/A"}</p>
      <p><strong>Price:</strong> ${currency(home.price)}</p>
      
    `;
     card.onclick = () => { renderHouseDetailView(home); };
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
    clearClosestSchools();
    return;
  }

  lastSelectedSchool = selectedSchool;

  const nearbyHomes = state.houses
    .filter(hasCoordinates)
    .map((home) => ({
      ...home,
      distanceToSchool: calculateDistanceInMiles(
        home.latitude,
        home.longitude,
        selectedSchool.latitude,
        selectedSchool.longitude
      ),
    }))
    .filter((home) => home.distanceToSchool <= 5)
    .sort((a, b) => a.distanceToSchool - b.distanceToSchool)
    .map(({ distanceToSchool, ...home }) => ({ ...home, distanceToSchool }));

  // Render map and side results centered on the selected school
  elements.resultsTitle.textContent = `Homes Near ${selectedSchool.name}`;
  renderMapForSchool(nearbyHomes, selectedSchool);
  clearClosestSchools();
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

// ============================================
// DATA LOADING
// ============================================

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
    switchTab("schools")
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
function getCheckedSchools() {
  const checkedSchoolIds = [];
  document.querySelectorAll('.school input[type="checkbox"]:checked').forEach(checkbox => {
    const schoolId = Number(checkbox.getAttribute('data-school-id'));
    if (!isNaN(schoolId)) {
      checkedSchoolIds.push(schoolId);
    }
  });
  return state.schools.filter(school => checkedSchoolIds.includes(school.id));
}

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

    state.houses
      .filter(hasCoordinates)
      .forEach(home => {
        const distance = calculateDistanceInMiles(
          home.latitude,
          home.longitude,
          school.latitude,
          school.longitude
        );

        // If home is within 5 miles of this school
        if (distance <= 5) {
          if (!nearbyHomesMap.has(home.id)) {
            nearbyHomesMap.set(home.id, { ...home, nearbySchools: [] });
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

function bindEvents() {

  // Schools filters
  if (elements.maxTuition) {
    elements.maxTuition.addEventListener("input", () => {
      elements.maxTuitionValue.textContent = currency(Number(elements.maxTuition.value));
      applySchoolFilters();
    });
  }

  document.querySelectorAll('input[name="schoolType"], input[name="gradeLevel"]').forEach(checkbox => {
    checkbox.addEventListener("change", applySchoolFilters);
  });

  elements.schoolSearchHomeBtn.addEventListener("click", searchHomesNearSchool);
elements.schoolSearchHome.addEventListener("input", (e) => {
    showSchoolSuggestions(e.target.value);
  });


//under development

    elements.AllSchoolBtn.addEventListener("click", searchHomesForAllSelectedSchools);


  elements.schoolSearchHome.addEventListener("keydown", (e) => {
    // Arrow down
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

  // Click outside to close suggestions
  document.addEventListener("click", (e) => {
    const container = elements.schoolSuggestionsContainer;
    if (!container) return;
    if (container.contains(e.target) || elements.schoolSearchHome.contains(e.target)) return;
    clearSchoolSuggestions();
  });


  if (elements.applyFiltersBtn) {
    elements.applyFiltersBtn.addEventListener("click", applySchoolFilters);
  }

  // Homes filters
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

  if (elements.houseDetailBackBtn) {
    elements.houseDetailBackBtn.addEventListener("click", returnToHomesFromDetail);
  }

  // Initialize sidebar visibility
  if (elements.schoolSearch) {
    elements.schoolSearch.addEventListener("input", () => {
      const query = normalizeSearchText(elements.schoolSearch.value);
      if (query) {
        const filtered = state.schools.filter(s => 
          s.searchName.includes(query)
        );
        renderSchoolsList(filtered);
      } else {
        renderSchoolsList(state.schoolsFiltered);
      }
    });
  }
}

// ============================================
// INITIALIZATION
// ============================================

window.toggleSavedHouse = toggleSavedHouse;
window.switchTab = switchTab;
document.addEventListener("DOMContentLoaded", () => {
  loadData().then(bindEvents).catch(err => {
    console.error("Initialization error:", err);
  });
});
