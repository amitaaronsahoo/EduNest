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