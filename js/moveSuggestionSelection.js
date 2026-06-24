function moveSuggestionSelection(delta) {
  const list = elements.schoolSuggestionsList;
  if (!list || list.style.display === "none") return;
  const items = Array.from(list.children);
  if (!items.length) return;
  let idx = Number(list.dataset.activeIndex || -1);
  idx = Math.max(-1, Math.min(items.length - 1, idx + delta));
  items.forEach((it, i) => it.classList.toggle("active", i === idx));
  list.dataset.activeIndex = String(idx);
}