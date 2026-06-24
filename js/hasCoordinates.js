function hasCoordinates(record) {
  return typeof record?.latitude === "number" && typeof record?.longitude === "number" && Number.isFinite(record.latitude) && Number.isFinite(record.longitude) && !Number.isNaN(record.latitude) && !Number.isNaN(record.longitude);
}