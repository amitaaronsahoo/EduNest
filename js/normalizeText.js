function normalizeText(value) {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value).trim().replace(/\s+/g, " ");
}