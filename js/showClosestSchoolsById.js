function showClosestSchoolsById(homeId) {
  const id = Number(homeId);
  let home = state.houses.find(h => h.id === id);
  if (!home) {
    home = state.filteredHomes.find(h => h.id === id);
  }
  if (home) {
    showClosestSchools(home);
  }
}