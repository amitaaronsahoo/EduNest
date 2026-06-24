// ============================================
// SCHOOL NORMALIZATION & RENDERING
// ============================================

function normalizeSchool(feature, index) {
  const coordinates = feature?.geometry?.coordinates || [];
  const longitude = Number(coordinates[0]);
  const latitude = Number(coordinates[1]);
  if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) {
    return null;
  }
  const name = normalizeOptionalText(feature?.properties?.SCH_NAME) || "Unknown School";
  const shortName = normalizeOptionalText(feature?.properties?.SCH_AB);
  const {
    code: levelCode,
    label: level
  } = normalizeSchoolLevel(feature?.properties?.LEVEL_);
  const type = normalizeSchoolType(feature?.properties?.LOC_TYPE);
  const address = normalizeOptionalText(feature?.properties?.ADDRESS);
  const city = normalizeOptionalText(feature?.properties?.CITY);
  const stateCode = normalizeOptionalText(feature?.properties?.ST);
  const zip = normalizeOptionalText(feature?.properties?.ZIP);
  const searchFields = [name, shortName, level, type, address, city].filter(Boolean).join(" ");
  return {
    id: Number(feature?.properties?.OBJECTID) || index + 1,
    name,
    shortName,
    levelCode,
    level,
    type,
    address,
    city,
    stateCode,
    zip,
    phone: normalizeOptionalText(feature?.properties?.PHONE),
    website: normalizeOptionalText(feature?.properties?.SCH_WEB),
    longitude,
    latitude,
    formattedAddress: formatSchoolAddress({
      address,
      city,
      stateCode,
      zip
    }),
    searchName: normalizeSearchText(name),
    searchText: normalizeSearchText(searchFields)
  };
}