function parseCoordinate(value) {
  if (value === null || value === undefined || value === "") {
    return NaN;
  }
  return Number(value);
}