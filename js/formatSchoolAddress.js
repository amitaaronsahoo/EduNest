function formatSchoolAddress({
  address,
  city,
  stateCode,
  zip
}) {
  const locality = [city, stateCode].filter(Boolean).join(", ");
  return [address, locality, zip].filter(Boolean).join(" ");
}

// ============================================
// SAVED HOUSES MANAGEMENT
// ============================================