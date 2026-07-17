const { readSource, expectNonEmptyText } = require("../sourceTestUtils");

describe("SchoolSearchHome component JS coverage", () => {
  test("module exists and exports a class", () => {
    const content = readSource(["src", "components", "SchoolSearchHome", "SchoolSearchHome.js"]);
    expectNonEmptyText(content);
    expect(content).toMatch(/export\s+(class|default\s+class)\s+SchoolSearchHome/);
    expect(content).toMatch(/export\s+default\s+SchoolSearchHome/);
  });

  test("contains rendering surface", () => {
    const content = readSource(["src", "components", "SchoolSearchHome", "SchoolSearchHome.js"]);
    expect(content).toMatch(/render\s*\(/);
  });
});
