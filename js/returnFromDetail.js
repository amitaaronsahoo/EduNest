function returnFromDetail() {
  if (currentTab == "saved") {
    document.getElementById("house-details-content").style.display = "none";
    document.getElementById("homes-content").style.display = "none";
    document.getElementById("homes-sidebar").style.display = "none";
    document.getElementById("schools-sidebar").style.display = "none";
    document.getElementById("saved-content").style.display = "block";
    document.querySelectorAll(".tab-btn").forEach(btn => btn.style.opacity = "0.6");
    document.getElementById("tab-saved").style.opacity = "1";
  } else {
    document.getElementById("house-details-content").style.display = "none";
    document.getElementById("homes-content").style.display = "block";
    document.getElementById("homes-sidebar").style.display = "block";
    document.getElementById("schools-sidebar").style.display = "none";
    document.querySelectorAll(".tab-btn").forEach(btn => btn.style.opacity = "0.6");
    document.getElementById("tab-homes").style.opacity = "1";
    setTimeout(() => {
      if (map) {
        map.invalidateSize();
      }
    }, 120);
  }
}