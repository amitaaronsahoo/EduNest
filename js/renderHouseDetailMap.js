function renderHouseDetailMap(home, schools) {
  const houseLatLng = [home.latitude, home.longitude];
  const bounds = [houseLatLng];
  initializeDetailMap(houseLatLng);
  if (!detailMap || !detailMarkersLayer) return;
  detailMarkersLayer.clearLayers();
  const houseMarker = L.marker(houseLatLng, {
    title: home.formattedAddress
  });
  houseMarker.bindPopup(`
    <div style="min-width:220px;">
      <h3>${home.formattedAddress}</h3>
      <p><strong>Price:</strong> ${currency(home.price)}</p>
      <p><strong>Bedrooms:</strong> ${home.bedrooms} • <strong>Bathrooms:</strong> ${home.bathrooms}</p>
    </div>
  `);
  houseMarker.addTo(detailMarkersLayer);
  schools.forEach(school => {
    if (!hasCoordinates(school)) return;
    const schoolLatLng = [school.latitude, school.longitude];
    bounds.push(schoolLatLng);
    const schoolIcon = L.icon({
      iconUrl: SCHOOL_ICON_URL,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
    const schoolMarker = L.marker(schoolLatLng, {
      title: school.name,
      icon: schoolIcon
    });
    schoolMarker.bindPopup(`
      <div style="min-width:220px;">
        <h4>${school.name}</h4>
        <div style="margin-bottom:4px; color:#475569;">${school.level || ""} ${school.type ? '• ' + school.type : ''}</div>
        <div>${school.formattedAddress || ""}</div>
        <div style="margin-top:6px; font-size:0.9rem; color:#475569;">${school.distance.toFixed(2)} miles away</div>
      </div>
    `);
    schoolMarker.addTo(detailMarkersLayer);
  });
  if (bounds.length === 1) {
    detailMap.setView(houseLatLng, 14);
  } else {
    detailMap.fitBounds(bounds, {
      padding: [50, 50]
    });
    detailMap.setView(detailMap.getCenter(), 12);
  }
  setTimeout(() => {
    if (detailMap) {
      detailMap.invalidateSize();
    }
  }, 150);
}