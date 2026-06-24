function renderMapForSchool(nearbyHomes, ...school) {
  lastSelectedSchool = school || [];
  lastNearbyHomes = nearbyHomes || [];
  // Ensure map exists
  if (!map) {
    map = L.map("map").setView([37.8, -85], 4);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    }).addTo(map);
    markersLayer = L.layerGroup().addTo(map);
  }

  // Clear existing markers
  markersLayer.clearLayers();
  const bounds = [];

  // Add school marker (distinct style)
  lastSelectedSchool.forEach(school => {
    const schoolLatLng = [school.latitude, school.longitude];
    bounds.push(schoolLatLng);
    // Determine icon URL: developer-provided or default SVG
    const defaultSvg = encodeURIComponent(`<?xml version="1.0" encoding="UTF-8"?><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%231f4f99'><path d='M12 2l7 4v6c0 5-3 9-7 11-4-2-7-6-7-11V6l7-4z'/><path d='M11 11h2v6h-2z' fill='%23fff'/></svg>`);
    const iconUrl = SCHOOL_ICON_URL || `data:image/svg+xml;utf8,${defaultSvg}`;
    const schoolIcon = L.icon({
      iconUrl,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -36]
    });
    const schoolMarker = L.marker(schoolLatLng, {
      title: school.name,
      icon: schoolIcon
    });
    schoolMarker.bindPopup(`
    <div style="min-width:220px">
      <h3>${school.name}</h3>
      <div class="school-meta">${school.level || ""} ${school.type ? '• ' + school.type : ''}</div>
      ${school.formattedAddress ? `<div class="school-meta">${school.formattedAddress}</div>` : ''}
      ${school.phone ? `<div class="school-meta">${school.phone}</div>` : ''}
      ${school.website ? `<div class="school-meta"><a href="${school.website}" target="_blank" rel="noopener noreferrer">Website</a></div>` : ''}
    </div>
  `);
    schoolMarker.addTo(markersLayer);

    // Add nearby homes markers
    nearbyHomes.forEach(home => {
      if (!hasCoordinates(home)) return;
      const latLng = [home.latitude, home.longitude];
      bounds.push(latLng);
      const marker = L.marker(latLng);
      let message = `
      <div style="min-width:220px">
        <h3>${home.formattedAddress}</h3>
        <p><strong>Price:</strong> ${currency(home.price)}</p>
        <p><strong>Bedrooms:</strong> ${home.bedrooms} • <strong>Bathrooms:</strong> ${home.bathrooms}</p>
        ${typeof home.distanceToSchool === 'number' ? `<div class="school-distance">${home.distanceToSchool.toFixed(2)} miles from ${school.name}</div>` : ''}
        <a href="${generateZillowUrl(home.formattedAddress)}" target="_blank" rel="noopener noreferrer">View on Zillow</a>
      </div>
    `;
      lastSelectedSchool.forEach(school => {
        message.includes(school.name) || (message += `<div class="school-distance">${calculateDistanceInMiles(home.latitude, home.longitude, school.latitude, school.longitude).toFixed(2)} miles from ${school.name}</div>`);
      });
      marker.bindPopup(message);
      marker.on("click", () => {
        renderHouseDetailView(home);
      });
      marker.addTo(markersLayer);
    });

    // Fit bounds to include school and homes
    if (bounds.length === 1) {
      map.setView(schoolLatLng, 14);
    } else if (bounds.length > 1) {
      map.fitBounds(bounds, {
        padding: [50, 50]
      });
      map.setView([38.19, -85.68], 11);
    }

    // Populate side results with nearby homes
    populateHomeResults(nearbyHomes);
    setTimeout(() => {
      if (map) {
        map.invalidateSize();
      }
    }, 120);
  });
}