// ============================================
// EVENT BINDING
// ============================================

// Get all checked school checkboxes from the schools list
function getCheckedSchools() {
  const checkedSchoolIds = [];
  document.querySelectorAll('.school input[type="checkbox"]:checked').forEach(checkbox => {
    const schoolId = Number(checkbox.getAttribute('data-school-id'));
    if (!isNaN(schoolId)) {
      checkedSchoolIds.push(schoolId);
    }
  });
  return state.schools.filter(school => checkedSchoolIds.includes(school.id));
}

// Find all homes nearby the selected schools (within 5 miles)