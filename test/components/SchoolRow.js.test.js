const { readSource, expectNonEmptyText } = require("../sourceTestUtils");

describe("SchoolRow component JS coverage", () => {
  test("module exists and exports a class", () => {
    const content = readSource(["src", "components", "SchoolRow", "SchoolRow.js"]);
    expectNonEmptyText(content);
    expect(content).toMatch(/export\s+(class|default\s+class)\s+SchoolRow/);
    expect(content).toMatch(/export\s+default\s+SchoolRow/);
  });

  test("contains rendering surface", () => {
    const content = readSource(["src", "components", "SchoolRow", "SchoolRow.js"]);
    expect(content).toMatch(/render\s*\(/);
  });
});
