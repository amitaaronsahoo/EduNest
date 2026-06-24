function currency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function calculateDistanceInMiles(lat1, lon1, lat2, lon2) {
  const toRadians = (degrees) => (degrees * Math.PI) / 180;
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

function hasCoordinates(record) {
  return (
    typeof record?.latitude === "number" &&
    typeof record?.longitude === "number" &&
    Number.isFinite(record.latitude) &&
    Number.isFinite(record.longitude) &&
    !Number.isNaN(record.latitude) &&
    !Number.isNaN(record.longitude)
  );
}

function parseCoordinate(value) {
  if (value === null || value === undefined || value === "") {
    return NaN;
  }
  return Number(value);
}

function normalizeText(value) {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value).trim().replace(/\s+/g, " ");
}

function normalizeOptionalText(value) {
  const normalized = normalizeText(value);
  return normalized || null;
}

function normalizeSearchText(value) {
  return normalizeText(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[\'\u2019.]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

function normalizeSchoolLevel(value) {
  const code = normalizeText(value).toUpperCase();
  return {
    code: code || null,
    label: SCHOOL_LEVEL_LABELS[code] || "Unknown",
  };
}

function normalizeSchoolType(value) {
  const type = normalizeOptionalText(value);
  if (!type) return null;
  if (type === "JCPS") return type;
  return type
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function generateZillowUrl(formattedAddress = "") {
  const address = String(formattedAddress).trim();
  const withoutPunctuation = address.replace(/[.,]/g, "");
  const withHyphens = withoutPunctuation.replace(/\s+/g, "-");
  return `https://www.zillow.com/homes/${withHyphens}_rb/`;
}

function formatSchoolAddress({ address, city, stateCode, zip }) {
  const locality = [city, stateCode].filter(Boolean).join(", ");
  return [address, locality, zip].filter(Boolean).join(" ");
}