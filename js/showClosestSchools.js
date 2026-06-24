function showClosestSchools(home) {
  clearClosestSchools();
  if (!hasCoordinates(home)) {
    elements.schoolFallback.hidden = false;
    return;
  }
  const schoolsWithDistance = state.schools.filter(hasCoordinates).map(school => ({
    ...school,
    distance: calculateDistanceInMiles(home.latitude, home.longitude, school.latitude, school.longitude)
  })).sort((a, b) => a.distance - b.distance).slice(0, 10);
  if (schoolsWithDistance.length === 0) {
    elements.schoolFallback.hidden = false;
    return;
  }
  schoolsWithDistance.forEach(school => {
    const item = document.createElement("li");
    item.className = "school-item";
    const title = document.createElement("strong");
    title.textContent = school.name;
    item.appendChild(title);
    const meta = [school.level, school.type].filter(Boolean).join(" • ");
    if (meta) {
      const metaLine = document.createElement("div");
      metaLine.className = "school-meta";
      metaLine.textContent = meta;
      item.appendChild(metaLine);
    }
    if (school.formattedAddress) {
      const addressLine = document.createElement("div");
      addressLine.className = "school-meta";
      addressLine.textContent = school.formattedAddress;
      item.appendChild(addressLine);
    }
    const distanceLine = document.createElement("div");
    distanceLine.className = "school-distance";
    distanceLine.textContent = `${school.distance.toFixed(2)} miles away`;
    item.appendChild(distanceLine);
    elements.closestSchools.appendChild(item);
  });
}