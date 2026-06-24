function renderSavedHouses() {
  elements.savedHousesCount.textContent = `${savedHouses.length} home${savedHouses.length !== 1 ? "s" : ""} saved`;
  elements.savedHousesList.innerHTML = "";
  if (savedHouses.length === 0) {
    elements.savedHousesList.innerHTML = '<div style="color: #475569; font-size: 0.9rem;">No homes saved yet</div>';
    elements.savedHouses.innerHTML = '<div style="text-align: center; color: #475569; padding: 40px; grid-column: 1/-1;">No homes saved yet</div>';
    return;
  }
  savedHouses.forEach(home => {
    const item = document.createElement("div");
    item.style.cssText = "padding: 8px; background: #f3f4f6; border-radius: 4px; margin-bottom: 8px; cursor: pointer;";
    item.innerHTML = `
      <div style="font-weight: 600; font-size: 0.9rem;">${home.formattedAddress}</div>
      <div style="font-size: 0.85rem; color: #475569;">${currency(home.price)}</div>
    `;
    item.onclick = () => {
      document.querySelector("#tab-homes").click();
      setTimeout(() => switchTab("saved"), 50);
    };
    elements.savedHousesList.appendChild(item);
  });

  // Render saved homes in saved section
  elements.savedHouses.innerHTML = "";
  savedHouses.forEach(home => {
    const isSaved = true;
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${home.formattedAddress}</h3>
      <p><strong>Type:</strong> ${home.propertyType || "N/A"}</p>
      <p><strong>Bedrooms:</strong> ${home.bedrooms} • <strong>Bathrooms:</strong> ${home.bathrooms}</p>
      <p><strong>Price:</strong> ${currency(home.price)}</p>
      <div style="display: flex; gap: 0.5rem;">
      <button style="flex:1; padding: 8px; border:none; background:#1f4f99; color:#fff; border-radius:8px; cursor:pointer;" onclick="renderHouseDetailView(state.houses.find(h => h.id === ${home.id}))">View Details</button>`;
    card.homeData = home;
    elements.savedHouses.appendChild(card);
  });
}