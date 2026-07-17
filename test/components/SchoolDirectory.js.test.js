const { readSource, expectNonEmptyText } = require("../sourceTestUtils");

describe("SchoolDirectory component JS coverage", () => {
  test("module exists and exports a class", () => {
    const content = readSource(["src", "components", "SchoolDirectory", "SchoolDirectory.js"]);
    expectNonEmptyText(content);
    expect(content).toMatch(/export\s+(class|default\s+class)\s+SchoolDirectory/);
    expect(content).toMatch(/export\s+default\s+SchoolDirectory/);
  });

  test("contains rendering surface", () => {
    const content = readSource(["src", "components", "SchoolDirectory", "SchoolDirectory.js"]);
    expect(content).toMatch(/render\s*\(/);
  });
});
