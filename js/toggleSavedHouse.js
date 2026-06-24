function toggleSavedHouse(home) {
  if (isHouseSaved(home)) {
    savedHouses = savedHouses.filter(saved => saved.id !== home.id);
  } else {
    savedHouses.push(home);
  }
  savedHouseIds = new Set(savedHouses.map(saved => saved.id));
  persistSavedHouses();
  renderSavedHouses();
  updateSaveButtons();
}