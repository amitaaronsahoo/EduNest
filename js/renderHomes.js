// ============================================
// HOMES RENDERING & MAP
// ============================================

function renderHomes(homes) {
  elements.results.innerHTML = "";
  if (homes.length === 0) {
    elements.emptyState.textContent = "No homes found. Try adjusting your filters.";
    elements.emptyState.hidden = false;
    return;
  }
  elements.emptyState.hidden = true;
  homes.forEach(home => {
    const isSaved = isHouseSaved(home);
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${home.formattedAddress}</h3>
      <p><strong>Type:</strong> ${home.propertyType || "N/A"}</p>
      <p><strong>Bedrooms:</strong> ${home.bedrooms} • <strong>Bathrooms:</strong> ${home.bathrooms}</p>
      <p><strong>Square Feet:</strong> ${home.squareFeet ?? "N/A"}</p>
      <p><strong>Price:</strong> ${currency(home.price)}</p>
      
    `;
    card.onclick = () => {
      renderHouseDetailView(home);
    };
    elements.results.appendChild(card);
  });
  updateSaveButtons();
  initializeMap();
  if (map && markersLayer) {
    markersLayer.clearLayers();
    const bounds = [];
    homes.forEach(home => {
      if (!hasCoordinates(home)) return;
      const latLng = [home.latitude, home.longitude];
      bounds.push(latLng);
      const marker = L.marker(latLng);
      marker.on("click", () => {
        renderHouseDetailView(home);
      });
      marker.addTo(markersLayer);
    });
    if (bounds.length > 0) {
      map.fitBounds(bounds, {
        padding: [50, 50]
      });
    }
    setTimeout(() => {
      if (map) {
        map.invalidateSize();
      }
    }, 150);
  }
}