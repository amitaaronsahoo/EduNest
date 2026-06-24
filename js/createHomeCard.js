function createHomeCard(home) {
  const isSaved = isHouseSaved(home);
  const distanceText = typeof home.distanceToSchool === "number" ? `<div class="school-distance">${home.distanceToSchool.toFixed(2)} miles from selected school</div>` : "";
  const card = document.createElement("article");
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
  return card;
}