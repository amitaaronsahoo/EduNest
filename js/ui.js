const elements = {
  schoolSearch: document.getElementById("schoolSearch"),
  schoolSearchBtn: document.getElementById("schoolSearchBtn"),
  maxTuition: document.getElementById("maxTuition"),
  maxTuitionValue: document.getElementById("maxTuitionValue"),
  applyFiltersBtn: document.getElementById("applyFiltersBtn"),
  schoolResults: document.getElementById("schoolResults"),
  schoolsList: document.getElementById("schoolsTableBody"),
  AllSchoolBtn: document.getElementById("allSchoolBtn"),
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
  detailBackBtn: document.getElementById("detailBackBtn"),
  houseDetailNotes: document.getElementById("houseDetailNotes"),
  houseMaxTuition: document.getElementById("houseMaxTuition"),
  houseMaxTuitionValue: document.getElementById("houseMaxTuitionValue"),
  houseApplySchoolFiltersBtn: document.getElementById("houseApplySchoolFiltersBtn"),
  houseSchoolResults: document.getElementById("houseSchoolResults"),
  houseNearbySchools: document.getElementById("houseNearbySchools"),
  houseDetailInfo: document.getElementById("houseDetailInfo"),
  resultsTitle: document.getElementById("resultsTitle"),
  results: document.getElementById("results"),
  emptyState: document.getElementById("emptyState"),
  savedHousesList: document.getElementById("savedHousesList"),
  savedHousesCount: document.getElementById("savedHousesCount"),
  savedHouses: document.getElementById("savedHouses"),
};

function switchTab(tab) {
  currentTab = tab;

  document.getElementById("schools-content").style.display = tab === "schools" ? "block" : "none";
  document.getElementById("homes-content").style.display = tab === "homes" ? "block" : "none";
  document.getElementById("saved-content").style.display = tab === "saved" ? "block" : "none";
  document.getElementById("house-details-content").style.display = "none";

  document.getElementById("schools-sidebar").style.display = tab === "schools" ? "block" : "none";
  document.getElementById("homes-sidebar").style.display = tab === "homes" ? "block" : "none";

  document.querySelectorAll(".tab-btn").forEach((btn) => (btn.style.opacity = "0.6"));
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

function ensureSchoolSuggestionsContainer() {
  if (elements.schoolSuggestionsContainer) return elements.schoolSuggestionsContainer;

  const container = document.createElement("div");
  container.className = "school-suggestions";

  const list = document.createElement("div");
  list.className = "school-suggestions-list";
  list.style.display = "none";

  container.appendChild(list);

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
    item.innerHTML = `<div style="padding: 5px; cursor: pointer;"><strong>${s.name}</strong>${s.level?` <span class="school-meta">• ${s.level}</span>`:''}${s.formattedAddress?`<div class="school-meta">${s.formattedAddress}</div>`:''}</div><hr/>`;
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