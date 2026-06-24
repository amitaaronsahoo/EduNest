function normalizeSchoolLevel(value) {
  const code = normalizeText(value).toUpperCase();
  return {
    code: code || null,
    label: SCHOOL_LEVEL_LABELS[code] || "Unknown"
  };
}