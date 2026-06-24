function initializeMap() {
  if (map) return;
  const mapDiv = document.getElementById("map");
  if (!mapDiv) return;
  map = L.map(mapDiv).setView([38.2, -85.8], 11);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
  }).addTo(map);
  markersLayer = L.layerGroup().addTo(map);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================