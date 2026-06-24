function normalizeSchoolType(value) {
  const type = normalizeOptionalText(value);
  if (!type) return null;
  if (type === "JCPS") return type;
  return type.toLowerCase().split(" ").filter(Boolean).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}