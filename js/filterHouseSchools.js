function filterHouseSchools(schools) {
  const {
    selectedTypes,
    selectedGrades
  } = getHouseDetailSchoolFilters();
  return schools.filter(school => {
    const typeMatch = selectedTypes.length === 0 || selectedTypes.some(t => school.type?.includes(t));
    const gradeMatch = selectedGrades.length === 0 || selectedGrades.some(g => school.level?.includes(g));
    return typeMatch && gradeMatch;
  });
}