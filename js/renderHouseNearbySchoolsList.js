function renderHouseNearbySchoolsList(schools) {
  if (!elements.houseNearbySchools) return;
  elements.houseNearbySchools.innerHTML = "";
  if (schools.length === 0) {
    elements.houseSchoolResults.textContent = "No nearby schools found for this house.";
    elements.houseNearbySchools.innerHTML = '<div style="color:#475569;">Try adjusting the school filters.</div>';
    return;
  }
  elements.houseSchoolResults.textContent = `${schools.length} nearby school${schools.length !== 1 ? "s" : ""} found`;
  schools.forEach(school => {
    const card = document.createElement("div");
    card.style.cssText = "padding:14px; border:1px solid #e5e7eb; border-radius:12px; background:#fff;";
    card.innerHTML = `
      <strong>${school.name}</strong>
      <div style="margin:6px 0 4px; color:#475569; font-size:0.95rem;">${school.level || ""} ${school.type ? '• ' + school.type : ''}</div>
      <div style="font-size:0.9rem; color:#475569;">${school.formattedAddress || ""}</div>
      <div style="margin-top:8px; font-size:0.9rem; color:#475569;">${school.distance.toFixed(2)} miles away</div>
    `;
    elements.houseNearbySchools.appendChild(card);
  });
}