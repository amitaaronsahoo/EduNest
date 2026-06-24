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

function getCheckedSchoolIds() {
  return new Set(
    Array.from(document.querySelectorAll('.school input[type="checkbox"]:checked'))
      .map((checkbox) => Number(checkbox.dataset.schoolId))
      .filter((schoolId) => !isNaN(schoolId))
  );
}

function renderSchoolsList(schools = null, searchQuery = "") {
  const baseSchools = schools || state.schoolsFiltered || [];
  const normalizedQuery = normalizeSearchText(searchQuery);
  const checkedSchoolIds = getCheckedSchoolIds();

  let schoolsToRender = normalizedQuery
    ? baseSchools.filter((s) => s.searchName.includes(normalizedQuery))
    : [...baseSchools];

  const checkedSchools = state.schools.filter((school) => checkedSchoolIds.has(school.id));
  checkedSchools.forEach((school) => {
    if (!schoolsToRender.some((s) => s.id === school.id)) {
      schoolsToRender.push(school);
    }
  });

  schoolsToRender.sort((a, b) => {
    const aChecked = checkedSchoolIds.has(a.id) ? 0 : 1;
    const bChecked = checkedSchoolIds.has(b.id) ? 0 : 1;
    if (aChecked !== bChecked) return aChecked - bChecked;
    return a.name.localeCompare(b.name);
  });

  if (schoolsToRender.length === 0) {
    elements.schoolsList.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #475569; padding: 20px;">No schools found</div>';
    elements.schoolResults.textContent = "0 schools found";
    return;
  }

  elements.schoolResults.textContent = `${schoolsToRender.length} school${schoolsToRender.length !== 1 ? "s" : ""} found`;
  elements.schoolsList.innerHTML = "";

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
      <div><input type="checkbox" id="school-${school.id}" data-school-id="${school.id}" ${checkedSchoolIds.has(school.id) ? "checked" : ""}><label for="school-${school.id}">Select</label></div>
    `;

    row.onclick = () => {
      const checkbox = row.querySelector(`input[data-school-id="${school.id}"]`);
      checkbox.checked = !checkbox.checked;
    };

    row.onmouseover = () => {
      row.style.backgroundColor = "#C9C9C9";
    };

    row.onmouseout = () => {
      row.style.backgroundColor = "#ffffff";
    };

    elements.schoolsList.appendChild(row);
  });
}

function applySchoolFilters() {
  const selectedTypes = Array.from(document.querySelectorAll('input[name="schoolType"]:checked')).map((x) => x.value);
  const selectedGrades = Array.from(document.querySelectorAll('input[name="gradeLevel"]:checked')).map((x) => x.value);

  state.schoolsFiltered = state.schools.filter((school) => {
    const typeMatch = selectedTypes.length === 0 || selectedTypes.some((t) => school.type?.includes(t));
    const gradeMatch = selectedGrades.length === 0 || selectedGrades.some((g) => school.level?.includes(g));
    return typeMatch && gradeMatch;
  });

  renderSchoolsList(state.schoolsFiltered);
}

function getCheckedSchools() {
  const checkedSchoolIds = [];
  document.querySelectorAll('.school input[type="checkbox"]:checked').forEach((checkbox) => {
    const schoolId = Number(checkbox.getAttribute('data-school-id'));
    if (!isNaN(schoolId)) {
      checkedSchoolIds.push(schoolId);
    }
  });
  return state.schools.filter((school) => checkedSchoolIds.includes(school.id));
}

function searchHomesForAllSelectedSchools() {
  const selectedSchools = getCheckedSchools();

  if (selectedSchools.length === 0) {
    alert("Please select at least one school");
    return;
  }

  const nearbyHomesMap = new Map();

  selectedSchools.forEach((school) => {
    if (!hasCoordinates(school)) return;

    state.houses.filter(hasCoordinates).forEach((home) => {
      const distance = calculateDistanceInMiles(home.latitude, home.longitude, school.latitude, school.longitude);
      if (distance <= 5) {
        if (!nearbyHomesMap.has(home.id)) {
          nearbyHomesMap.set(home.id, { ...home, nearbySchools: [] });
        }
        nearbyHomesMap.get(home.id).nearbySchools.push({
          school: school.name,
          distance,
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

  document.querySelectorAll(".tab-btn").forEach((btn) => (btn.style.opacity = "0.6"));
  document.getElementById("tab-homes").style.opacity = "1";

  const schoolNames = selectedSchools.map((s) => s.name).join(", ");
  elements.resultsTitle.textContent = `Homes Near: ${schoolNames}`;

  state.filteredHomes = allNearbyHomes;
  elements.homeResults.textContent = `${allNearbyHomes.length} home${allNearbyHomes.length !== 1 ? "s" : ""} found near selected school${selectedSchools.length !== 1 ? "s" : ""}`;
}