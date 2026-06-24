function getCheckedSchoolIds() {
  return new Set(Array.from(document.querySelectorAll('.school input[type="checkbox"]:checked')).map(checkbox => Number(checkbox.dataset.schoolId)).filter(schoolId => !isNaN(schoolId)));
}