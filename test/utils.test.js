const {
  readSource,
  expectNonEmptyText
} = require("./sourceTestUtils");

describe("src/utils directory coverage", () => {
  test("calculations exports distance and score helpers", () => {
    const calculations = readSource(["src", "utils", "calculations.js"]);
    expectNonEmptyText(calculations);
    expect(calculations).toMatch(/export\s+function\s+calculateDistanceInMiles/);
    expect(calculations).toMatch(/export\s+function\s+getSchoolMatchScore/);
  });

  test("formatters exports currency and URL helpers", () => {
    const formatters = readSource(["src", "utils", "formatters.js"]);
    expectNonEmptyText(formatters);
    expect(formatters).toMatch(/export\s+function\s+currency/);
    expect(formatters).toMatch(/export\s+function\s+formatSchoolAddress/);
    expect(formatters).toMatch(/export\s+function\s+generateZillowUrl/);
  });

  test("normalizers exports school normalization helpers", () => {
    const normalizers = readSource(["src", "utils", "normalizers.js"]);
    expectNonEmptyText(normalizers);
    expect(normalizers).toMatch(/export\s+function\s+normalizeSearchText/);
    expect(normalizers).toMatch(/export\s+function\s+parseCoordinate/);
    expect(normalizers).toMatch(/export\s+function\s+normalizeSchool/);
  });

  test("validators exports coordinate and saved-home checks", () => {
    const validators = readSource(["src", "utils", "validators.js"]);
    expectNonEmptyText(validators);
    expect(validators).toMatch(/export\s+function\s+hasCoordinates/);
    expect(validators).toMatch(/export\s+function\s+isHouseSaved/);
  });

  test("constants exports core application constants", () => {
    const constants = readSource(["src", "utils", "constants.js"]);
    expectNonEmptyText(constants);
    expect(constants).toMatch(/export\s+const\s+DATA_PATHS/);
    expect(constants).toMatch(/export\s+const\s+SCHOOL_ICON_URL/);
    expect(constants).toMatch(/export\s+const\s+SCHOOL_LEVEL_LABELS/);
  });
});
