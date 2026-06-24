function renderSchoolsList(schools = null, searchQuery = "") {
  const baseSchools = schools || state.schoolsFiltered || [];
  const normalizedQuery = normalizeSearchText(searchQuery);
  const checkedSchoolIds = getCheckedSchoolIds();
  let schoolsToRender = normalizedQuery ? baseSchools.filter(s => s.searchName.includes(normalizedQuery)) : [...baseSchools];
  const checkedSchools = state.schools.filter(school => checkedSchoolIds.has(school.id));
  checkedSchools.forEach(school => {
    if (!schoolsToRender.some(s => s.id === school.id)) {
      schoolsToRender.push(school);
    }
  });
  schoolsToRender.sort((a, b) => {
    const aChecked = checkedSchoolIds.has(a.id) ? 0 : 1;
    const bChecked = checkedSchoolIds.has(b.id) ? 0 : 1;
    if (aChecked !== bChecked) return aChecked - bChecked;
    return a.name.localeCompare(b.name);
  });
  if (schoolsToRender.length === 0) {
    elements.schoolsList.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #475569; padding: 20px;">No schools found</div>';
    elements.schoolResults.textContent = "0 schools found";
    return;
  }
  elements.schoolResults.textContent = `${schoolsToRender.length} school${schoolsToRender.length !== 1 ? "s" : ""} found`;
  elements.schoolsList.innerHTML = "";
  schoolsToRender.forEach(school => {
    const row = document.createElement("div");
    row.className = "school";
    row.style.display = "grid";
    row.style.gridTemplateColumns = "2fr 2fr 1fr 1fr 1fr";
    row.innerHTML = `
      <div class="name">${school.name}</div>
      <div class="address">${school.formattedAddress}</div>
      <div><span class="tag"><span class="label-2">${school.level || "N/A"}</span></span></div>
      <div><span class="tag"><span class="label-2">${school.type || "N/A"}</span></span></div>
      <div><input type="checkbox" id="school-${school.id}" data-school-id="${school.id}" ${checkedSchoolIds.has(school.id) ? "checked" : ""}><label for="school-${school.id}">Select</label></div>
    `;
    row.onclick = event => {
      const checkbox = row.querySelector(`input[data-school-id="${school.id}"]`);
      checkbox.checked = !checkbox.checked;
    };
    row.onmouseover = () => {
      row.style.backgroundColor = "#C9C9C9";
    };
    row.onmouseout = () => {
      row.style.backgroundColor = "#ffffff";
    };
    elements.schoolsList.appendChild(row);
  });
}