export function calculateDistanceInMiles(lat1, lon1, lat2, lon2) {
  // Guardrail fallback to prevent calculation errors on missing coordinate data (NFR10)
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) {
    return Number.POSITIVE_INFINITY;
  }

  const toRadians = degrees => (degrees * Math.PI) / 180;
  const earthRadiusMiles = 3958.8;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusMiles * c;
}


export function getSchoolMatchScore(school, query) {
  if (!query) {
    return Number.POSITIVE_INFINITY;
  }
  if (school.searchName === query) {
    return 0;
  }
  if (school.searchName.startsWith(query)) {
    return 1;
  }
  if (` ${school.searchName} `.includes(` ${query} `)) {
    return 2;
  }
  if (school.searchName.includes(query)) {
    return 3;
  }
  if (school.searchText.startsWith(query)) {
    return 4;
  }
  if (` ${school.searchText} `.includes(` ${query} `)) {
    return 5;
  }
  if (school.searchText.includes(query)) {
    return 6;
  }
  return Number.POSITIVE_INFINITY;
}
