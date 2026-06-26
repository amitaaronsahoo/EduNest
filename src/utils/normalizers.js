import { SCHOOL_LEVEL_LABELS } from "./constants.js";
import { formatSchoolAddress } from "./formatters.js";

export function normalizeText(value) {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value).trim().replace(/\s+/g, " ");
}

export function normalizeOptionalText(value) {
  const normalized = normalizeText(value);
  return normalized || null;
}

export function normalizeSearchText(value) {
  return normalizeText(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/['\u2019.]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

export function parseCoordinate(value) {
  if (value === null || value === undefined || value === "") {
    return NaN;
  }
  return Number(value);
}

export function normalizeSchoolType(value) {
  const type = normalizeOptionalText(value);
  if (!type) return null;
  if (type === "JCPS") return type;
  return type
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function normalizeSchoolLevel(value) {
  const code = normalizeText(value).toUpperCase();
  return {
    code: code || null,
    label: SCHOOL_LEVEL_LABELS[code] || "Unknown"
  };
}

export function normalizeSchool(feature, index) {
  const coordinates = feature?.geometry?.coordinates || [];
  const longitude = Number(coordinates[0]);
  const latitude = Number(coordinates[1]);
  if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) {
    return null;
  }

  const name = normalizeOptionalText(feature?.properties?.SCH_NAME) || "Unknown School";
  const shortName = normalizeOptionalText(feature?.properties?.SCH_AB);
  const { code: levelCode, label: level } = normalizeSchoolLevel(feature?.properties?.LEVEL_);
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
    formattedAddress: formatSchoolAddress({ address, city, stateCode, zip }),
    searchName: normalizeSearchText(name),
    searchText: normalizeSearchText(searchFields)
  };
}
