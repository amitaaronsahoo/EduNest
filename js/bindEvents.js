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
  elements.schoolSearchHome.addEventListener("input", e => {
    showSchoolSuggestions(e.target.value);
  });

window.toggleSavedHouse = toggleSavedHouse;
window.switchTab = switchTab;
  elements.AllSchoolBtn.addEventListener("click", searchHomesForAllSelectedSchools);
  elements.schoolSearchHome.addEventListener("keydown", e => {
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
  document.addEventListener("click", e => {
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
  document.querySelectorAll('input[name="houseSchoolType"], input[name="houseGradeLevel"]').forEach(checkbox => {
    checkbox.addEventListener("change", applyHouseDetailFilters);
  });
  if (elements.detailBackBtn) {
    elements.detailBackBtn.addEventListener("click", returnFromDetail);
  }

  // Initialize sidebar visibility
  if (elements.schoolSearch) {
    elements.schoolSearch.addEventListener("input", () => {
      const rawQuery = elements.schoolSearch.value;
      const normalizedQuery = normalizeSearchText(rawQuery);
      let filtered = state.schoolsFiltered;
      if (normalizedQuery) {
        filtered = state.schoolsFiltered.filter(s => s.searchName.includes(normalizedQuery));
      }
      renderSchoolsList(filtered, rawQuery);
    });
  }
}

// ============================================
// INITIALIZATION
// ============================================