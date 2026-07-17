const { readSource, expectNonEmptyText } = require("../sourceTestUtils");

describe("SchoolSearch component JS coverage", () => {
  test("module exists and exports a class", () => {
    const content = readSource(["src", "components", "SchoolSearch", "SchoolSearch.js"]);
    expectNonEmptyText(content);
    expect(content).toMatch(/export\s+(class|default\s+class)\s+SchoolSearch/);
    expect(content).toMatch(/export\s+default\s+SchoolSearch/);
  });

  test("contains rendering surface", () => {
    const content = readSource(["src", "components", "SchoolSearch", "SchoolSearch.js"]);
    expect(content).toMatch(/render\s*\(/);
  });
});
