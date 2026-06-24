function normalizeOptionalText(value) {
  const normalized = normalizeText(value);
  return normalized || null;
}