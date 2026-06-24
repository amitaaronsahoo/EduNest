function clearSchoolSuggestions() {
  if (!elements.schoolSuggestionsList) return;
  elements.schoolSuggestionsList.innerHTML = "";
  elements.schoolSuggestionsList.style.display = "none";
  elements.schoolSuggestionsList.dataset.activeIndex = "-1";
}