function updateSaveButtons() {
  document.querySelectorAll("[data-save-home-id]").forEach(button => {
    const homeId = Number(button.dataset.saveHomeId);
    if (savedHouseIds.has(homeId)) {
      button.textContent = "Remove Saved";
      button.classList.add("saved");
    } else {
      button.textContent = "Save House";
      button.classList.remove("saved");
    }
  });
}

// ============================================
// SCHOOL NORMALIZATION & RENDERING
// ============================================