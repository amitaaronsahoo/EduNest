function normalizeSearchText(value) {
  return normalizeText(value).normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/&/g, " and ").replace(/['\u2019.]/g, "").replace(/[^a-zA-Z0-9]+/g, " ").toLowerCase().trim().replace(/\s+/g, " ");
}