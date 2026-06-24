function persistSavedHouses() {
  localStorage.setItem("userSavedHouses", JSON.stringify(savedHouses));
}