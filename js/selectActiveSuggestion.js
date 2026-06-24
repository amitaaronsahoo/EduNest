function selectActiveSuggestion() {
  const list = elements.schoolSuggestionsList;
  if (!list || list.style.display === "none") return false;
  const idx = Number(list.dataset.activeIndex || -1);
  const item = list.children[idx];
  if (item) {
    const id = Number(item.dataset.schoolId);
    const school = state.schools.find(s => s.id === id);
    if (school) {
      elements.schoolSearchHome.value = school.name;
      clearSchoolSuggestions();
      searchHomesNearSchool();
      return true;
    }
  }
  return false;
}