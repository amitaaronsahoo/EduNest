// ============================================
// TAB SWITCHING
// ============================================

function switchTab(tab) {
  currentTab = tab;
  document.getElementById("schools-content").style.display = tab === "schools" ? "block" : "none";
  document.getElementById("homes-content").style.display = tab === "homes" ? "block" : "none";
  document.getElementById("saved-content").style.display = tab === "saved" ? "block" : "none";
  document.getElementById("house-details-content").style.display = "none";
  document.getElementById("schools-sidebar").style.display = tab === "schools" ? "block" : "none";
  document.getElementById("homes-sidebar").style.display = tab === "homes" ? "block" : "none";
  document.querySelectorAll(".tab-btn").forEach(btn => btn.style.opacity = "0.6");
  document.getElementById(`tab-${tab}`).style.opacity = "1";
  if (tab === "homes") {
    if (!map) {
      renderHomes(state.filteredHomes);
    }
    setTimeout(() => {
      if (map) {
        map.invalidateSize();
      }
    }, 120);
  }
}