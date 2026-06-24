// ============================================
// SAVED HOUSES MANAGEMENT
// ============================================

function loadSavedHouses() {
  const raw = localStorage.getItem("userSavedHouses");
  savedHouses = raw ? JSON.parse(raw) : [];
  savedHouseIds = new Set(savedHouses.map(house => house.id));
}