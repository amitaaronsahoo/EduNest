function getHouseDetailSchoolFilters() {
  const selectedTypes = Array.from(document.querySelectorAll('input[name="houseSchoolType"]:checked')).map(x => x.value);
  const selectedGrades = Array.from(document.querySelectorAll('input[name="houseGradeLevel"]:checked')).map(x => x.value);
  const maxTuition = Number(elements.houseMaxTuition?.value || 0);
  return {
    selectedTypes,
    selectedGrades,
    maxTuition
  };
}