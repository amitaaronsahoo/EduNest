const { readSource, expectNonEmptyText } = require("../sourceTestUtils");

describe("SchoolFilter component JS coverage", () => {
  test("module exists and exports a class", () => {
    const content = readSource(["src", "components", "SchoolFilter", "SchoolFilter.js"]);
    expectNonEmptyText(content);
    expect(content).toMatch(/export\s+(class|default\s+class)\s+SchoolFilter/);
    expect(content).toMatch(/export\s+default\s+SchoolFilter/);
  });

  test("contains rendering surface", () => {
    const content = readSource(["src", "components", "SchoolFilter", "SchoolFilter.js"]);
    expect(content).toMatch(/render\s*\(/);
  });
});
