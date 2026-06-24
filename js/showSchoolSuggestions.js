function showSchoolSuggestions(query) {
  ensureSchoolSuggestionsContainer();
  const normalized = normalizeSearchText(query);
  if (!normalized) {
    clearSchoolSuggestions();
    return;
  }
  const matches = state.schools.map(school => ({
    school,
    score: getSchoolMatchScore(school, normalized)
  })).filter(({
    score
  }) => Number.isFinite(score)).sort((a, b) => {
    if (a.score !== b.score) return a.score - b.score;
    if (a.school.searchName.length !== b.school.searchName.length) return a.school.searchName.length - b.school.searchName.length;
    return a.school.name.localeCompare(b.school.name);
  }).slice(0, 8).map(x => x.school);
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
    item.innerHTML = `<div style="padding: 5px; cursor: pointer;"><strong>${s.name}</strong>${s.level ? ` <span class=\"school-meta\">• ${s.level}</span>` : ''}${s.formattedAddress ? `<div class=\"school-meta\">${s.formattedAddress}</div>` : ''}</div><hr/>`;
    item.addEventListener("click", () => {
      elements.schoolSearchHome.value = s.name;
      clearSchoolSuggestions();
    });
    list.appendChild(item);
  });
  list.style.display = "block";
  list.dataset.activeIndex = "-1";
}