function initializeDetailMap(bounds) {
  if (detailMap) return;
  const detailMapDiv = document.getElementById("detailMap");
  if (!detailMapDiv) return;
  detailMap = L.map(detailMapDiv).setView(bounds, 10);
  console.log("load");
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
  }).addTo(detailMap);
  detailMarkersLayer = L.layerGroup().addTo(detailMap);
}