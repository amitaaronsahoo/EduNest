function populateHomeResults(homes, centerSchoolId = null) {
  elements.results.innerHTML = "";
  elements.emptyState.hidden = homes.length !== 0;
  homes.forEach(home => {
    elements.results.appendChild(createHomeCard(home));
  });
  updateSaveButtons();
}