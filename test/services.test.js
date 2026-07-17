const {
  readSource,
  expectNonEmptyText
} = require("./sourceTestUtils");

describe("src/services directory coverage", () => {
  test("SchoolService exports key filtering and search APIs", () => {
    const schoolService = readSource(["src", "services", "SchoolService.js"]);
    expectNonEmptyText(schoolService);
    expect(schoolService).toMatch(/export\s+class\s+SchoolService/);
    expect(schoolService).toMatch(/applyFilters\s*\(/);
    expect(schoolService).toMatch(/searchSchools\s*\(/);
    expect(schoolService).toMatch(/findBestSchoolMatch\s*\(/);
    expect(schoolService).toMatch(/export\s+default\s+SchoolService/);
  });

  test("HomeService exports key filtering and proximity APIs", () => {
    const homeService = readSource(["src", "services", "HomeService.js"]);
    expectNonEmptyText(homeService);
    expect(homeService).toMatch(/export\s+class\s+HomeService/);
    expect(homeService).toMatch(/applyFilters\s*\(/);
    expect(homeService).toMatch(/sortHomes\s*\(/);
    expect(homeService).toMatch(/getNearbyHomesForSchool\s*\(/);
    expect(homeService).toMatch(/getNearbySchoolsForHome\s*\(/);
    expect(homeService).toMatch(/export\s+default\s+HomeService/);
  });

  test("SavedHousesService exports key persistence APIs", () => {
    const savedService = readSource(["src", "services", "SavedHousesService.js"]);
    expectNonEmptyText(savedService);
    expect(savedService).toMatch(/export\s+class\s+SavedHousesService/);
    expect(savedService).toMatch(/loadSavedHouses\s*\(/);
    expect(savedService).toMatch(/persistSavedHouses\s*\(/);
    expect(savedService).toMatch(/toggleSavedHouse\s*\(/);
    expect(savedService).toMatch(/export\s+default\s+SavedHousesService/);
  });
});
