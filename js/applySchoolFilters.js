function applySchoolFilters() {
  const selectedTypes = Array.from(document.querySelectorAll('input[name="schoolType"]:checked')).map(x => x.value);
  const selectedGrades = Array.from(document.querySelectorAll('input[name="gradeLevel"]:checked')).map(x => x.value);
  const maxTuition = Number(elements.maxTuition.value);
  state.schoolsFiltered = state.schools.filter(school => {
    const typeMatch = selectedTypes.length === 0 || selectedTypes.some(t => school.type?.includes(t));
    const gradeMatch = selectedGrades.length === 0 || selectedGrades.some(g => school.level?.includes(g));
    return typeMatch && gradeMatch;
  });
  renderSchoolsList(state.schoolsFiltered);
}

// ============================================
// HOMES RENDERING & MAP
// ============================================