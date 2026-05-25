const DATA_PATHS = {
  houses: "data/houses.json",
  schools: "data/Jefferson_County_KY_Schools.geojson",
};

const state = {
  houses: [],
  schools: [],
  filteredHomes: [],
};

const elements = {
  schoolSearch: document.getElementById("schoolSearch"),
  schoolSearchBtn: document.getElementById("schoolSearchBtn"),
  minBedrooms: document.getElementById("minBedrooms"),
  minBathrooms: document.getElementById("minBathrooms"),
  maxPrice: document.getElementById("maxPrice"),
  maxPriceValue: document.getElementById("maxPriceValue"),
  applyFiltersBtn: document.getElementById("applyFiltersBtn"),
  resultsTitle: document.getElementById("resultsTitle"),
  results: document.getElementById("results"),
  emptyState: document.getElementById("emptyState"),
  closestSchools: document.getElementById("closestSchools"),
  schoolFallback: document.getElementById("schoolFallback"),
};

function generateZillowUrl(formattedAddress = "") {
  const address = String(formattedAddress).trim();
  const withoutPunctuation = address.replace(/[.,]/g, "");
  const withHyphens = withoutPunctuation.replace(/\s+/g, "-");
  return `https://www.zillow.com/homes/${withHyphens}_rb/`;
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

function normalizeSchool(feature) {
  const coordinates = feature?.geometry?.coordinates || [];
  return {
    name: feature?.properties?.SCH_NAME || "Unknown School",
    level: feature?.properties?.LEVEL_ || "N/A",
    longitude: Number(coordinates[0]),
    latitude: Number(coordinates[1]),
  };
}

function currency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function clearClosestSchools() {
  elements.closestSchools.innerHTML = "";
  elements.schoolFallback.hidden = true;
}

function renderHomes(homes) {
  elements.results.innerHTML = "";
  elements.emptyState.hidden = homes.length !== 0;

  homes.forEach((home) => {
    const card = document.createElement("article");
    card.className = "card";

    card.innerHTML = `
      <h3>${home.formattedAddress}</h3>
      <p><strong>Type:</strong> ${home.propertyType}</p>
      <p><strong>Bedrooms:</strong> ${home.bedrooms}</p>
      <p><strong>Bathrooms:</strong> ${home.bathrooms}</p>
      <p><strong>Square Feet:</strong> ${home.squareFeet ?? "N/A"}</p>
      <p><strong>Price:</strong> ${currency(home.price)}</p>
      <a class="zillow-link" href="${generateZillowUrl(home.formattedAddress)}" target="_blank" rel="noopener noreferrer">View on Zillow</a>
      <div>
        <button type="button" data-home-id="${home.id}">Show 10 Closest Schools</button>
      </div>
    `;

    const button = card.querySelector("button");
    button.addEventListener("click", () => showClosestSchools(home));

    elements.results.appendChild(card);
  });
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
    item.textContent = `${school.name} (${school.level}) - ${school.distance.toFixed(2)} miles`;
    elements.closestSchools.appendChild(item);
  });
}

function applyPropertyFilters() {
  const minBedrooms = Number(elements.minBedrooms.value);
  const minBathrooms = Number(elements.minBathrooms.value);
  const maxPrice = Number(elements.maxPrice.value);

  state.filteredHomes = state.houses.filter(
    (home) =>
      home.bedrooms >= minBedrooms &&
      home.bathrooms >= minBathrooms &&
      home.price <= maxPrice
  );

  elements.resultsTitle.textContent = "Filtered Homes";
  renderHomes(state.filteredHomes);
  clearClosestSchools();
}

function searchHomesNearSchool() {
  const query = elements.schoolSearch.value.trim().toLowerCase();

  if (!query) {
    elements.resultsTitle.textContent = "Available Homes";
    state.filteredHomes = [...state.houses];
    renderHomes(state.filteredHomes);
    clearClosestSchools();
    return;
  }

  const selectedSchool = state.schools.find((school) =>
    school.name.toLowerCase().includes(query)
  );

  if (!selectedSchool || !hasCoordinates(selectedSchool)) {
    elements.resultsTitle.textContent = "Homes Near Selected School";
    renderHomes([]);
    clearClosestSchools();
    return;
  }

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
    .map(({ distanceToSchool, ...home }) => home);

  elements.resultsTitle.textContent = `Homes Near ${selectedSchool.name}`;
  renderHomes(nearbyHomes);
  clearClosestSchools();
}

async function loadData() {
  const [housesResponse, schoolsResponse] = await Promise.all([
    fetch(DATA_PATHS.houses),
    fetch(DATA_PATHS.schools),
  ]);

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

  state.schools = (schoolsGeoJson.features || []).map(normalizeSchool);
  state.filteredHomes = [...state.houses];

  renderHomes(state.filteredHomes);
}

function bindEvents() {
  elements.maxPrice.addEventListener("input", () => {
    elements.maxPriceValue.textContent = currency(Number(elements.maxPrice.value));
  });

  elements.applyFiltersBtn.addEventListener("click", applyPropertyFilters);
  elements.schoolSearchBtn.addEventListener("click", searchHomesNearSchool);
}

loadData()
  .then(bindEvents)
  .catch(() => {
    elements.results.innerHTML = "";
    elements.emptyState.textContent = "Data unavailable";
    elements.emptyState.hidden = false;
    elements.schoolFallback.hidden = false;
  });

window.EduNestApp = {
  calculateDistanceInMiles,
  generateZillowUrl,
};
