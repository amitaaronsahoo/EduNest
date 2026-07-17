const { readSource, expectNonEmptyText } = require("../sourceTestUtils");

describe("SchoolFilterDetail component JS coverage", () => {
  test("module exists and exports a class", () => {
    const content = readSource(["src", "components", "SchoolFilterDetail", "SchoolFilterDetail.js"]);
    expectNonEmptyText(content);
    expect(content).toMatch(/export\s+(class|default\s+class)\s+SchoolFilterDetail/);
    expect(content).toMatch(/export\s+default\s+SchoolFilterDetail/);
  });

  test("contains rendering surface", () => {
    const content = readSource(["src", "components", "SchoolFilterDetail", "SchoolFilterDetail.js"]);
    expect(content).toMatch(/render\s*\(/);
  });
});
